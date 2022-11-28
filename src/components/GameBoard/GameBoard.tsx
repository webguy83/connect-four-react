import { Box, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
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

export default function GameBoard() {
  const blockRef = useRef<HTMLDivElement>(null);
  const [lowerBarHeight, setLowerBarHeight] = useState<number>(0);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);

  function addBarHeight() {
    if (blockRef.current) {
      const height = document.body.clientHeight - blockRef.current.getBoundingClientRect().y;
      setLowerBarHeight(height);
    }
  }

  function closeRules() {
    setOpenPauseMenu(false);
  }

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

  return (
    <>
      <Box sx={gameBoardContainerStyles}>
        <ScoreBox Icon={<PlayerOne />} playerText='Player 1' />
        <div className='group'>
          <header>
            <PillButton onClick={() => setOpenPauseMenu(true)}>Menu</PillButton>
            <Logo />
            <PillButton>Restart</PillButton>
          </header>
          <div className='scores'>
            <ScoreBox Icon={<PlayerOne />} iconPlacement='left' playerText='Player 1' />
            <ScoreBox Icon={<PlayerTwo />} iconPlacement='right' playerText='Player 2' />
          </div>
          <div className='board'>
            <div className='grid'>
              <div className='connectFour'>
                <ConnectFourGridWhite />
                <ConnectFourGridBlack />
              </div>
              <div ref={blockRef} className='lower-block'>
                {/* <WinnerBox /> */}
                <TimerBox />
              </div>
            </div>
          </div>
        </div>
        <ScoreBox Icon={<PlayerTwo />} playerText='Player 2' />
      </Box>
      <Box sx={bottomBarStyles} height={lowerBarHeight}></Box>
      <Modal open={openPauseMenu} onClose={closeRules} aria-labelledby='rules-title' aria-describedby='rules-description'>
        <PauseMenu />
      </Modal>
    </>
  );
}
