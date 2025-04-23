import React, { useEffect, useState } from 'react';
import './PlayerInfo.css';

const PlayerInfo = () => {

    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    
    const [playerData, setPlayerData] = useState(() => {
        const savedPlayer = localStorage.getItem("playerData");
        return savedPlayer ? JSON.parse(savedPlayer) : null;
    });

    useEffect(() => {
        if (!playerData) {
            fetch('http://127.0.0.1:5000/jogador_aleatorio')
                .then((response) => response.json())
                .then((data) => {
                    setPlayerData(data);
                    localStorage.setItem("playerData", JSON.stringify(data));
                })
                .catch((error) => console.error("Erro ao obter dados:", error));
        }
    }, [playerData]);

    const handleGuess = () => {
        if (guess.toLowerCase() === playerData.team_name.toLowerCase()) {
            setFeedback(`Correto! ${playerData.team_name}.`);
            setTimeout(() => {
                setShowPopup(false);
                refreshPlayer();
            },2000);
        } else {
            setFeedback("Errado! Tente novamente.");
        }
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 2000);
    };

    const refreshPlayer = () => {
        localStorage.removeItem("playerData");
        setPlayerData(null);
        setGuess("");
        setFeedback("");
    };

    if (!playerData) return <p>Loading</p>;

    return (
        <div className='container-main'>
            {playerData.image_url && (
                <img className='imgPlayer' src={playerData.image_url} alt={`${playerData.full_name}`} width="200" />
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
                />
                <div className="button-group">
                    <button onClick={handleGuess}>
                        <span> Guess </span>
                    </button>
                    <button onClick={refreshPlayer}>
                        <span> New Player </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerInfo;
