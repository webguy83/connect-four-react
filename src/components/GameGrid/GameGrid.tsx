import { Box, Fade, Slide } from '@mui/material';
import { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { mainColour } from '../../CustomTheme';
import { OpponentName, Player } from '../../utils/Types';
import MarkerIcon from '../Icons/MarkerIcon';
import PlayerChip from '../GameObjects/PlayerChip/PlayerChip';
import ConnectFourGridWhite from '../GameObjects/BoardGrid/ConnectFourGridWhite';
import { mainGridStyles } from './GameGrid.styles';
import { RankingInfo, ClickAreaData } from '../../utils/Interfaces';
import { assignChipToLowestSlotPossibleIndex, getHighestRankings, getInitialCPUtargets, getRankedIndexforCPU, isTieGame, processCPUchoiceRankings, processForWinnersOrSwap } from './helpers';
import { COLUMNS, ROWS, WINNING_LENGTH } from '../../utils/constants';

interface ConnectFourGridProps {
  currentPlayer: Player;
  playerChips: JSX.Element[];
  allClickAreasData: ClickAreaData[];
  setCurrentPlayer: Dispatch<SetStateAction<Player>>;
  setPlayerChips: Dispatch<SetStateAction<JSX.Element[]>>;
  setAllClickAreasData: Dispatch<SetStateAction<ClickAreaData[]>>;
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
  const { setAllClickAreasData, allClickAreasData, currentPlayer, opponentName, setCurrentPlayer, setPlayerChips } = props;
  const containerRef = useRef(null);
  const [markerPos, setMarkerPos] = useState<number>(-100000000);

  const swapToNextPlayer = (player: Player) => {
    if (player === 'main') {
      setCurrentPlayer('opponent');

      if (opponentName === 'CPU') {
        startCPUlogic(allClickAreasData);
      }
    } else {
      setCurrentPlayer('main');
    }
    props.setDisableUI(false);
    props.clearTimer();
  };

  const checkGameStatus = (selectedClickAreaData: ClickAreaData) => {
    const isTied = isTieGame(allClickAreasData, COLUMNS, ROWS);
    if (isTied) {
      props.setTieGame(true);
      return;
    }

    if (selectedClickAreaData && selectedClickAreaData.occupiedBy) {
      const matches = processForWinnersOrSwap(selectedClickAreaData, allClickAreasData, COLUMNS, WINNING_LENGTH);
      if (matches.length >= WINNING_LENGTH) {
        props.setWinner(selectedClickAreaData.occupiedBy);
        props.setAllClickAreasData(matches);
        if (selectedClickAreaData.occupiedBy === 'main') {
          props.setMainPlayerScore((prevScore) => prevScore + 1);
        } else {
          props.setOpponentScore((prevScore) => prevScore + 1);
        }
      } else {
        swapToNextPlayer(selectedClickAreaData.occupiedBy);
      }
    }
  };

  const renderChipsAndAssignRectData = (clickAreaData: ClickAreaData) => {
    const x = clickAreaData.x + 44;
    const y = clickAreaData.y + 44;
    setPlayerChips((oldValues) => {
      return [
        ...oldValues,
        <Slide key={new Date().getTime()} onEntered={() => checkGameStatus(clickAreaData)} in={props.timerSeconds > 0} timeout={500} container={containerRef.current}>
          <PlayerChip colour={mainColour[currentPlayer]} x={x} y={y} />
        </Slide>,
      ];
    });
    setAllClickAreasData((oldData) => {
      const allClickAreasData = [...oldData];
      allClickAreasData[clickAreaData.index].occupiedBy = currentPlayer;
      return allClickAreasData;
    });
  };

  function startCPUlogic(allClickAreasData: ClickAreaData[]) {
    const rectAreas = getInitialCPUtargets(allClickAreasData, COLUMNS);
    const rankings: RankingInfo[] = rectAreas.map((rectArea) => {
      const ranking = processCPUchoiceRankings(rectArea, allClickAreasData, COLUMNS, WINNING_LENGTH);
      return {
        index: rectArea.index,
        ranking,
      };
    });
    const highestRankings = getHighestRankings(rankings);
    const rankedIndex = getRankedIndexforCPU(highestRankings);
    const bestRanked = allClickAreasData[rankedIndex];
    const bestRect: ClickAreaData = { ...allClickAreasData[bestRanked.index] };
    bestRect.occupiedBy = 'opponent';
    //addExtraDataToRect(bestRect, bestRanked.index);
  }

  function onMouseOverPiece(clickAreaData: ClickAreaData) {
    if (!props.winner) {
      if (!clickAreaData.fullColumn) {
        setMarkerPos(clickAreaData.x + 24.86);
      }
    }
  }

  function onMouseLeavePiece(clickAreaData: ClickAreaData) {
    if (!clickAreaData.fullColumn) {
      setMarkerPos(-100000000);
    }
  }

  const onRectClick = (clickAreaData: ClickAreaData) => {
    props.pauseResumeTimer();
    props.setDisableUI(true);
    if (props.timerSeconds >= 0) {
      const adjustedIndex = assignChipToLowestSlotPossibleIndex(clickAreaData.index, allClickAreasData, COLUMNS, ROWS);
      const adjustedClickAreaData = allClickAreasData[adjustedIndex];

      renderChipsAndAssignRectData(adjustedClickAreaData);

      if (adjustedClickAreaData.index < COLUMNS) {
        applyFullColumnToRects(adjustedClickAreaData.index - COLUMNS);
      }
    }
  };

  const applyFullColumnToRects = (indexCounter: number) => {
    setMarkerPos(-100000000);
    setAllClickAreasData((oldData) => {
      const newRectAreaData = [...oldData];
      while (indexCounter + COLUMNS < COLUMNS * ROWS) {
        newRectAreaData[indexCounter + COLUMNS].fullColumn = true;
        indexCounter += COLUMNS;
      }
      return newRectAreaData;
    });
  };

  useEffect(() => {
    if (opponentName === 'CPU' && currentPlayer === 'opponent') {
      // setMarkerPos(-100000000);
      // setDefaultCursor(true);
      // //setCpuInProgress(true);
      // const rectAreas = getInitialCPUtargets(allClickAreasData, COLUMNS);
      // const rankings: RankingInfo[] = rectAreas.map((rectArea) => {
      //   const ranking = processCPUchoiceRankings(rectArea, allClickAreasData, COLUMNS, WINNING_LENGTH);
      //   return {
      //     index: rectArea.index,
      //     ranking,
      //   };
      // });
      // const highestRankings = getHighestRankings(rankings);
      // const rankedIndex = getRankedIndexforCPU(highestRankings);
      // const bestRanked = allClickAreasData[rankedIndex];
      // const bestRect = { ...allClickAreasData[bestRanked.index] };
      // bestRect.occupiedBy = 'opponent';
      // addExtraDataToRect(bestRect, bestRanked.index);
      // setCurrentPlayer('main');
      // setDefaultCursor(false);
      //startCPUlogic(allClickAreasData);
    }
  }, [currentPlayer, opponentName]);

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

          {allClickAreasData.map((data) => {
            return (
              <g key={data.index}>
                {data.winningArea && (
                  <Fade in={true}>
                    <Box component='circle' cx={data.x + 44} cy={data.y + 46} r='14' stroke='white' strokeWidth='6' fill='transparent'></Box>
                  </Fade>
                )}
                <Box
                  component='rect'
                  sx={{
                    '@media (hover: hover) and (pointer: fine)': {
                      cursor: data.fullColumn || props.disableUI || props.winner ? 'default' : 'pointer',
                      pointerEvents: data.fullColumn || props.disableUI || props.winner ? 'none' : 'auto',
                    },
                  }}
                  onClick={() => onRectClick(data)}
                  onMouseOver={() => onMouseOverPiece(data)}
                  onMouseLeave={() => onMouseLeavePiece(data)}
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
