import { Gem, GameBoard, Match, GemType, GemPower, LevelConfig, GameState } from '../types/game';

export class GameEngine {
  private board: GameBoard;
  private score: number = 0;
  private moves: number = 0;
  private level: number = 1;
  private isGameOver: boolean = false;
  private selectedGem: Gem | null = null;
  private combos: number = 0;

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
    const matches: Match[] = [];
    const visited = new Set<string>();

    // Check horizontal matches
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width - 2; x++) {
        const gem1 = this.board.gems[y][x];
        const gem2 = this.board.gems[y][x + 1];
        const gem3 = this.board.gems[y][x + 2];

        if (gem1.type === gem2.type && gem2.type === gem3.type) {
          const matchGems = [gem1, gem2, gem3];
          
          // Extend match to the right
          let endX = x + 3;
          while (endX < this.width && this.board.gems[y][endX].type === gem1.type) {
            matchGems.push(this.board.gems[y][endX]);
            endX++;
          }

          // Extend match to the left
          let startX = x - 1;
          while (startX >= 0 && this.board.gems[y][startX].type === gem1.type) {
            matchGems.unshift(this.board.gems[y][startX]);
            startX--;
          }

          const match: Match = {
            gems: matchGems,
            type: matchGems.length >= 5 ? 'five_in_row' : 'horizontal',
            power: this.getPowerForMatch(matchGems.length)
          };

          matches.push(match);
          
          // Mark gems as visited
          matchGems.forEach(gem => visited.add(gem.id));
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height - 2; y++) {
        const gem1 = this.board.gems[y][x];
        const gem2 = this.board.gems[y + 1][x];
        const gem3 = this.board.gems[y + 2][x];

        if (gem1.type === gem2.type && gem2.type === gem3.type && !visited.has(gem1.id)) {
          const matchGems = [gem1, gem2, gem3];
          
          // Extend match down
          let endY = y + 3;
          while (endY < this.height && this.board.gems[endY][x].type === gem1.type) {
            matchGems.push(this.board.gems[endY][x]);
            endY++;
          }

          // Extend match up
          let startY = y - 1;
          while (startY >= 0 && this.board.gems[startY][x].type === gem1.type) {
            matchGems.unshift(this.board.gems[startY][x]);
            startY--;
          }

          const match: Match = {
            gems: matchGems,
            type: matchGems.length >= 5 ? 'five_in_row' : 'vertical',
            power: this.getPowerForMatch(matchGems.length)
          };

          matches.push(match);
          
          // Mark gems as visited
          matchGems.forEach(gem => visited.add(gem.id));
        }
      }
    }

    return matches;
  }

  private getPowerForMatch(length: number): GemPower {
    if (length >= 5) return 'color_bomb';
    if (length === 4) return Math.random() > 0.5 ? 'row_clear' : 'column_clear';
    return 'normal';
  }

  private processMatches(matches: Match[]): void {
    if (matches.length === 0) return;

    // Calculate score
    let matchScore = 0;
    matches.forEach(match => {
      matchScore += match.gems.length * 100;
      if (match.power !== 'normal') {
        matchScore += 500; // Bonus for power-ups
      }
    });

    // Apply combo multiplier
    if (matches.length > 1) {
      this.combos++;
      matchScore *= Math.min(this.combos + 1, 5); // Max 5x multiplier
    } else {
      this.combos = 0;
    }

    this.score += matchScore;

    // Remove matched gems
    const gemsToRemove = new Set<string>();
    matches.forEach(match => {
      match.gems.forEach(gem => {
        gemsToRemove.add(gem.id);
        gem.isMatched = true;
      });
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
