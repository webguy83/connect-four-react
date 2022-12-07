import { Slide } from '@mui/material';

interface PlayerChipProps {
  x: number;
  y: number;
  container: SVGElement | null;
  colour: string;
  afterChipAnimated: () => void;
}

export default function PlayerChip(props: PlayerChipProps) {
  const now = new Date().getTime();
  const pathId = `path-${now}-player-chip`;
  const filterId = `filter-${now}-player-chip`;

  function onSlideFinished() {
    props.afterChipAnimated();
  }

  return (
    <>
      <defs>
        <circle id={pathId} cx={props.x} cy={props.y} r='32'></circle>
        <filter x='-3.9%' y='-3.9%' width='107.8%' height='107.8%' filterUnits='objectBoundingBox' id={filterId}>
          <feOffset dx='0' dy='5' in='SourceAlpha' result='shadowOffsetInner1'></feOffset>
          <feComposite in='shadowOffsetInner1' in2='SourceAlpha' operator='arithmetic' k2='-1' k3='1' result='shadowInnerInner1'></feComposite>
          <feColorMatrix values='0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0' type='matrix' in='shadowInnerInner1'></feColorMatrix>
        </filter>
      </defs>
      <Slide onEntered={onSlideFinished} in={true} timeout={500} container={props.container}>
        <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
          <g>
            <circle fill='#000000' cx={props.x} cy={props.y} r='35'></circle>
            <circle fill='#000000' cx={props.x} cy={props.y + 5} r='35'></circle>
            <g>
              <use fill={props.colour} fillRule='evenodd' xlinkHref={`#${pathId}`}></use>
              <use fill='black' fillOpacity='1' filter={`url(#${filterId})`} xlinkHref={`#${pathId}`}></use>
            </g>
          </g>
        </g>
      </Slide>
    </>
  );
}
