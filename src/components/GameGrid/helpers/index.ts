import { RankingInfo, ClickAreaData } from '../../../utils/Interfaces';

export function getInitialCPUtargets(rectA: ClickAreaData[], columns: number) {
  const output: ClickAreaData[] = [];
  for (let col = 0; col < columns; col++) {
    let currentSelectedRectArea = { ...rectA[col] };
    if (!currentSelectedRectArea.fullColumn) {
      let counter = col;
      while (currentSelectedRectArea && rectA[counter + columns]) {
        if (!rectA[counter + columns].occupiedBy) {
          currentSelectedRectArea = rectA[counter + columns];
        }
        counter += columns;
      }
      output.push(currentSelectedRectArea);
    }
  }
  return output;
}

export function assignChipToLowestSlotPossibleIndex(index: number, rectA: ClickAreaData[], cols: number, rows: number) {
  let indexCounter = index;
  if (rectA[indexCounter]?.occupiedBy) {
    while (indexCounter >= 0 && rectA[indexCounter]?.occupiedBy) {
      indexCounter -= cols;
    }
  } else {
    while (indexCounter + cols < cols * rows && !rectA[indexCounter + cols]?.occupiedBy) {
      indexCounter += cols;
    }
  }
  return indexCounter;
}

export function isTieGame(rectA: ClickAreaData[], cols: number, rows: number) {
  const fullColumns = rectA.filter((rectArea) => {
    return rectArea.fullColumn;
  });
  return fullColumns.length === cols * rows;
}

export function verticalMatches(focusedRectArea: ClickAreaData, gameRectAreas: ClickAreaData[], cols: number) {
  const selectedRectAreas: ClickAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy === currentSelectedRectArea.occupiedBy) {
      selectedRectAreas.push(currentSelectedRectArea);
      currentSelectedRectArea = gameRectAreas[currentSelectedRectArea.index + cols];
    }
  }
  return selectedRectAreas;
}

export function horizonalMatches(focusedRectArea: ClickAreaData, gameRectAreas: ClickAreaData[]) {
  const selectedRectAreas: ClickAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy === currentSelectedRectArea.occupiedBy && focusedRectArea.y === currentSelectedRectArea.y) {
      selectedRectAreas.push(currentSelectedRectArea);
      currentSelectedRectArea = gameRectAreas[currentSelectedRectArea.index - 1];
    }

    currentSelectedRectArea = gameRectAreas[focusedRectArea.index + 1];
    while (currentSelectedRectArea && focusedRectArea.occupiedBy === currentSelectedRectArea.occupiedBy && focusedRectArea.y === currentSelectedRectArea.y) {
      selectedRectAreas.push(currentSelectedRectArea);
      currentSelectedRectArea = gameRectAreas[currentSelectedRectArea.index + 1];
    }
  }
  return selectedRectAreas;
}

function checkDiagonalBoundariesAndGetRect(rect1: ClickAreaData, rect2: ClickAreaData) {
  if (rect1 && rect2 && rect1.y === rect2.y) {
    return rect2;
  } else {
    return { ...rect2, occupiedBy: undefined };
  }
}

export function diagonalLeftMatches(focusedRectArea: ClickAreaData, gameRectAreas: ClickAreaData[], cols: number) {
  const selectedRectAreas: ClickAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy === currentSelectedRectArea.occupiedBy) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.index - cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.index - cols - 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }

    const rectArea1 = gameRectAreas[focusedRectArea.index + cols];
    const rectArea2 = gameRectAreas[focusedRectArea.index + cols + 1];
    currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    while (currentSelectedRectArea && focusedRectArea.occupiedBy === currentSelectedRectArea.occupiedBy) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.index + cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.index + cols + 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }
  }
  return selectedRectAreas;
}

export function diagonalRightMatches(focusedRectArea: ClickAreaData, gameRectAreas: ClickAreaData[], cols: number) {
  const selectedRectAreas: ClickAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy === currentSelectedRectArea.occupiedBy) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.index + cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.index + cols - 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }

    const rectArea1 = gameRectAreas[focusedRectArea.index - cols];
    const rectArea2 = gameRectAreas[focusedRectArea.index - cols + 1];
    currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    while (currentSelectedRectArea && focusedRectArea.occupiedBy === currentSelectedRectArea.occupiedBy) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.index - cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.index - cols + 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }
  }
  return selectedRectAreas;
}

export function processForWinnersOrSwap(currentRectArea: ClickAreaData, gameRectAreas: ClickAreaData[], cols: number, winningLength: number) {
  let matches: ClickAreaData[] = [];
  if (verticalMatches(currentRectArea, gameRectAreas, cols).length >= winningLength) {
    matches = verticalMatches(currentRectArea, gameRectAreas, cols);
  } else if (horizonalMatches(currentRectArea, gameRectAreas).length >= winningLength) {
    matches = horizonalMatches(currentRectArea, gameRectAreas);
  } else if (diagonalLeftMatches(currentRectArea, gameRectAreas, cols).length >= winningLength) {
    matches = diagonalLeftMatches(currentRectArea, gameRectAreas, cols);
  } else if (diagonalRightMatches(currentRectArea, gameRectAreas, cols).length >= winningLength) {
    matches = diagonalRightMatches(currentRectArea, gameRectAreas, cols);
  }

  if (matches.length >= winningLength) {
    const updatedRects = gameRectAreas.map((rectArea, i) => {
      const winnerRect: ClickAreaData | undefined = matches.find((winningRect) => winningRect.index === i);
      if (winnerRect) {
        winnerRect.winningArea = true;
        return winnerRect;
      }
      return rectArea;
    });
    return updatedRects;
  }

  return matches;
}

export function processCPUchoiceRankings(currentRectArea: ClickAreaData, gameRectAreas: ClickAreaData[], cols: number, winningLength: number) {
  const currentCpuRectArea: ClickAreaData = { ...currentRectArea };
  const currentPlayerRectArea: ClickAreaData = { ...currentRectArea };
  currentPlayerRectArea.occupiedBy = 'main';
  currentCpuRectArea.occupiedBy = 'opponent';
  let defaultRanking = 0;
  const verticalCpuMatchesLength = verticalMatches(currentCpuRectArea, gameRectAreas, cols).length;
  const verticalPlayerMatchesLength = verticalMatches(currentPlayerRectArea, gameRectAreas, cols).length;
  const horizonalCpuMatchesLength = horizonalMatches(currentCpuRectArea, gameRectAreas).length;
  const horizonalPlayerMatchesLength = horizonalMatches(currentPlayerRectArea, gameRectAreas).length;
  const diagonalCpuLeftMatchesLength = diagonalLeftMatches(currentCpuRectArea, gameRectAreas, cols).length;
  const diagonalPlayerLeftMatchesLength = diagonalLeftMatches(currentPlayerRectArea, gameRectAreas, cols).length;
  const diagonalCpuRightMatchesLength = diagonalRightMatches(currentCpuRectArea, gameRectAreas, cols).length;
  const diagonalPlayerRightMatchesLength = diagonalRightMatches(currentPlayerRectArea, gameRectAreas, cols).length;
  // const matchesCPULength = verticalCpuMatchesLength || horizonalCpuMatchesLength || diagonalCpuLeftMatchesLength || diagonalCpuRightMatchesLength;
  // const matchesPlayerLength = verticalPlayerMatchesLength || horizonalPlayerMatchesLength || diagonalPlayerLeftMatchesLength || diagonalPlayerRightMatchesLength;
  // console.log(Math.max(verticalPlayerMatchesLength, horizonalPlayerMatchesLength, diagonalPlayerLeftMatchesLength, diagonalPlayerRightMatchesLength));

  const matchesCPULength = Math.max(verticalCpuMatchesLength, horizonalCpuMatchesLength, diagonalCpuLeftMatchesLength, diagonalCpuRightMatchesLength);
  const matchesPlayerLength = Math.max(verticalPlayerMatchesLength, horizonalPlayerMatchesLength, diagonalPlayerLeftMatchesLength, diagonalPlayerRightMatchesLength);

  if (matchesCPULength >= winningLength) {
    defaultRanking = 5;
  } else if (matchesPlayerLength >= winningLength) {
    defaultRanking = 4;
  } else if ((matchesCPULength || matchesPlayerLength) >= 3 && checkIsAdjacentColEmpty(currentCpuRectArea, gameRectAreas)) {
    defaultRanking = 3;
  } else if (matchesCPULength >= 2) {
    defaultRanking = 1;
  }
  return defaultRanking;
}

function checkIsAdjacentColEmpty(currentRectArea: ClickAreaData, gameRectAreas: ClickAreaData[]) {
  const leftRectArea = gameRectAreas[currentRectArea.index - 1];
  const rightRectArea = gameRectAreas[currentRectArea.index + 1];
  if ((leftRectArea && currentRectArea.y === leftRectArea.y && !leftRectArea.occupiedBy) || (rightRectArea && currentRectArea.y === rightRectArea.y && !rightRectArea.occupiedBy)) {
    return true;
  }
  return false;
}

export function getHighestRankings(rankings: RankingInfo[]) {
  let maxRatingValue = 0;
  return rankings.reduce<RankingInfo[]>((accumulator, currentValue) => {
    if (maxRatingValue < currentValue.ranking) {
      accumulator = [currentValue];
      maxRatingValue = currentValue.ranking;
    } else if (maxRatingValue === currentValue.ranking) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
}

export function getRankedIndexforCPU(rankings: RankingInfo[]) {
  return rankings[Math.floor(Math.random() * rankings.length)].index;
}
