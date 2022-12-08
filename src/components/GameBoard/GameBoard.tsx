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

interface GameBoardProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
  opponentName: OpponentName;
}

export default function GameBoard(props: GameBoardProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [lowerBarHeight, setLowerBarHeight] = useState<number>(0);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('main');

  const onWindowResize = useCallback(() => {
    addBarHeight();
  }, []);

  useEffect(() => {
    addBarHeight();
    window.addEventListener('resize', onWindowResize);

    return function () {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [onWindowResize]);

  function addBarHeight() {
    if (blockRef.current) {
      const height = document.body.clientHeight - blockRef.current.getBoundingClientRect().y - window.scrollY;
      setLowerBarHeight(height);
    }
  }

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
              <PillButton>Restart</PillButton>
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
                <WinnerBox currentPlayer={currentPlayer} opponentName={props.opponentName} />
                {/* <Fade in={true}>
                  <TimerBox opponentName={props.opponentName} playerColour={currentPlayer === 'main' ? mainColour.main : mainColour.opponent} />
                </Fade> */}
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
