import { useCallback, useEffect, useState } from 'react';
import { Player } from '../../../utils/Types';

export function useWinner(currentPlayer: Player, seconds: number) {
  const [winner, setWinner] = useState<Player | null>(null);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [mainPlayerScore, setMainPlayerScore] = useState<number>(0);

  const addWinner = useCallback(() => {
    if (currentPlayer === 'main') {
      setWinner('opponent');
      //setOpponentScore((prevScore) => prevScore + 1);
    } else {
      setWinner('main');
      //setMainPlayerScore((prevScore) => prevScore + 1);
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (seconds <= 0) {
      addWinner();
    }
  }, [addWinner, seconds]);

  return { winner, setWinner, opponentScore, setOpponentScore, mainPlayerScore, setMainPlayerScore };
}
