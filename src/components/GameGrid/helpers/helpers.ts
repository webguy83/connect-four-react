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
