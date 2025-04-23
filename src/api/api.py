from flask import Flask, jsonify
from flask_cors import CORS
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import playercareerstats
import random

app = Flask(__name__)
CORS(app)

nba_teams = teams.get_teams()
nba_players = players.get_active_players()

@app.route('/jogador_aleatorio', methods=['GET'])
def jogador_aleatorio():
    jogador = random.choice(nba_players)
    
    career = playercareerstats.PlayerCareerStats(player_id=jogador['id'])
    career_df = career.get_data_frames()[0]

    ultimo_time_info = career_df[career_df['TEAM_ID'] != 0].iloc[-1]
    ultimo_time_id = ultimo_time_info['TEAM_ID']
    team_abbreviation = ultimo_time_info['TEAM_ABBREVIATION']
    
    time_jogador = next((team for team in nba_teams if team['id'] == ultimo_time_id), None)

    image_url = f"https://cdn.nba.com/headshots/nba/latest/1040x760/{jogador['id']}.png"

    response = {
        "full_name": jogador['full_name'],
        "player_id": jogador['id'],
        "image_url": image_url
    }
    
    if time_jogador:
        response["team_id"] = time_jogador['id']
        response["team_name"] = time_jogador['full_name']
        response["team_abbreviation"] = team_abbreviation
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=False)
