import { Box, Fade, Theme } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
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
import { GameState, OpponentName, Player } from '../../utils/Types';
import { mainColour } from '../../CustomTheme';
import { useTimer } from './hooks/useTimer';
import { useLowerBarHeight } from './hooks/useLowerBarHeight';
import { RectAreaData } from '../../utils/Interfaces';
import { mainTransition } from '../../utils/Styles';
import { generateInitialRectDataArray } from './helpers/helpers';

interface GameBoardProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
  opponentName: OpponentName;
  opponentIcon: JSX.Element;
}

export default function GameBoard(props: GameBoardProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState<Player>('main');
  const [currentPlayer, setCurrentPlayer] = useState<Player>(startingPlayer);
  const [playerChips, setPlayerChips] = useState<JSX.Element[]>([]);
  const [rectAreaData, setRectAreaData] = useState<RectAreaData[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const { timerSeconds, clearTimer, pauseResumeTimer } = useTimer();
  const { lowerBarHeight } = useLowerBarHeight(blockRef.current);
  const [disableUI, setDisableUI] = useState(false);
  const [mainPlayerScore, setMainPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [tieGame, setTieGame] = useState(false);

  const COLUMNS = 7;
  const ROWS = 6;

  function onRestartGameClick() {
    resetOthers();
    setMainPlayerScore(0);
    setOpponentScore(0);
    setStartingPlayer('main');
    setCurrentPlayer('main');
    setRectAreaData(generateInitialRectDataArray(COLUMNS, ROWS));
  }

  useEffect(() => {
    const initRectData = generateInitialRectDataArray(COLUMNS, ROWS);
    setRectAreaData(initRectData);
    setCurrentPlayer(startingPlayer);
  }, [startingPlayer]);

  function onPlayAgainClick() {
    resetOthers();
    setStartingPlayer((prevStartingPlayer) => {
      const startingPlayer = prevStartingPlayer === 'main' ? 'opponent' : 'main';
      return startingPlayer;
    });
  }

  function resetOthers() {
    clearTimer();
    setOpenPauseMenu(false);
    setWinner(null);
    setPlayerChips([]);
    setDisableUI(false);
    setTieGame(false);
  }

  const addWinner = useCallback(() => {
    if (currentPlayer === 'main') {
      setWinner('opponent');
      setOpponentScore((prevScore) => prevScore + 1);
    } else {
      setWinner('main');
      setMainPlayerScore((prevScore) => prevScore + 1);
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (timerSeconds <= 0) {
      addWinner();
    }
  }, [addWinner, timerSeconds]);

  function closeMenu() {
    setOpenPauseMenu(false);
    pauseResumeTimer();
  }

  function openMenu() {
    setOpenPauseMenu(true);
    pauseResumeTimer();
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
                  rectAreaData={rectAreaData}
                  pauseResumeTimer={pauseResumeTimer}
                  clearTimer={clearTimer}
                  setWinner={setWinner}
                  setDisableUI={setDisableUI}
                  disableUI={disableUI}
                  winner={winner}
                  setPlayerChips={setPlayerChips}
                  setCurrentPlayer={setCurrentPlayer}
                  setRectAreaData={setRectAreaData}
                  timerSeconds={timerSeconds}
                  setOpponentScore={setOpponentScore}
                  setMainPlayerScore={setMainPlayerScore}
                  setTieGame={setTieGame}
                  opponentName={props.opponentName}
                />
                <ConnectFourGridBlack />
              </div>
              <div ref={blockRef} className='timer-container'>
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
