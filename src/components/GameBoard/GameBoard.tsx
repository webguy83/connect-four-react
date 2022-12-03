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
import { GameState } from '../../utils/Types';
import MarkerIcon from '../Icons/MarkerIcon';
import Piece from '../Icons/Piece';

interface GameBoardProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const COLUMNS = 7;
const ROWS = 6;

export default function GameBoard(props: GameBoardProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [lowerBarHeight, setLowerBarHeight] = useState<number>(0);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [pieceContainers, setPieceContainers] = useState(Array(COLUMNS * ROWS).fill(null));
  const [markerPos, setMarkerPos] = useState<number | null>(-100000000);
  const [showMarker, setShowMarker] = useState<boolean>(true);

  const onWindowResize = useCallback(() => {
    addBarHeight();
    checkToDisplayMarker();
  }, []);

  function onMouseEnterPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (showMarker) {
      const elm = e.target as HTMLDivElement;
      setMarkerPos(elm.offsetLeft + elm.offsetWidth / 2 - 19);
    }
  }

  function onMouseLeavePiece() {
    if (showMarker) {
      setMarkerPos(-100000000);
    }
  }
  useEffect(() => {
    addBarHeight();
    window.addEventListener('resize', onWindowResize);

    return function () {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [onWindowResize]);

  const onPieceClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const elm = e.target as HTMLDivElement;
    const attr = elm.getAttribute('data-attr')!;
    const pieceIndex = parseInt(attr);
    setMarkerPos(-100000000);
  };

  function makeHiddenDivs() {
    const invisibleBlocks = pieceContainers.map((_, i) => {
      return <div data-attr={i} onMouseEnter={(e) => onMouseEnterPiece(e)} onMouseLeave={onMouseLeavePiece} onClick={(e) => onPieceClick(e)} key={i} className='invisible-block'></div>;
    });
    return invisibleBlocks;
  }

  function makePieceDivs() {
    const blocks = pieceContainers.map((_, i) => {
      return (
        <div data-attr={i} key={i} className='piece-block'>
          <Piece />
        </div>
      );
    });
    return blocks;
  }

  function checkToDisplayMarker() {
    if (window.innerWidth < 1080) {
      setShowMarker(false);
    } else {
      setShowMarker(true);
    }
  }

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
            <div className='grid'>
              <div className='connectFour'>
                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Box className='invisible-blocks-container' zIndex={10}>
                    {makeHiddenDivs()}
                  </Box>
                  <ConnectFourGridWhite />

                  <Box className='invisible-blocks-container' zIndex={0}>
                    <Box
                      sx={(theme) => ({
                        display: 'none',

                        [theme.breakpoints.up('mdlg')]: {
                          display: 'block',
                        },
                        position: 'absolute',
                        top: -45,
                        left: markerPos,
                        transition: 'all .25s cubic-bezier(0.4, 0, 0.2, 1)',
                      })}
                    >
                      <MarkerIcon />
                    </Box>
                    {makePieceDivs()}
                  </Box>
                  <ConnectFourGridBlack />
                </Box>
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
