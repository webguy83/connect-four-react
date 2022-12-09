import { Box, Fade } from '@mui/material';
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

interface GameBoardProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
  opponentName: OpponentName;
  opponentIcon: JSX.Element;
}

export default function GameBoard(props: GameBoardProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('main');
  const [playerChips, setPlayerChips] = useState<JSX.Element[]>([]);
  const [rectAreaData, setRectAreaData] = useState<RectAreaData[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const { seconds, clearTimer } = useTimer();
  const { lowerBarHeight } = useLowerBarHeight(blockRef.current);

  function onRestartGameClick() {
    clearTimer();
    setWinner(null);
    setRectAreaData([]);
    setPlayerChips([]);
  }

  const addWinner = useCallback(() => {
    if (currentPlayer === 'main') {
      setWinner('opponent');
    } else {
      setWinner('main');
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (seconds <= 0) {
      addWinner();
    }
  }, [addWinner, seconds]);

  function closeRules() {
    setOpenPauseMenu(false);
  }

  return (
    <Fade in={true}>
      <Box width='100%'>
        <Box sx={gameBoardContainerStyles}>
          <ScoreBox Icon={<PlayerOne />} playerText='Player 1' />
          <div className='central-content'>
            <header className='game-board-header'>
              <PillButton onClick={() => setOpenPauseMenu(true)}>Menu</PillButton>
              <Logo />
              <PillButton onClick={onRestartGameClick}>Restart</PillButton>
            </header>
            <div className='horizontal-scores'>
              <ScoreBox Icon={<PlayerOne />} iconPlacement='left' playerText='Player 1' />
              <ScoreBox Icon={props.opponentIcon} iconPlacement='right' playerText={props.opponentName} reverseText />
            </div>
            <div className='board'>
              <div className='connectFour'>
                <GameGrid playerAccess={{ currentPlayer, playerChips, rectAreaData }} clearTimer={clearTimer} winner={winner} setPlayerChips={setPlayerChips} setCurrentPlayer={setCurrentPlayer} setRectAreaData={setRectAreaData} />
                <ConnectFourGridBlack />
              </div>
              <div ref={blockRef} className='timer-container'>
                {winner && (
                  <Fade in={true}>
                    <WinnerBox onPlayAgainClick={onRestartGameClick} currentPlayer={winner} opponentName={props.opponentName} />
                  </Fade>
                )}

                {!winner && (
                  <Fade in={true}>
                    <TimerBox timerSeconds={seconds} opponentName={props.opponentName} playerColour={mainColour[currentPlayer]} />
                  </Fade>
                )}
              </div>
            </div>
          </div>
          <ScoreBox Icon={props.opponentIcon} playerText={props.opponentName} />
        </Box>
        <Box sx={bottomBarStyles} height={lowerBarHeight}></Box>
        <Modal open={openPauseMenu} onClose={closeRules} aria-labelledby='rules-title' aria-describedby='rules-description'>
          <PauseMenu onRestartGameClick={onRestartGameClick} setGameState={props.setGameState} setOpenPauseMenu={setOpenPauseMenu} />
        </Modal>
      </Box>
    </Fade>
  );
}
