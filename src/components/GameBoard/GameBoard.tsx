import { Box, Fade } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import PillButton from '../Buttons/PillButton';
import ConnectFourGridBlack from '../GameObjects/BoardGrid/ConnectFourGridBlack';
import ConnectFourGridWhite from '../GameObjects/BoardGrid/ConnectFourGridWhite';
import ScoreBox from '../GameObjects/ScoreBox/ScoreBox';
import TimerBox from '../GameObjects/TimerBox/TimerBox';
import WinnerBox from '../GameObjects/WinnerBox/WinnerBox';
import PlayerOne from '../Icons/PlayerOne';
import PlayerTwo from '../Icons/PlayerTwo';
import Logo from '../Logo/Logo';
import { bottomBarStyles, gameBoardContainerStyles } from './GameBoard.styles';
import Modal from '@mui/material/Modal';
import PauseMenu from '../PauseMenu/PauseMenu';
import { GameState, OpponentName, Player } from '../../utils/Types';
import CPUIcon from '../Icons/CPUIcon';
import { mainColour } from '../../CustomTheme';
import { useTimer } from './hooks/useTimer';
import { useWindowResize } from './hooks/useWindowResize';

interface GameBoardProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
  opponentName: OpponentName;
}

export default function GameBoard(props: GameBoardProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('main');
  const [winner, setWinner] = useState<Player | null>(null);
  const { seconds, clearTimer } = useTimer();
  const { lowerBarHeight } = useWindowResize(blockRef.current);

  function onRestartGameClick() {
    clearTimer();
    setWinner(null);
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
              <ScoreBox Icon={props.opponentName === 'Player 2' ? <PlayerTwo /> : <CPUIcon />} iconPlacement='right' playerText={props.opponentName} reverseText />
            </div>
            <div className='board'>
              <div className='connectFour'>
                <ConnectFourGridWhite playerAccess={{ setCurrentPlayer, currentPlayer }} />
                <ConnectFourGridBlack />
              </div>
              <div ref={blockRef} className='timer-container'>
                {winner && (
                  <Fade in={true}>
                    <WinnerBox currentPlayer={winner} opponentName={props.opponentName} />
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
          <ScoreBox Icon={props.opponentName === 'Player 2' ? <PlayerTwo /> : <CPUIcon />} playerText={props.opponentName} />
        </Box>
        <Box sx={bottomBarStyles} height={lowerBarHeight}></Box>
        <Modal open={openPauseMenu} onClose={closeRules} aria-labelledby='rules-title' aria-describedby='rules-description'>
          <PauseMenu setGameState={props.setGameState} setOpenPauseMenu={setOpenPauseMenu} />
        </Modal>
      </Box>
    </Fade>
  );
}
