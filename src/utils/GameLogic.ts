import { GameBoard, Position, Gem, GemType, Match, SwapResult, SpecialGemType } from '../types/GameTypes';

// Generate a random gem type
export const getRandomGemType = (): GemType => {
  const gemTypes = Object.values(GemType);
  return gemTypes[Math.floor(Math.random() * gemTypes.length)];
};

// Create a new gem
export const createGem = (type: GemType, position: Position, id?: string): Gem => ({
  id: id || `${position.row}-${position.col}-${Date.now()}`,
  type,
  position,
  isSpecial: false,
});

// Create a special gem
export const createSpecialGem = (
  type: GemType, 
  position: Position, 
  specialType: SpecialGemType,
  id?: string
): Gem => ({
  id: id || `${position.row}-${position.col}-${Date.now()}`,
  type,
  position,
  isSpecial: true,
  specialType,
});

// Initialize a new game board
export const createGameBoard = (rows: number, cols: number): GameBoard => {
  const gems: Gem[][] = [];
  
  for (let row = 0; row < rows; row++) {
    gems[row] = [];
    for (let col = 0; col < cols; col++) {
      let gemType = getRandomGemType();
      
      // Avoid initial matches by checking previous gems
      while (wouldCreateMatch(gems, row, col, gemType)) {
        gemType = getRandomGemType();
      }
      
      gems[row][col] = createGem(gemType, { row, col });
    }
  }
  
  return { gems, rows, cols };
};

// Check if placing a gem would create an immediate match
const wouldCreateMatch = (gems: Gem[][], row: number, col: number, gemType: GemType): boolean => {
  // Check horizontal matches
  let horizontalCount = 1;
  
  // Check left
  for (let c = col - 1; c >= 0 && gems[row][c]?.type === gemType; c--) {
    horizontalCount++;
  }
  
  // Check right
  for (let c = col + 1; c < gems[row].length && gems[row][c]?.type === gemType; c++) {
    horizontalCount++;
  }
  
  if (horizontalCount >= 3) return true;
  
  // Check vertical matches
  let verticalCount = 1;
  
  // Check up
  for (let r = row - 1; r >= 0 && gems[r][col]?.type === gemType; r--) {
    verticalCount++;
  }
  
  // Check down
  for (let r = row + 1; r < gems.length && gems[r][col]?.type === gemType; r++) {
    verticalCount++;
  }
  
  return verticalCount >= 3;
};

// Find all matches on the board
export const findMatches = (board: GameBoard): Match[] => {
  const matches: Match[] = [];
  const visited = new Set<string>();
  
  // Find horizontal matches
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols - 2; col++) {
      const gem = board.gems[row][col];
      if (!gem || visited.has(gem.id)) continue;
      
      const matchGems = [gem];
      
      // Check consecutive gems to the right
      for (let c = col + 1; c < board.cols; c++) {
        const nextGem = board.gems[row][c];
        if (nextGem && nextGem.type === gem.type) {
          matchGems.push(nextGem);
        } else {
          break;
        }
      }
      
      if (matchGems.length >= 3) {
        matchGems.forEach(g => visited.add(g.id));
        matches.push({
          gems: matchGems,
          type: 'horizontal',
          length: matchGems.length,
        });
      }
    }
  }
  
  // Find vertical matches
  for (let col = 0; col < board.cols; col++) {
    for (let row = 0; row < board.rows - 2; row++) {
      const gem = board.gems[row][col];
      if (!gem || visited.has(gem.id)) continue;
      
      const matchGems = [gem];
      
      // Check consecutive gems below
      for (let r = row + 1; r < board.rows; r++) {
        const nextGem = board.gems[r][col];
        if (nextGem && nextGem.type === gem.type) {
          matchGems.push(nextGem);
        } else {
          break;
        }
      }
      
      if (matchGems.length >= 3) {
        matchGems.forEach(g => visited.add(g.id));
        matches.push({
          gems: matchGems,
          type: 'vertical',
          length: matchGems.length,
        });
      }
    }
  }
  
  return matches;
};

// Check if two positions are adjacent
export const areAdjacent = (pos1: Position, pos2: Position): boolean => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

// Swap two gems on the board
export const swapGems = (board: GameBoard, pos1: Position, pos2: Position): GameBoard => {
  const newBoard = {
    ...board,
    gems: board.gems.map(row => row.map(gem => ({ ...gem })))
  };
  
  const gem1 = newBoard.gems[pos1.row][pos1.col];
  const gem2 = newBoard.gems[pos2.row][pos2.col];
  
  // Update positions
  gem1.position = { ...pos2 };
  gem2.position = { ...pos1 };
  
  // Swap gems in the array
  newBoard.gems[pos1.row][pos1.col] = gem2;
  newBoard.gems[pos2.row][pos2.col] = gem1;
  
  return newBoard;
};

// Remove matched gems and drop remaining gems
export const removeMatches = (board: GameBoard, matches: Match[]): GameBoard => {
  const newBoard = {
    ...board,
    gems: board.gems.map(row => row.map(gem => ({ ...gem })))
  };
  
  // Mark gems for removal
  const gemsToRemove = new Set<string>();
  matches.forEach(match => {
    match.gems.forEach(gem => gemsToRemove.add(gem.id));
  });
  
  // Remove matched gems
  for (let row = 0; row < newBoard.rows; row++) {
    for (let col = 0; col < newBoard.cols; col++) {
      if (gemsToRemove.has(newBoard.gems[row][col].id)) {
        newBoard.gems[row][col] = null as any;
      }
    }
  }
  
  // Drop gems down
  for (let col = 0; col < newBoard.cols; col++) {
    const column: (Gem | null)[] = [];
    
    // Collect non-null gems in this column
    for (let row = 0; row < newBoard.rows; row++) {
      if (newBoard.gems[row][col]) {
        column.push(newBoard.gems[row][col]);
      }
    }
    
    // Fill from bottom up
    let gemIndex = column.length - 1;
    for (let row = newBoard.rows - 1; row >= 0; row--) {
      if (gemIndex >= 0) {
        const gem = column[gemIndex];
        gem.position = { row, col };
        newBoard.gems[row][col] = gem;
        gemIndex--;
      } else {
        // Create new gem for empty spaces
        newBoard.gems[row][col] = createGem(getRandomGemType(), { row, col });
      }
    }
  }
  
  return newBoard;
};

// Calculate score for matches
export const calculateMatchScore = (matches: Match[]): number => {
  let totalScore = 0;
  
  matches.forEach(match => {
    let baseScore = match.length * 10;
    
    // Bonus for longer matches
    if (match.length >= 4) baseScore *= 2;
    if (match.length >= 5) baseScore *= 3;
    
    // Bonus for special patterns
    if (match.length >= 4) {
      baseScore += 50; // L-shape or T-shape bonus
    }
    
    totalScore += baseScore;
  });
  
  return totalScore;
};

// Check if a swap would create a match
export const wouldSwapCreateMatch = (board: GameBoard, pos1: Position, pos2: Position): boolean => {
  const testBoard = swapGems(board, pos1, pos2);
  const matches = findMatches(testBoard);
  return matches.length > 0;
};

// Find all possible moves on the board
export const findPossibleMoves = (board: GameBoard): Position[][] => {
  const possibleMoves: Position[][] = [];
  
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      const currentPos = { row, col };
      
      // Check all adjacent positions
      const adjacentPositions = [
        { row: row - 1, col }, // up
        { row: row + 1, col }, // down
        { row, col: col - 1 }, // left
        { row, col: col + 1 }, // right
      ].filter(pos => 
        pos.row >= 0 && pos.row < board.rows && 
        pos.col >= 0 && pos.col < board.cols
      );
      
      adjacentPositions.forEach(adjacentPos => {
        if (wouldSwapCreateMatch(board, currentPos, adjacentPos)) {
          possibleMoves.push([currentPos, adjacentPos]);
        }
      });
    }
  }
  
  return possibleMoves;
};

// Process a complete turn (swap, find matches, remove, refill)
export const processTurn = (board: GameBoard, pos1: Position, pos2: Position): SwapResult => {
  if (!areAdjacent(pos1, pos2)) {
    return {
      success: false,
      matches: [],
      newBoard: board,
      scoreGained: 0,
      cascades: 0,
    };
  }
  
  let currentBoard = swapGems(board, pos1, pos2);
  let allMatches: Match[] = [];
  let totalScore = 0;
  let cascades = 0;
  
  // Process cascading matches
  while (true) {
    const matches = findMatches(currentBoard);
    if (matches.length === 0) break;
    
    allMatches.push(...matches);
    totalScore += calculateMatchScore(matches);
    currentBoard = removeMatches(currentBoard, matches);
    cascades++;
  }
  
  return {
    success: allMatches.length > 0,
    matches: allMatches,
    newBoard: currentBoard,
    scoreGained: totalScore,
    cascades,
  };
};
