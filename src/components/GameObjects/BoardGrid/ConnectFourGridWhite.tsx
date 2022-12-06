import { Box } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import MarkerIcon from '../../Icons/MarkerIcon';
import PlayerChip from '../PlayerChip/PlayerChip';

type Player = 'main-player' | 'opponent';

interface RectAreaData {
  x: number;
  y: number;
  occupiedBy?: Player;
  fullColumn?: boolean;
}

export default function ConnectFourGridWhite() {
  const ref = useRef(null);
  const [playerChips, showPlayerChips] = useState<JSX.Element[]>([]);
  const [rectAreaData, setRectAreaData] = useState<RectAreaData[]>([]);
  const [markerPos, setMarkerPos] = useState<number | null>(-100000000);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('main-player');

  const COLUMNS = 7;
  const ROWS = 6;

  useEffect(() => {
    const output = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const x = 88 * col + 8;
        const y = 88 * row + 8;
        output.push({ x, y });
      }
    }

    setRectAreaData(output);
  }, []);

  function onMouseEnterPiece(e: React.MouseEvent<SVGRectElement, MouseEvent>, index: number) {
    const elm = e.target as SVGRectElement;
    const rectData = rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(rectData.x + elm.width.baseVal.value / 2 - 19);
    }
  }

  function onMouseLeavePiece(index: number) {
    const rectData = rectAreaData[index];
    if (!rectData.fullColumn) {
      setMarkerPos(-100000000);
    }
  }

  const onRectClick = (index: number) => {
    if (rectAreaData[index].fullColumn) {
      return;
    }

    let indexCounter = index;
    if (rectAreaData[indexCounter]?.occupiedBy) {
      while (indexCounter >= 0 && rectAreaData[indexCounter]?.occupiedBy) {
        indexCounter -= COLUMNS;
      }
    } else {
      while (indexCounter + COLUMNS < COLUMNS * ROWS && !rectAreaData[indexCounter + COLUMNS]?.occupiedBy) {
        indexCounter += COLUMNS;
      }
    }

    let rect = rectAreaData[indexCounter];
    if (rect) {
      occupyPlayer(rect, indexCounter);
      if (indexCounter < COLUMNS) {
        addFullColumn(indexCounter - COLUMNS);
      }
    } else {
      addFullColumn(indexCounter);
    }

    if (currentPlayer === 'main-player') {
      setCurrentPlayer('opponent');
    } else {
      setCurrentPlayer('main-player');
    }
  };

  function occupyPlayer(rect: RectAreaData, indexCounter: number) {
    const x = rect.x + 44;
    const y = rect.y + 44;
    showPlayerChips((oldValues) => {
      return [...oldValues, <PlayerChip key={new Date().getTime()} x={x} y={y} container={ref.current} />];
    });
    setRectAreaData((oldData) => {
      const newRectAreaData = [...oldData];
      newRectAreaData[indexCounter].occupiedBy = 'main-player';
      return newRectAreaData;
    });
  }

  function addFullColumn(indexCounter: number) {
    setMarkerPos(-100000000);
    setRectAreaData((oldData) => {
      const newRectAreaData = [...oldData];
      while (indexCounter + COLUMNS < COLUMNS * ROWS) {
        newRectAreaData[indexCounter + COLUMNS].fullColumn = true;
        indexCounter += COLUMNS;
      }
      return newRectAreaData;
    });
  }

  return (
    <>
      <Box
        sx={(theme) => ({
          display: 'none',

          [theme.breakpoints.up('mdlg')]: {
            display: 'block',
          },
          position: 'absolute',
          top: -37,
          left: markerPos,
          transition: 'all .25s cubic-bezier(0.4, 0, 0.2, 1)',
        })}
      >
        <MarkerIcon />
      </Box>

      <svg ref={ref} className='white-grid' width='100%' height='100%' viewBox='0 0 632 584' xmlns='http://www.w3.org/2000/svg'>
        {playerChips}
        <path
          d='M592 1.5c10.631 0 20.256 4.31 27.224 11.276C626.19 19.744 630.5 29.37 630.5 40v504c0 10.631-4.31 20.256-11.276 27.224C612.256 578.19 602.63 582.5 592 582.5H40c-10.631 0-20.256-4.31-27.224-11.276C5.81 564.256 1.5 554.63 1.5 544V40c0-10.631 4.31-20.256 11.276-27.224C19.744 5.81 29.37 1.5 40 1.5h552Zm-12 457c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-176 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-175.994 0c-9.253-.002-17.63 3.748-23.694 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.15-3.669-17.444-9.616-23.49-5.958-6.058-14.203-9.86-23.337-10.006ZM52 458.5c-9.25 0-17.626 3.75-23.688 9.812C22.25 474.374 18.5 482.749 18.5 492c0 9.25 3.75 17.626 9.812 23.688C34.374 521.75 42.749 525.5 52 525.5c9.25 0 17.626-3.75 23.688-9.812C81.75 509.626 85.5 501.251 85.5 492c0-9.25-3.75-17.626-9.812-23.688C69.626 462.25 61.251 458.5 52 458.5Zm528-88c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C22.25 386.374 18.5 394.749 18.5 404c0 9.25 3.75 17.626 9.812 23.688C34.374 433.75 42.749 437.5 52 437.5c9.25 0 17.626-3.75 23.688-9.812C81.75 421.626 85.5 413.251 85.5 404c0-9.25-3.75-17.626-9.812-23.688C69.626 374.25 61.251 370.5 52 370.5Zm0-88c-9.25 0-17.626 3.75-23.688 9.812C22.25 298.374 18.5 306.749 18.5 316c0 9.25 3.75 17.626 9.812 23.688C34.374 345.75 42.749 349.5 52 349.5c9.25 0 17.626-3.75 23.688-9.812C81.75 333.626 85.5 325.251 85.5 316c0-9.25-3.75-17.626-9.812-23.688C69.626 286.25 61.251 282.5 52 282.5Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-440-88c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-528 0c-9.25 0-17.626 3.75-23.688 9.812C22.25 210.374 18.5 218.749 18.5 228c0 9.25 3.75 17.626 9.812 23.688C34.374 257.75 42.749 261.5 52 261.5c9.25 0 17.626-3.75 23.688-9.812C81.75 245.626 85.5 237.251 85.5 228c0-9.25-3.75-17.626-9.812-23.688C69.626 198.25 61.251 194.5 52 194.5Zm528-88c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812-6.062 6.062-9.812 14.437-9.812 23.688 0 9.25 3.75 17.626 9.812 23.688 6.062 6.062 14.437 9.812 23.688 9.812 9.25 0 17.626-3.75 23.688-9.812 6.062-6.062 9.812-14.437 9.812-23.688 0-9.25-3.75-17.626-9.812-23.688-6.062-6.062-14.437-9.812-23.688-9.812Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C22.25 122.374 18.5 130.749 18.5 140c0 9.25 3.75 17.626 9.812 23.688C34.374 169.75 42.749 173.5 52 173.5c9.25 0 17.626-3.75 23.688-9.812C81.75 157.626 85.5 149.251 85.5 140c0-9.25-3.75-17.626-9.812-23.688C69.626 110.25 61.251 106.5 52 106.5Zm528-88c-9.25 0-17.626 3.75-23.688 9.812C550.25 34.374 546.5 42.749 546.5 52c0 9.25 3.75 17.626 9.812 23.688C562.374 81.75 570.749 85.5 580 85.5c9.25 0 17.626-3.75 23.688-9.812C609.75 69.626 613.5 61.251 613.5 52c0-9.25-3.75-17.626-9.812-23.688C597.626 22.25 589.251 18.5 580 18.5Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C462.25 34.374 458.5 42.749 458.5 52c0 9.25 3.75 17.626 9.812 23.688C474.374 81.75 482.749 85.5 492 85.5c9.25 0 17.626-3.75 23.688-9.812C521.75 69.626 525.5 61.251 525.5 52c0-9.25-3.75-17.626-9.812-23.688C509.626 22.25 501.251 18.5 492 18.5Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C374.25 34.374 370.5 42.749 370.5 52c0 9.25 3.75 17.626 9.812 23.688C386.374 81.75 394.749 85.5 404 85.5c9.25 0 17.626-3.75 23.688-9.812C433.75 69.626 437.5 61.251 437.5 52c0-9.25-3.75-17.626-9.812-23.688C421.626 22.25 413.251 18.5 404 18.5Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C286.25 34.374 282.5 42.749 282.5 52c0 9.25 3.75 17.626 9.812 23.688C298.374 81.75 306.749 85.5 316 85.5c9.25 0 17.626-3.75 23.688-9.812C345.75 69.626 349.5 61.251 349.5 52c0-9.25-3.75-17.626-9.812-23.688C333.626 22.25 325.251 18.5 316 18.5Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C198.25 34.374 194.5 42.749 194.5 52c0 9.25 3.75 17.626 9.812 23.688C210.374 81.75 218.749 85.5 228 85.5c9.25 0 17.626-3.75 23.688-9.812C257.75 69.626 261.5 61.251 261.5 52c0-9.25-3.75-17.626-9.812-23.688C245.626 22.25 237.251 18.5 228 18.5Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C110.25 34.374 106.5 42.749 106.5 52c0 9.25 3.75 17.626 9.812 23.688C122.374 81.75 130.749 85.5 140 85.5c9.25 0 17.626-3.75 23.688-9.812C169.75 69.626 173.5 61.251 173.5 52c0-9.25-3.75-17.626-9.812-23.688C157.626 22.25 149.251 18.5 140 18.5Zm-88 0c-9.25 0-17.626 3.75-23.688 9.812C22.25 34.374 18.5 42.749 18.5 52c0 9.25 3.75 17.626 9.812 23.688C34.374 81.75 42.749 85.5 52 85.5c9.25 0 17.626-3.75 23.688-9.812C81.75 69.626 85.5 61.251 85.5 52c0-9.25-3.75-17.626-9.812-23.688C69.626 22.25 61.251 18.5 52 18.5Z'
          fill='#FFF'
          stroke='#000'
          strokeWidth='3'
          fillRule='evenodd'
        />
        {rectAreaData.map((data, i) => {
          return (
            <rect
              key={i}
              style={{ cursor: data.fullColumn ? 'default' : 'pointer' }}
              onClick={() => onRectClick(i)}
              onMouseEnter={(e) => onMouseEnterPiece(e, i)}
              onMouseLeave={() => onMouseLeavePiece(i)}
              width='88'
              height='88'
              x={data.x}
              y={data.y}
              opacity='0'
            />
          );
        })}
      </svg>
    </>
  );
}
