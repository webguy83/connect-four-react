import { Box } from '@mui/material';
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
import { GameState } from '../../utils/Types';
import MarkerIcon from '../Icons/MarkerIcon';

interface GameBoardProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const COLUMNS = 7;
const ROWS = 6;

export default function GameBoard(props: GameBoardProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [lowerBarHeight, setLowerBarHeight] = useState<number>(0);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);

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

  const onPieceClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const attr = (e.target as HTMLDivElement).getAttribute('data-attr');
    if (attr) {
      const d = attr;
      console.log(d);
      // console.log((e.target as HTMLDivElement).getBoundingClientRect());
    }
  };

  const makeHiddenDivs = () => {
    const arr = Array(COLUMNS * ROWS).fill(null);
    const invisibleBlocks = arr.map((_, i) => {
      return <div data-attr={{ bunk: i }} onClick={(e) => onPieceClick(e)} key={i} className='invisible-block'></div>;
    });
    return <div className='invisible-blocks-container'>{invisibleBlocks}</div>;
  };

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
            <MarkerIcon />
            <div className='grid'>
              <div className='connectFour'>
                {makeHiddenDivs()}
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
        <PauseMenu setGameState={props.setGameState} setOpenPauseMenu={setOpenPauseMenu} />
      </Modal>
    </>
  );
}
