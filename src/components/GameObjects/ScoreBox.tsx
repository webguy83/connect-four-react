import PlayerOne from '../Icons/PlayerOne';

export default function ScoreBox() {
  return (
    <div className='scoreBox'>
      <PlayerOne />
      <p className='playerText'>Player 1</p>
      <p className='score'>35</p>
    </div>
  );
}
