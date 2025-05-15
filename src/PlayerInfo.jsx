import React, { useEffect, useState } from 'react';
import './PlayerInfo.css';

const PlayerInfo = () => {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const fetchNewPlayer = () => {
    fetch('http://127.0.0.1:5000/random_players')
      .then(res => res.json())
      .then(data => {
        setPlayerData(data);
        setGuess("");
        setFeedback("");
        setShowPopup(false);
      })
      .catch(err => console.error("Erro ao carregar jogador:", err));
  };

  useEffect(() => {
    fetchNewPlayer();
  }, []);

  const handleGuess = () => {
    if (!playerData) return;

    if (guess.toLowerCase() === playerData.team_name.toLowerCase()) {
      setFeedback(`Correto! ${playerData.team_name}.`);
      setShowPopup(true);
      setTimeout(() => {
        fetchNewPlayer();
      }, 2000);
    } else {
      setFeedback("Errado! Tente novamente.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  };

  if (!playerData) return <p>Carregando jogador...</p>;

  return (
    <div className='container-main'>
      {playerData.image_url && (
        <img className='imgPlayer' src={playerData.image_url} alt={playerData.full_name} width="200" />
      )}
      <h2 className='namePlayer'>{playerData.full_name}</h2>

      {showPopup && (
        <div className='popup'>
          <p>{feedback}</p>
        </div>
      )}

      <div className='containerButtons'>
        <input
          type="text"
          value={guess}
          name="text"
          className="input"
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Em qual time ele joga?"
          list="nba-teams"
        />
        <datalist id="nba-teams">
          {[
            "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets",
            "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
            "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers",
            "Los Angeles Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat",
            "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
            "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns",
            "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors",
            "Utah Jazz", "Washington Wizards"
          ].map((team) => (
            <option key={team} value={team} />
          ))}
        </datalist>

        <div className="button-group">
          <button onClick={handleGuess}>
            <span>Guess</span>
          </button>
          <button onClick={fetchNewPlayer}>
            <span>New Player</span>
          </button>
        </div>
      </div>

      <div className="stats-box">
        <h4>Status</h4>
        <p>Posição: <strong>{playerData.status?.position || "?"}</strong></p>
        <p>PTS: <strong>{playerData.status?.pts ?? 0}</strong></p>
        <p>AST: <strong>{playerData.status?.ast ?? 0}</strong></p>
        <p>REB: <strong>{playerData.status?.reb ?? 0}</strong></p>
      </div>
    </div>
  );
};

export default PlayerInfo;
