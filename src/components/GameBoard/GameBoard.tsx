import { Box, Fade, Theme } from '@mui/material';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import PillButton from '../Buttons/PillButton';
import ConnectFourGridBlack from '../GameObjects/BoardGrid/ConnectFourGridBlack';
import GameGrid from '../GameGrid/GameGrid';
import ScoreBox from '../GameObjects/ScoreBox/ScoreBox';
import TimerBox from '../GameObjects/TimerBox/TimerBox';
import WinnerBox from '../GameObjects/WinnerBox/WinnerBox';
import PlayerOne from '../Icons/PlayerOne';
import Logo from '../Logo/Logo';
import { bottomBarStyles, gameBoardContainerStyles } from './GameBoard.styles';
import Modal from '@mui/material/Modal';
import PauseMenu from '../PauseMenu/PauseMenu';
import { GameState, OpponentName } from '../../utils/Types';
import { mainColour } from '../../CustomTheme';
import { useTimer } from './hooks/useTimer';
import { useLowerBarHeight } from './hooks/useLowerBarHeight';
import { mainTransition } from '../../utils/Styles';
import { generateInitialRectDataArray } from './helpers';
import { COLUMNS, ROWS } from '../../utils/constants';
import { useInitialRectData } from './hooks/useInitialRectData';
import { useWinner } from './hooks/useWinner';

interface GameBoardProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
  opponentName: OpponentName;
  opponentIcon: JSX.Element;
}

export default function GameBoard(props: GameBoardProps) {
  const lowerBlockRef = useRef<HTMLDivElement>(null);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const { setStartingPlayer, currentPlayer, setCurrentPlayer, allClickAreasData, setAllClickAreasData, startingPlayer } = useInitialRectData();
  const [playerChips, setPlayerChips] = useState<JSX.Element[]>([]);
  const { timerSeconds, clearTimer, pauseTimer, resumeTimer } = useTimer();
  const { lowerBarHeight } = useLowerBarHeight(lowerBlockRef.current);
  const [disableUI, setDisableUI] = useState(false);
  const [tieGame, setTieGame] = useState(false);
  const { setMainPlayerScore, setOpponentScore, winner, setWinner, opponentScore, mainPlayerScore } = useWinner(currentPlayer, timerSeconds);

  function onRestartGameClick() {
    resetOthers();
    setMainPlayerScore(0);
    setOpponentScore(0);
    setStartingPlayer('main');
    setCurrentPlayer('main');
  }

  function onPlayAgainClick() {
    resetOthers();
    setStartingPlayer((prevStartingPlayer) => {
      const newStartPlayer = prevStartingPlayer === 'main' ? 'opponent' : 'main';
      return newStartPlayer;
    });
    setCurrentPlayer((prevStartingPlayer) => {
      const newStartPlayer = prevStartingPlayer === 'main' ? 'opponent' : 'main';
      return newStartPlayer;
    });
  }

  function resetOthers() {
    clearTimer();
    setOpenPauseMenu(false);
    setWinner(null);
    setAllClickAreasData(generateInitialRectDataArray(COLUMNS, ROWS));
    setPlayerChips([]);
    setDisableUI(false);
    setTieGame(false);
  }

  function closeMenu() {
    setOpenPauseMenu(false);
    resumeTimer();
  }

  function openMenu() {
    setOpenPauseMenu(true);
    pauseTimer();
  }

  return (
    <Fade in={true}>
      <Box width='100%' height='100%' display='flex' justifyContent='center'>
        <Box sx={gameBoardContainerStyles}>
          <ScoreBox score={mainPlayerScore} Icon={<PlayerOne />} playerText='Player 1' />
          <div className='central-content'>
            <header className='game-board-header'>
              <PillButton onClick={openMenu}>Menu</PillButton>
              <Logo />
              <PillButton onClick={onRestartGameClick}>Restart</PillButton>
            </header>
            <div className='horizontal-scores'>
              <ScoreBox score={mainPlayerScore} Icon={<PlayerOne />} iconPlacement='left' playerText='Player 1' />
              <ScoreBox score={opponentScore} Icon={props.opponentIcon} iconPlacement='right' playerText={props.opponentName} reverseText />
            </div>
            <div className='board'>
              <div className='connectFour'>
                <GameGrid
                  currentPlayer={currentPlayer}
                  playerChips={playerChips}
                  allClickAreasData={allClickAreasData}
                  pauseTimer={pauseTimer}
                  resumeTimer={resumeTimer}
                  clearTimer={clearTimer}
                  setWinner={setWinner}
                  setDisableUI={setDisableUI}
                  disableUI={disableUI}
                  winner={winner}
                  setPlayerChips={setPlayerChips}
                  setCurrentPlayer={setCurrentPlayer}
                  setAllClickAreasData={setAllClickAreasData}
                  timerSeconds={timerSeconds}
                  setOpponentScore={setOpponentScore}
                  setMainPlayerScore={setMainPlayerScore}
                  setTieGame={setTieGame}
                  opponentName={props.opponentName}
                />
                <ConnectFourGridBlack />
              </div>
              <div ref={lowerBlockRef} className='timer-container'>
                {(winner || tieGame) && (
                  <Fade in={true}>
                    <WinnerBox tieGame={tieGame} onPlayAgainClick={onPlayAgainClick} currentPlayer={winner} opponentName={props.opponentName} />
                  </Fade>
                )}

                {!winner && !tieGame && (
                  <Fade in={true}>
                    <TimerBox timerSeconds={timerSeconds} opponentName={props.opponentName} playerColour={mainColour[currentPlayer]} />
                  </Fade>
                )}
              </div>
            </div>
          </div>
          <ScoreBox score={opponentScore} Icon={props.opponentIcon} playerText={props.opponentName} />
        </Box>
        <Box
          sx={[
            bottomBarStyles,
            (theme: Theme) => ({
              backgroundColor: winner ? mainColour[winner] : theme.palette.primary.main,
              transition: `background-color ${mainTransition}`,
            }),
          ]}
          height={lowerBarHeight}
        ></Box>
        <Modal open={openPauseMenu} onClose={closeMenu} aria-labelledby='rules-title' aria-describedby='rules-description'>
          <PauseMenu onRestartGameClick={onRestartGameClick} setGameState={props.setGameState} closeMenu={closeMenu} />
        </Modal>
      </Box>
    </Fade>
  );
}
