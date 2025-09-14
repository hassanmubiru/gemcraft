import { Gem, GameBoard, Match, GemType, GemPower, LevelConfig, GameState } from '../types/game';
import { 
  findMatches, 
  calculateMatchScore, 
  getPowerUpForMatch, 
  processTurn, 
  areAdjacent,
  createSpecialGem,
  SpecialGemType,
  Position
} from '../utils/GameLogic';
import { ContractInteraction } from '../utils/ContractInteraction';

export class GameEngine {
  private board: GameBoard;
  private score: number = 0;
  private moves: number = 0;
  private level: number = 1;
  private isGameOver: boolean = false;
  private selectedGem: Gem | null = null;
  private combos: number = 0;
  private contractInteraction?: ContractInteraction;
  private blockchainRewards: {
    cUSDReward?: string;
    nftMinted?: boolean;
    transactionHash?: string;
  } = {};

  constructor(
    private width: number = 8,
    private height: number = 8,
    private levelConfig?: LevelConfig
  ) {
    this.board = this.createEmptyBoard();
    this.initializeBoard();
    
    if (levelConfig) {
      this.moves = levelConfig.moves;
      this.level = levelConfig.id;
    }
  }

  private createEmptyBoard(): GameBoard {
    const gems: Gem[][] = [];
    for (let y = 0; y < this.height; y++) {
      gems[y] = [];
      for (let x = 0; x < this.width; x++) {
        gems[y][x] = {
          id: `${x}-${y}`,
          type: 'ruby',
          power: 'normal',
          x,
          y,
        };
      }
    }
    return { gems, width: this.width, height: this.height };
  }

  private initializeBoard(): void {
    // Fill board with random gems, ensuring no initial matches
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.board.gems[y][x] = this.generateRandomGem(x, y);
      }
    }

    // Remove any initial matches
    this.removeInitialMatches();
  }

  private generateRandomGem(x: number, y: number): Gem {
    const gemTypes: GemType[] = ['ruby', 'sapphire', 'emerald', 'diamond', 'amethyst', 'topaz'];
    const randomType = gemTypes[Math.floor(Math.random() * gemTypes.length)];
    
    return {
      id: `${x}-${y}`,
      type: randomType,
      power: 'normal',
      x,
      y,
    };
  }

  private removeInitialMatches(): void {
    let hasMatches = true;
    while (hasMatches) {
      const matches = this.findMatches();
      if (matches.length === 0) {
        hasMatches = false;
      } else {
        // Replace matched gems with new random ones
        matches.forEach(match => {
          match.gems.forEach(gem => {
            this.board.gems[gem.y][gem.x] = this.generateRandomGem(gem.x, gem.y);
          });
        });
      }
    }
  }

  public getBoard(): GameBoard {
    return this.board;
  }

  public getGameState(): GameState {
    return {
      board: this.board,
      score: this.score,
      moves: this.moves,
      level: this.level,
      isGameOver: this.isGameOver,
      isPaused: false,
      selectedGem: this.selectedGem,
      matches: [],
      combos: this.combos,
      targetScore: this.levelConfig?.targetScore,
      timeLimit: this.levelConfig?.timeLimit,
    };
  }

  public selectGem(x: number, y: number): boolean {
    if (this.isGameOver || x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }

    const gem = this.board.gems[y][x];
    
    if (this.selectedGem === null) {
      this.selectedGem = gem;
      return true;
    }

    // Check if gems are adjacent
    if (this.areAdjacent(this.selectedGem, gem)) {
      return this.swapGems(this.selectedGem, gem);
    } else {
      this.selectedGem = gem;
      return true;
    }
  }

  private areAdjacent(gem1: Gem, gem2: Gem): boolean {
    const dx = Math.abs(gem1.x - gem2.x);
    const dy = Math.abs(gem1.y - gem2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  private swapGems(gem1: Gem, gem2: Gem): boolean {
    // Temporarily swap gems
    const temp = { ...gem1 };
    gem1.x = gem2.x;
    gem1.y = gem2.y;
    gem2.x = temp.x;
    gem2.y = temp.y;

    // Update board positions
    this.board.gems[gem1.y][gem1.x] = gem1;
    this.board.gems[gem2.y][gem2.x] = gem2;

    // Check for matches
    const matches = this.findMatches();
    
    if (matches.length > 0) {
      this.selectedGem = null;
      this.moves--;
      this.processMatches(matches);
      return true;
    } else {
      // Swap back if no matches
      const temp2 = { ...gem1 };
      gem1.x = gem2.x;
      gem1.y = gem2.y;
      gem2.x = temp2.x;
      gem2.y = temp2.y;

      this.board.gems[gem1.y][gem1.x] = gem1;
      this.board.gems[gem2.y][gem2.x] = gem2;
      
      this.selectedGem = null;
      return false;
    }
  }

  private findMatches(): Match[] {
    // Convert to GameLogic format and use enhanced match detection
    const gameBoard = {
      gems: this.board.gems.map(row => 
        row.map(gem => ({
          ...gem,
          position: { row: gem.y, col: gem.x }
        }))
      ),
      rows: this.height,
      cols: this.width
    };
    
    const matches = findMatches(gameBoard);
    
    // Convert back to GameEngine format
    return matches.map(match => ({
      gems: match.gems.map(gem => ({
        ...gem,
        x: gem.position.col,
        y: gem.position.row
      })),
      type: match.type as any,
      power: this.getPowerForMatch(match.length)
    }));
  }

  private getPowerForMatch(length: number): GemPower {
    if (length >= 5) return 'color_bomb';
    if (length === 4) return Math.random() > 0.5 ? 'row_clear' : 'column_clear';
    return 'normal';
  }

  private createPowerUp(gem: Gem, powerUpType: SpecialGemType): void {
    // Convert SpecialGemType to GemPower
    let power: GemPower = 'normal';
    switch (powerUpType) {
      case SpecialGemType.ROW_CLEAR:
        power = 'row_clear';
        break;
      case SpecialGemType.COLUMN_CLEAR:
        power = 'column_clear';
        break;
      case SpecialGemType.EXPLOSIVE:
        power = 'explosive';
        break;
      case SpecialGemType.COLOR_BOMB:
        power = 'color_bomb';
        break;
    }
    
    // Update the gem to be a power-up
    this.board.gems[gem.y][gem.x] = {
      ...gem,
      power,
      isMatched: false
    };
  }

  private processMatches(matches: Match[]): void {
    if (matches.length === 0) return;

    // Use enhanced scoring system
    const matchScore = calculateMatchScore(matches, this.combos);
    this.score += matchScore;

    // Update combo counter
    if (matches.length > 1) {
      this.combos++;
    } else {
      this.combos = 0;
    }

    // Remove matched gems and create power-ups
    const gemsToRemove = new Set<string>();
    matches.forEach(match => {
      match.gems.forEach(gem => {
        gemsToRemove.add(gem.id);
        gem.isMatched = true;
      });
      
      // Create power-up for special matches
      const powerUpType = getPowerUpForMatch(match);
      if (powerUpType && match.gems.length > 0) {
        const centerGem = match.gems[Math.floor(match.gems.length / 2)];
        this.createPowerUp(centerGem, powerUpType);
      }
    });

    // Apply power-up effects
    matches.forEach(match => {
      if (match.power !== 'normal' && match.gems.length > 0) {
        this.applyPowerUp(match.power, match.gems[0]);
      }
    });

    // Drop gems down
    this.dropGems();

    // Fill empty spaces
    this.fillEmptySpaces();

    // Check for new matches (cascades)
    const newMatches = this.findMatches();
    if (newMatches.length > 0) {
      setTimeout(() => this.processMatches(newMatches), 300);
    }

    // Check game over conditions
    this.checkGameOver();
  }

  private applyPowerUp(power: GemPower, gem: Gem): void {
    switch (power) {
      case 'row_clear':
        this.clearRow(gem.y);
        break;
      case 'column_clear':
        this.clearColumn(gem.x);
        break;
      case 'explosive':
        this.clearArea(gem.x, gem.y, 1);
        break;
      case 'color_bomb':
        this.clearColor(gem.type);
        break;
    }
  }

  private clearRow(y: number): void {
    for (let x = 0; x < this.width; x++) {
      this.board.gems[y][x].isMatched = true;
    }
  }

  private clearColumn(x: number): void {
    for (let y = 0; y < this.height; y++) {
      this.board.gems[y][x].isMatched = true;
    }
  }

  private clearArea(centerX: number, centerY: number, radius: number): void {
    for (let y = Math.max(0, centerY - radius); y <= Math.min(this.height - 1, centerY + radius); y++) {
      for (let x = Math.max(0, centerX - radius); x <= Math.min(this.width - 1, centerX + radius); x++) {
        this.board.gems[y][x].isMatched = true;
      }
    }
  }

  private clearColor(color: GemType): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.board.gems[y][x].type === color) {
          this.board.gems[y][x].isMatched = true;
        }
      }
    }
  }

  private dropGems(): void {
    for (let x = 0; x < this.width; x++) {
      let writeIndex = this.height - 1;
      
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board.gems[y][x].isMatched) {
          if (writeIndex !== y) {
            this.board.gems[writeIndex][x] = { ...this.board.gems[y][x], y: writeIndex };
          }
          writeIndex--;
        }
      }
      
      // Fill empty spaces at the top
      while (writeIndex >= 0) {
        this.board.gems[writeIndex][x] = this.generateRandomGem(x, writeIndex);
        writeIndex--;
      }
    }
  }

  private fillEmptySpaces(): void {
    // This is handled in dropGems, but kept for clarity
  }

  private checkGameOver(): void {
    if (this.moves <= 0) {
      this.isGameOver = true;
    }
    
    if (this.levelConfig && this.score >= this.levelConfig.targetScore) {
      // Level completed
      this.isGameOver = true;
    }
  }

  public getScore(): number {
    return this.score;
  }

  public getMoves(): number {
    return this.moves;
  }

  public getLevel(): number {
    return this.level;
  }

  public isGameComplete(): boolean {
    return this.isGameOver;
  }

  // Blockchain integration methods
  public setContractInteraction(contractInteraction: ContractInteraction): void {
    this.contractInteraction = contractInteraction;
  }

  public async claimBlockchainRewards(): Promise<{
    success: boolean;
    cUSDReward?: string;
    nftMinted?: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    if (!this.contractInteraction || !this.levelConfig) {
      return { success: false, error: 'Contract not connected or level config missing' };
    }

    if (!this.isGameOver || this.score < this.levelConfig.targetScore) {
      return { success: false, error: 'Level not completed or score below target' };
    }

    try {
      const result = await this.contractInteraction.completeLevel(
        this.levelConfig.id,
        this.score,
        this.levelConfig.targetScore
      );

      if (result.success) {
        this.blockchainRewards = {
          cUSDReward: result.cUSDReward,
          nftMinted: result.nftMinted,
          transactionHash: result.txHash
        };
      }

      return result;
    } catch (error) {
      console.error('Failed to claim blockchain rewards:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public getBlockchainRewards() {
    return this.blockchainRewards;
  }

  public hasClaimedRewards(): boolean {
    return !!this.blockchainRewards.transactionHash;
  }

  public canMakeMove(): boolean {
    // Check if there are any possible moves
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const gem = this.board.gems[y][x];
        
        // Check right
        if (x < this.width - 1) {
          const rightGem = this.board.gems[y][x + 1];
          if (this.wouldCreateMatch(gem, rightGem)) {
            return true;
          }
        }
        
        // Check down
        if (y < this.height - 1) {
          const downGem = this.board.gems[y + 1][x];
          if (this.wouldCreateMatch(gem, downGem)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private wouldCreateMatch(gem1: Gem, gem2: Gem): boolean {
    // Temporarily swap and check for matches
    const temp = { ...gem1 };
    gem1.x = gem2.x;
    gem1.y = gem2.y;
    gem2.x = temp.x;
    gem2.y = temp.y;

    const matches = this.findMatches();
    
    // Swap back
    const temp2 = { ...gem1 };
    gem1.x = gem2.x;
    gem1.y = gem2.y;
    gem2.x = temp2.x;
    gem2.y = temp2.y;

    return matches.length > 0;
  }
}
