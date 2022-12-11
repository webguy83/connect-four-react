import { Box, Fade, Slide } from '@mui/material';
import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { mainColour } from '../../CustomTheme';
import { Player } from '../../utils/Types';
import MarkerIcon from '../Icons/MarkerIcon';
import PlayerChip from '../GameObjects/PlayerChip/PlayerChip';
import ConnectFourGridWhite from '../GameObjects/BoardGrid/ConnectFourGridWhite';
import { mainGridStyles } from './GameGrid.styles';
import { RectAreaData } from '../../utils/Interfaces';

interface ConnectFourGridProps {
  currentPlayer: Player;
  playerChips: JSX.Element[];
  rectAreaData: RectAreaData[];
  setCurrentPlayer: Dispatch<SetStateAction<Player>>;
  setPlayerChips: Dispatch<SetStateAction<JSX.Element[]>>;
  setRectAreaData: Dispatch<SetStateAction<RectAreaData[]>>;
  winner: Player | null;
  setWinner: Dispatch<SetStateAction<Player | null>>;
  clearTimer: () => void;
  pauseResumeTimer: () => void;
  timerSeconds: number;
  setDisableUI: Dispatch<SetStateAction<boolean>>;
  disableUI: boolean;
  setOpponentScore: Dispatch<SetStateAction<number>>;
  setMainPlayerScore: Dispatch<SetStateAction<number>>;
  setTieGame: Dispatch<SetStateAction<boolean>>;
}

interface Coords {
  x: number;
  y: number;
}

export default function GameGrid(props: ConnectFourGridProps) {
  const { setRectAreaData } = props;
  const containerRef = useRef(null);
  const selectedRectAreaRef = useRef<RectAreaData | null>(null);
  const [markerPos, setMarkerPos] = useState<number>(-100000000);
  const COLUMNS = 7;
  const ROWS = 6;
  const noDataPresent = !props.rectAreaData.length;

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
    const rectData = props.rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(rectData.x + elm.width.baseVal.value / 2 - 19);
    }
  }

  function onMouseLeavePiece(index: number) {
    const rectData = props.rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(-100000000);
    }
  }

  const onRectClick = (index: number) => {
    if (props.rectAreaData[index].fullColumn || props.disableUI || props.winner) {
      return;
    }
    props.pauseResumeTimer();
    props.setDisableUI(true);
    if (props.timerSeconds >= 0) {
      const adjustedIndex = assignChipToLowestSlotPossibleIndex(index);
      const rect = props.rectAreaData[adjustedIndex];
      addExtraDataToRect(rect, adjustedIndex);
    }
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
    if (props.rectAreaData[indexCounter]?.occupiedBy) {
      while (indexCounter >= 0 && props.rectAreaData[indexCounter]?.occupiedBy) {
        indexCounter -= COLUMNS;
      }
    } else {
      while (indexCounter + COLUMNS < COLUMNS * ROWS && !props.rectAreaData[indexCounter + COLUMNS]?.occupiedBy) {
        indexCounter += COLUMNS;
      }
    }
    return indexCounter;
  }

  function swapToNextPlayer() {
    if (props.currentPlayer === 'main') {
      props.setCurrentPlayer('opponent');
    } else {
      props.setCurrentPlayer('main');
    }
    props.setDisableUI(false);
    props.clearTimer();
  }

  function isTieGame() {
    const fullColumns = props.rectAreaData.filter((rectArea) => {
      return rectArea.fullColumn;
    });
    if (fullColumns.length === COLUMNS * ROWS) {
      props.setTieGame(true);
    }
    return fullColumns.length === COLUMNS * ROWS;
  }

  function checkForWin() {
    if (!isTieGame()) {
      const currentRectArea = selectedRectAreaRef.current;
      if (currentRectArea) {
        checkVertical(currentRectArea);
      }
    }
  }

  function checkVertical(currentRectArea: RectAreaData) {
    if (currentRectArea.occupiedBy) {
      let currentSelectedRectArea = { ...currentRectArea };
      const winningRectAreas: RectAreaData[] = [];
      while (currentSelectedRectArea && currentRectArea.occupiedBy.player === currentSelectedRectArea.occupiedBy?.player) {
        winningRectAreas.push(currentSelectedRectArea);
        currentSelectedRectArea = props.rectAreaData[currentSelectedRectArea.occupiedBy.index + COLUMNS];
      }
      processForWinnersOrSwap(winningRectAreas);
    }
  }

  function processForWinnersOrSwap(winningRectAreas: RectAreaData[]) {
    if (winningRectAreas.length >= 4) {
      const updatedRects = props.rectAreaData.map((rectArea, i) => {
        const winnerRect = winningRectAreas.find((winningRect) => winningRect.occupiedBy?.index === i);
        if (winnerRect) {
          winnerRect.winningArea = true;
          return winnerRect;
        }
        return rectArea;
      });
      props.setRectAreaData(updatedRects);
      props.setWinner(props.currentPlayer);
      if (props.currentPlayer === 'main') {
        props.setMainPlayerScore((prevScore) => prevScore + 1);
      } else {
        props.setOpponentScore((prevScore) => prevScore + 1);
      }
    } else {
      swapToNextPlayer();
    }
  }

  function occupyPlayer(rect: RectAreaData, indexCounter: number) {
    const x = rect.x + 44;
    const y = rect.y + 44;
    props.setPlayerChips((oldValues) => {
      return [
        ...oldValues,
        <Slide key={new Date().getTime()} onEntered={checkForWin} in={props.timerSeconds > 0} timeout={500} container={containerRef.current}>
          <PlayerChip colour={mainColour[props.currentPlayer]} x={x} y={y} />
        </Slide>,
      ];
    });
    setRectAreaData((oldData) => {
      const newRectAreaData = [...oldData];
      newRectAreaData[indexCounter].occupiedBy = { player: props.currentPlayer, index: indexCounter };
      return newRectAreaData;
    });
    selectedRectAreaRef.current = rect;
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
              display: props.disableUI || props.winner ? 'none' : 'block',
            },
            left: markerPos,
          }),
        ]}
      >
        <MarkerIcon colour={mainColour[props.currentPlayer]} />
      </Box>

      <svg ref={containerRef} className='white-grid' width='100%' height='100%' viewBox='0 0 632 584' xmlns='http://www.w3.org/2000/svg'>
        {props.playerChips}
        <ConnectFourGridWhite />
        {props.rectAreaData.map((data, i) => {
          return (
            <g key={i}>
              {data.winningArea && (
                <Fade in={true}>
                  <Box component='circle' cx={data.x + 44} cy={data.y + 46} r='14' stroke='white' strokeWidth='6' fill={mainColour[props.currentPlayer]}></Box>
                </Fade>
              )}
              <rect
                style={{ cursor: data.fullColumn || props.disableUI || props.winner ? 'default' : 'pointer' }}
                onClick={() => onRectClick(i)}
                onMouseOver={(e) => onMouseOverPiece(e, i)}
                onMouseLeave={() => onMouseLeavePiece(i)}
                width='88'
                height='88'
                x={data.x}
                y={data.y}
                opacity='0'
              />
            </g>
          );
        })}
      </svg>
    </>
  );
}
