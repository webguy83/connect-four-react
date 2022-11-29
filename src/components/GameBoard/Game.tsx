const COLUMNS = 7;
const ROWS = 6;

const onPieceClick = () => {
  console.log('get rekt');
};

export const makeHiddenDivs = () => {
  const arr = Array(COLUMNS * ROWS).fill(null);
  const invisibleBlocks = arr.map((_, i) => {
    return <div onClick={onPieceClick} key={i} className='invisible-block'></div>;
  });
  return <div className='invisible-blocks-container'>{invisibleBlocks}</div>;
};
