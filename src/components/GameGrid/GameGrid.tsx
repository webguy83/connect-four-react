import { Box, Slide } from '@mui/material';
import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { mainColour } from '../../CustomTheme';
import { Player } from '../../utils/Types';
import MarkerIcon from '../Icons/MarkerIcon';
import PlayerChip from '../GameObjects/PlayerChip/PlayerChip';
import ConnectFourGridWhite from '../GameObjects/BoardGrid/ConnectFourGridWhite';
import { mainGridStyles } from './GameGrid.styles';
import { RectAreaData } from '../../utils/Interfaces';

interface ConnectFourGridProps {
  playerAccess: {
    currentPlayer: Player;
    playerChips: JSX.Element[];
    rectAreaData: RectAreaData[];
  };
  setCurrentPlayer: Dispatch<SetStateAction<Player>>;
  setPlayerChips: Dispatch<SetStateAction<JSX.Element[]>>;
  setRectAreaData: Dispatch<SetStateAction<RectAreaData[]>>;
  winner: Player | null;
  clearTimer: () => void;
}

interface Coords {
  x: number;
  y: number;
}

export default function GameGrid({ playerAccess, setRectAreaData, setCurrentPlayer, setPlayerChips, winner, clearTimer }: ConnectFourGridProps) {
  const containerRef = useRef(null);
  const disableUI = useRef<boolean>(false);
  const [markerPos, setMarkerPos] = useState<number>(-100000000);
  const COLUMNS = 7;
  const ROWS = 6;
  const noDataPresent = !playerAccess.rectAreaData.length;

  useEffect(() => {
    const output: Coords[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const x = 88 * col + 8;
        const y = 88 * row + 8;
        output.push({ x, y });
      }
    }

    setRectAreaData(output);
  }, [setRectAreaData, noDataPresent]);

  function onMouseOverPiece(e: React.MouseEvent<SVGRectElement, MouseEvent>, index: number) {
    const elm = e.target as SVGRectElement;
    const rectData = playerAccess.rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(rectData.x + elm.width.baseVal.value / 2 - 19);
    }
  }

  function onMouseLeavePiece(index: number) {
    const rectData = playerAccess.rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(-100000000);
    }
  }

  const onRectClick = (index: number) => {
    if (playerAccess.rectAreaData[index].fullColumn || disableUI.current || winner) {
      return;
    }
    disableUI.current = true;
    const adjustedIndex = assignChipToLowestSlotPossibleIndex(index);
    const rect = playerAccess.rectAreaData[adjustedIndex];
    addExtraDataToRect(rect, adjustedIndex);
  };

  function addExtraDataToRect(rect: RectAreaData, index: number) {
    if (rect) {
      occupyPlayer(rect, index);
      if (index < COLUMNS) {
        applyFullColumn(index - COLUMNS);
      }
    } else {
      applyFullColumn(index);
    }
  }

  function assignChipToLowestSlotPossibleIndex(index: number) {
    let indexCounter = index;
    if (playerAccess.rectAreaData[indexCounter]?.occupiedBy) {
      while (indexCounter >= 0 && playerAccess.rectAreaData[indexCounter]?.occupiedBy) {
        indexCounter -= COLUMNS;
      }
    } else {
      while (indexCounter + COLUMNS < COLUMNS * ROWS && !playerAccess.rectAreaData[indexCounter + COLUMNS]?.occupiedBy) {
        indexCounter += COLUMNS;
      }
    }
    return indexCounter;
  }

  function swapToNextPlayer() {
    if (playerAccess.currentPlayer === 'main') {
      setCurrentPlayer('opponent');
    } else {
      setCurrentPlayer('main');
    }
    disableUI.current = false;
    clearTimer();
  }

  function chipFinishedAnimating() {
    swapToNextPlayer();
  }

  function occupyPlayer(rect: RectAreaData, indexCounter: number) {
    const x = rect.x + 44;
    const y = rect.y + 44;
    setPlayerChips((oldValues) => {
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

  function applyFullColumn(indexCounter: number) {
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
        sx={[
          mainGridStyles,
          (theme) => ({
            [theme.breakpoints.up('mdlg')]: {
              display: disableUI.current || winner ? 'none' : 'block',
            },
            left: markerPos,
          }),
        ]}
      >
        <MarkerIcon colour={mainColour[playerAccess.currentPlayer]} />
      </Box>

      <svg ref={containerRef} className='white-grid' width='100%' height='100%' viewBox='0 0 632 584' xmlns='http://www.w3.org/2000/svg'>
        {playerAccess.playerChips}
        <ConnectFourGridWhite />
        {playerAccess.rectAreaData.map((data, i) => {
          return (
            <rect
              key={i}
              style={{ cursor: data.fullColumn || disableUI.current || winner ? 'default' : 'pointer' }}
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
