import { Box, Fade, Slide } from '@mui/material';
import { useRef, useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import { mainColour } from '../../CustomTheme';
import { OpponentName, Player } from '../../utils/Types';
import MarkerIcon from '../Icons/MarkerIcon';
import PlayerChip from '../GameObjects/PlayerChip/PlayerChip';
import ConnectFourGridWhite from '../GameObjects/BoardGrid/ConnectFourGridWhite';
import { mainGridStyles } from './GameGrid.styles';
import { RankingInfo, RectAreaData } from '../../utils/Interfaces';
import { assignChipToLowestSlotPossibleIndex, getHighestRankings, getInitialCPUtargets, getRankedIndexforCPU, isTieGame, processCPUchoiceRankings, processForWinnersOrSwap } from './helpers';
import { COLUMNS, ROWS, WINNING_LENGTH } from '../../utils/constants';

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
  opponentName: OpponentName;
}

export default function GameGrid(props: ConnectFourGridProps) {
  const { setRectAreaData, rectAreaData, currentPlayer, opponentName, setCurrentPlayer } = props;
  const containerRef = useRef(null);
  const selectedRectAreaRef = useRef<RectAreaData | null>(null);
  //const [cpuInProgress, setCpuInProgress] = useState<boolean>(false);
  const cpuInProgressRef = useRef<boolean>(false);
  const [markerPos, setMarkerPos] = useState<number>(-100000000);
  const [defaultCursor, setDefaultCursor] = useState(false);

  const swapToNextPlayer = useCallback(() => {
    if (currentPlayer === 'main') {
      setCurrentPlayer('opponent');
    } else {
      cpuInProgressRef.current = false;
      setDefaultCursor(false);
      setCurrentPlayer('main');
    }
    props.setDisableUI(false);
    props.clearTimer();
  }, [currentPlayer, props, setCurrentPlayer]);

  const checkGameStatus = useCallback(() => {
    const isTied = isTieGame(rectAreaData, COLUMNS, ROWS);
    if (isTied) {
      props.setTieGame(true);
      return;
    }

    const currentRectArea = selectedRectAreaRef.current;
    if (currentRectArea) {
      const matches = processForWinnersOrSwap(currentRectArea, rectAreaData, COLUMNS, WINNING_LENGTH);
      if (matches.length >= WINNING_LENGTH) {
        props.setWinner(currentPlayer);
        props.setRectAreaData(matches);
        if (currentPlayer === 'main') {
          props.setMainPlayerScore((prevScore) => prevScore + 1);
        } else {
          props.setOpponentScore((prevScore) => prevScore + 1);
        }
      } else {
        swapToNextPlayer();
      }
    }
  }, [currentPlayer, props, rectAreaData, swapToNextPlayer]);

  const renderChipsAndAssignRectData = useCallback(
    (rect: RectAreaData, indexCounter: number) => {
      const x = rect.x + 44;
      const y = rect.y + 44;
      props.setPlayerChips((oldValues) => {
        return [
          ...oldValues,
          <Slide key={new Date().getTime()} onEntered={checkGameStatus} in={props.timerSeconds > 0} timeout={500} container={containerRef.current}>
            <PlayerChip colour={mainColour[currentPlayer]} x={x} y={y} />
          </Slide>,
        ];
      });
      setRectAreaData((oldData) => {
        const newRectAreaData = [...oldData];
        newRectAreaData[indexCounter].occupiedBy = currentPlayer;
        return newRectAreaData;
      });
      selectedRectAreaRef.current = rect;
    },
    [checkGameStatus, currentPlayer, props, setRectAreaData]
  );

  // function startCPUlogic(rectAreaData: RectAreaData[]) {
  //   const rectAreas = getInitialCPUtargets(rectAreaData, COLUMNS);
  //   const rankings: RankingInfo[] = rectAreas.map((rectArea) => {
  //     const ranking = processCPUchoiceRankings(rectArea, rectAreaData, COLUMNS, WINNING_LENGTH);
  //     return {
  //       index: rectArea.index,
  //       ranking,
  //     };
  //   });
  //   const highestRankings = getHighestRankings(rankings);
  //   const rankedIndex = getRankedIndexforCPU(highestRankings);
  //   const bestRanked = rectAreaData[rankedIndex];
  //   const bestRect = { ...rectAreaData[bestRanked.index] };
  //   bestRect.occupiedBy = 'opponent';
  //   addExtraDataToRect(bestRect, bestRanked.index);
  // }

  function onMouseOverPiece(index: number) {
    if (!props.winner && !cpuInProgressRef.current) {
      const rectData = rectAreaData[index];
      if (!rectData.fullColumn) {
        setMarkerPos(rectData.x + 24.86);
      }
    }
  }

  function onMouseLeavePiece(index: number) {
    const rectData = rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(-100000000);
    }
  }

  const onRectClick = (index: number) => {
    if (rectAreaData[index].fullColumn || props.disableUI || props.winner || cpuInProgressRef.current) {
      return;
    }
    props.pauseResumeTimer();
    props.setDisableUI(true);
    if (props.timerSeconds >= 0) {
      const adjustedIndex = assignChipToLowestSlotPossibleIndex(index, rectAreaData, COLUMNS, ROWS);
      const rect = rectAreaData[adjustedIndex];
      addExtraDataToRect(rect, adjustedIndex);
    }
  };

  const applyFullColumnToRects = useCallback(
    (indexCounter: number) => {
      setMarkerPos(-100000000);
      setRectAreaData((oldData) => {
        const newRectAreaData = [...oldData];
        while (indexCounter + COLUMNS < COLUMNS * ROWS) {
          newRectAreaData[indexCounter + COLUMNS].fullColumn = true;
          indexCounter += COLUMNS;
        }
        return newRectAreaData;
      });
    },
    [setRectAreaData]
  );

  const addExtraDataToRect = useCallback(
    (rect: RectAreaData, index: number) => {
      renderChipsAndAssignRectData(rect, index);
      if (index < COLUMNS) {
        applyFullColumnToRects(index - COLUMNS);
      }
    },
    [applyFullColumnToRects, renderChipsAndAssignRectData]
  );

  useEffect(() => {
    if (opponentName === 'CPU' && currentPlayer === 'opponent') {
      setMarkerPos(-100000000);
      cpuInProgressRef.current = true;
      setDefaultCursor(true);
      //setCpuInProgress(true);

      const rectAreas = getInitialCPUtargets(rectAreaData, COLUMNS);
      const rankings: RankingInfo[] = rectAreas.map((rectArea) => {
        const ranking = processCPUchoiceRankings(rectArea, rectAreaData, COLUMNS, WINNING_LENGTH);
        return {
          index: rectArea.index,
          ranking,
        };
      });
      const highestRankings = getHighestRankings(rankings);
      const rankedIndex = getRankedIndexforCPU(highestRankings);
      const bestRanked = rectAreaData[rankedIndex];
      const bestRect = { ...rectAreaData[bestRanked.index] };
      bestRect.occupiedBy = 'opponent';

      addExtraDataToRect(bestRect, bestRanked.index);
      setCurrentPlayer('main');
      setDefaultCursor(false);
      //startCPUlogic(rectAreaData);
    }
  }, [addExtraDataToRect, currentPlayer, opponentName, rectAreaData, setCurrentPlayer]);

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
        <MarkerIcon colour={mainColour[currentPlayer]} />
      </Box>

      <svg ref={containerRef} className='white-grid' width='100%' height='100%' viewBox='0 0 632 584' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <rect id='rect' width='100%' height='100%' fill='none' rx='40' ry='40' stroke='black' />
          <clipPath id='clip'>
            <use xlinkHref='#rect' />
          </clipPath>
        </defs>
        <use xlinkHref='#rect' />
        <g clipPath='url(#clip)'>
          {props.playerChips}

          <ConnectFourGridWhite />

          {rectAreaData.map((data, i) => {
            return (
              <g key={i}>
                {data.winningArea && (
                  <Fade in={true}>
                    <Box component='circle' cx={data.x + 44} cy={data.y + 46} r='14' stroke='white' strokeWidth='6' fill='transparent'></Box>
                  </Fade>
                )}
                <Box
                  component='rect'
                  sx={{
                    '@media (hover: hover) and (pointer: fine)': {
                      cursor: data.fullColumn || props.disableUI || props.winner || defaultCursor ? 'default' : 'pointer',
                    },
                  }}
                  onClick={() => onRectClick(i)}
                  onMouseOver={() => onMouseOverPiece(i)}
                  onMouseLeave={() => onMouseLeavePiece(i)}
                  width='88px'
                  height='88px'
                  x={data.x}
                  y={data.y}
                  opacity='0'
                />
              </g>
            );
          })}
        </g>
      </svg>
    </>
  );
}
