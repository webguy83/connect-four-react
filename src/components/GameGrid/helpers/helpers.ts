import { RectAreaData } from '../../../utils/Interfaces';

export function getInitialCPUtargets(rectA: RectAreaData[], columns: number) {
  const output: RectAreaData[] = [];
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

export function assignChipToLowestSlotPossibleIndex(index: number, rectA: RectAreaData[], cols: number, rows: number) {
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

export function isTieGame(rectA: RectAreaData[], cols: number, rows: number) {
  const fullColumns = rectA.filter((rectArea) => {
    return rectArea.fullColumn;
  });
  return fullColumns.length === cols * rows;
}

export function verticalMatches(focusedRectArea: RectAreaData, gameRectAreas: RectAreaData[], cols: number) {
  const selectedRectAreas: RectAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player) {
      selectedRectAreas.push(currentSelectedRectArea);
      currentSelectedRectArea = gameRectAreas[currentSelectedRectArea.occupiedBy.index + cols];
    }
  }
  return selectedRectAreas;
}

export function horizonalMatches(focusedRectArea: RectAreaData, gameRectAreas: RectAreaData[]) {
  const selectedRectAreas: RectAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player && focusedRectArea.y === currentSelectedRectArea.y) {
      selectedRectAreas.push(currentSelectedRectArea);
      currentSelectedRectArea = gameRectAreas[currentSelectedRectArea.occupiedBy.index - 1];
    }

    currentSelectedRectArea = gameRectAreas[focusedRectArea.occupiedBy.index + 1];
    while (currentSelectedRectArea && focusedRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player && focusedRectArea.y === currentSelectedRectArea.y) {
      selectedRectAreas.push(currentSelectedRectArea);
      currentSelectedRectArea = gameRectAreas[currentSelectedRectArea.occupiedBy.index + 1];
    }
  }
  return selectedRectAreas;
}

function checkDiagonalBoundariesAndGetRect(rect1: RectAreaData, rect2: RectAreaData) {
  if (rect1 && rect2 && rect1.y === rect2.y) {
    return rect2;
  } else {
    return { ...rect2, occupiedBy: undefined };
  }
}

export function diagonalLeftMatches(focusedRectArea: RectAreaData, gameRectAreas: RectAreaData[], cols: number) {
  const selectedRectAreas: RectAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.occupiedBy.index - cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.occupiedBy.index - cols - 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }

    const rectArea1 = gameRectAreas[focusedRectArea.occupiedBy.index + cols];
    const rectArea2 = gameRectAreas[focusedRectArea.occupiedBy.index + cols + 1];
    currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    while (currentSelectedRectArea && focusedRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.occupiedBy.index + cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.occupiedBy.index + cols + 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }
  }
  return selectedRectAreas;
}

export function diagonalRightMatches(focusedRectArea: RectAreaData, gameRectAreas: RectAreaData[], cols: number) {
  const selectedRectAreas: RectAreaData[] = [];
  if (focusedRectArea.occupiedBy) {
    let currentSelectedRectArea = { ...focusedRectArea };
    while (currentSelectedRectArea && focusedRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.occupiedBy.index + cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.occupiedBy.index + cols - 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }

    const rectArea1 = gameRectAreas[focusedRectArea.occupiedBy.index - cols];
    const rectArea2 = gameRectAreas[focusedRectArea.occupiedBy.index - cols + 1];
    currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    while (currentSelectedRectArea && focusedRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player) {
      selectedRectAreas.push(currentSelectedRectArea);
      const rectArea1 = gameRectAreas[currentSelectedRectArea.occupiedBy.index - cols];
      const rectArea2 = gameRectAreas[currentSelectedRectArea.occupiedBy.index - cols + 1];
      currentSelectedRectArea = checkDiagonalBoundariesAndGetRect(rectArea1, rectArea2);
    }
  }
  return selectedRectAreas;
}

export function processForWinnersOrSwap(currentRectArea: RectAreaData, gameRectAreas: RectAreaData[], cols: number, winningLength: number) {
  let matches: RectAreaData[] = [];
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
      const winnerRect: RectAreaData | undefined = matches.find((winningRect) => winningRect.occupiedBy?.index === i);
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
