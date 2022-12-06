import { Box, Slide } from '@mui/material';
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

type Owner = 'main-player' | 'opponent' | null;

interface PieceData {
  owner: Owner;
}

const COLUMNS = 7;
const ROWS = 6;

const emptyArrayOfVals = Array(COLUMNS * ROWS).fill(null);

export default function GameBoard(props: GameBoardProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lowerBarHeight, setLowerBarHeight] = useState<number>(0);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [pieceContainers, setPieceContainers] = useState<PieceData[]>(emptyArrayOfVals);
  const [markerPos, setMarkerPos] = useState<number | null>(-100000000);
  const [showMarker, setShowMarker] = useState<boolean>(true);
  const [slideDown, setSlideDown] = useState(false);

  const onWindowResize = useCallback(() => {
    addBarHeight();
    checkToDisplayMarker();
  }, []);

  useEffect(() => {
    addBarHeight();
    window.addEventListener('resize', onWindowResize);

    return function () {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [onWindowResize]);

  // const onPieceClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   const elm = e.target as HTMLDivElement;
  //   const attr = elm.getAttribute('data-index')!;
  //   const pieceIndex = parseInt(attr);
  //   setMarkerPos(-100000000);
  //   setPieceContainers((oldPieces) => {
  //     const modifiedPieces = [...oldPieces];
  //     modifiedPieces[pieceIndex] = {
  //       owner: 'main-player',
  //     };
  //     return modifiedPieces;
  //   });
  // };

  // function makeHiddenDivs() {
  //   const invisibleBlocks = emptyArrayOfVals.map((_, i) => {
  //     return <div data-index={i} onMouseEnter={(e) => onMouseEnterPiece(e)} onMouseLeave={onMouseLeavePiece} onClick={(e) => onPieceClick(e)} key={i} className='invisible-block'></div>;
  //   });
  //   return invisibleBlocks;
  // }

  // function makePieceDivs() {
  //   const blocks = pieceContainers.map((playerChip, i) => {
  //     return (
  //       <div data-index={i} key={i} className='player-chip-block'>
  //         {playerChip && (
  //           <Slide in={playerChip.owner === 'main-player'} direction='down' container={gridRef.current}>
  //             <PlayerChip />
  //           </Slide>
  //         )}
  //       </div>
  //     );
  //   });
  //   return blocks;
  // }

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
        <div className='central-content'>
          <header className='game-board-header'>
            <PillButton onClick={() => setOpenPauseMenu(true)}>Menu</PillButton>
            <Logo />
            <PillButton>Restart</PillButton>
          </header>
          <div className='horizontal-scores'>
            <ScoreBox Icon={<PlayerOne />} iconPlacement='left' playerText='Player 1' />
            <ScoreBox Icon={<PlayerTwo />} iconPlacement='right' playerText='Player 2' />
          </div>
          <div className='board'>
            <div ref={gridRef} className='connectFour'>
              <Box
                sx={{
                  position: 'relative',
                }}
              >
                {/* <Box className='invisible-blocks-container' zIndex={10}>
                  {makeHiddenDivs()}
                </Box> */}
                <ConnectFourGridWhite />

                {/* <Box className='invisible-blocks-container' zIndex={0}>
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
                  </Box> }
                  { {makePieceDivs()}
                </Box> */}
                <ConnectFourGridBlack />
              </Box>
            </div>
            <div ref={blockRef} className='timer-container'>
              {/* <WinnerBox /> */}
              <TimerBox />
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
