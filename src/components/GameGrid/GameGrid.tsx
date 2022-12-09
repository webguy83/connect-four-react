import { Box, Slide } from '@mui/material';
import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { mainColour } from '../../CustomTheme';
import { mainTransition } from '../../utils/Styles';
import { Player } from '../../utils/Types';
import MarkerIcon from '../Icons/MarkerIcon';
import PlayerChip from '../GameObjects/PlayerChip/PlayerChip';
import ConnectFourGridWhite from '../GameObjects/BoardGrid/ConnectFourGridWhite';

interface RectAreaData {
  x: number;
  y: number;
  occupiedBy?: Player;
  fullColumn?: boolean;
}

interface ConnectFourGridProps {
  playerAccess: {
    setCurrentPlayer: Dispatch<SetStateAction<Player>>;
    currentPlayer: Player;
  };
}

export default function GameGrid({ playerAccess }: ConnectFourGridProps) {
  const containerRef = useRef(null);
  const disableUI = useRef<boolean>(false);
  const [playerChips, showPlayerChips] = useState<JSX.Element[]>([]);
  const [rectAreaData, setRectAreaData] = useState<RectAreaData[]>([]);
  const [markerPos, setMarkerPos] = useState<number>(-100000000);

  const COLUMNS = 7;
  const ROWS = 6;

  useEffect(() => {
    const output = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const x = 88 * col + 8;
        const y = 88 * row + 8;
        output.push({ x, y });
      }
    }

    setRectAreaData(output);
  }, []);

  function onMouseOverPiece(e: React.MouseEvent<SVGRectElement, MouseEvent>, index: number) {
    const elm = e.target as SVGRectElement;
    const rectData = rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(rectData.x + elm.width.baseVal.value / 2 - 19);
    }
  }

  function onMouseLeavePiece(index: number) {
    const rectData = rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(-100000000);
    }
  }

  const onRectClick = (index: number) => {
    if (rectAreaData[index].fullColumn || disableUI.current) {
      return;
    }
    disableUI.current = true;
    const adjustedIndex = assignChipToLowestSlotPossibleIndex(index);
    const rect = rectAreaData[adjustedIndex];
    addExtraDataToRect(rect, adjustedIndex);
  };

  function addExtraDataToRect(rect: RectAreaData, index: number) {
    if (rect) {
      occupyPlayer(rect, index);
      if (index < COLUMNS) {
        addFullColumn(index - COLUMNS);
      }
    } else {
      addFullColumn(index);
    }
  }

  function assignChipToLowestSlotPossibleIndex(index: number) {
    let indexCounter = index;
    if (rectAreaData[indexCounter]?.occupiedBy) {
      while (indexCounter >= 0 && rectAreaData[indexCounter]?.occupiedBy) {
        indexCounter -= COLUMNS;
      }
    } else {
      while (indexCounter + COLUMNS < COLUMNS * ROWS && !rectAreaData[indexCounter + COLUMNS]?.occupiedBy) {
        indexCounter += COLUMNS;
      }
    }
    return indexCounter;
  }

  function swapToNextPlayer() {
    if (playerAccess.currentPlayer === 'main') {
      playerAccess.setCurrentPlayer('opponent');
    } else {
      playerAccess.setCurrentPlayer('main');
    }
    disableUI.current = false;
  }

  function chipFinishedAnimating() {
    swapToNextPlayer();
  }

  function occupyPlayer(rect: RectAreaData, indexCounter: number) {
    const x = rect.x + 44;
    const y = rect.y + 44;
    showPlayerChips((oldValues) => {
      return [
        ...oldValues,
        <Slide key={new Date().getTime()} onEntered={chipFinishedAnimating} in={true} timeout={500} container={containerRef.current}>
          <PlayerChip colour={mainColour[playerAccess.currentPlayer]} x={x} y={y} />
        </Slide>,
      ];
    });
    setRectAreaData((oldData) => {
      const newRectAreaData = [...oldData];
      newRectAreaData[indexCounter].occupiedBy = 'main';
      return newRectAreaData;
    });
  }

  function addFullColumn(indexCounter: number) {
    setMarkerPos(-100000000);
    setRectAreaData((oldData) => {
      const newRectAreaData = [...oldData];
      while (indexCounter + COLUMNS < COLUMNS * ROWS) {
        newRectAreaData[indexCounter + COLUMNS].fullColumn = true;
        indexCounter += COLUMNS;
      }
      return newRectAreaData;
    });
  }

  return (
    <>
      <Box
        sx={(theme) => ({
          display: 'none',
          [theme.breakpoints.up('mdlg')]: {
            display: disableUI.current ? 'none' : 'block',
          },
          position: 'absolute',
          top: -37,
          left: markerPos,
          transition: `all ${mainTransition}`,
        })}
      >
        <MarkerIcon colour={mainColour[playerAccess.currentPlayer]} />
      </Box>

      <svg ref={containerRef} className='white-grid' width='100%' height='100%' viewBox='0 0 632 584' xmlns='http://www.w3.org/2000/svg'>
        {playerChips}
        <ConnectFourGridWhite />
        {rectAreaData.map((data, i) => {
          return (
            <rect
              key={i}
              style={{ cursor: data.fullColumn || disableUI.current ? 'default' : 'pointer' }}
              onClick={() => onRectClick(i)}
              onMouseOver={(e) => onMouseOverPiece(e, i)}
              onMouseLeave={() => onMouseLeavePiece(i)}
              width='88'
              height='88'
              x={data.x}
              y={data.y}
              opacity='0'
            />
          );
        })}
      </svg>
    </>
  );
}
