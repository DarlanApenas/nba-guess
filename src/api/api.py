from flask import Flask, jsonify
from flask_cors import CORS
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import commonplayerinfo
import random

app = Flask(__name__)
CORS(app)
nba_teams = teams.get_teams()
nba_players = players.get_active_players()


@app.route('/random_players', methods=['GET'])
def random_players():
    player = random.choice(nba_players)
    career = playercareerstats.PlayerCareerStats(player_id=player['id'])
    player_info = commonplayerinfo.CommonPlayerInfo(player_id=player['id'])
    player_info_dic = player_info.get_normalized_dict()
    status = player_info_dic['PlayerHeadlineStats'][0]
    common_info = player_info_dic['CommonPlayerInfo'][0]
    career_df = career.get_data_frames()[0]

    ultimo_time_info = career_df[career_df['TEAM_ID'] != 0].iloc[-1]
    ultimo_time_id = ultimo_time_info['TEAM_ID']
    team_abbreviation = ultimo_time_info['TEAM_ABBREVIATION']
    
    played_team = next((team for team in nba_teams if team['id'] == ultimo_time_id), None)

    pts = float(status['PTS'])
    ast = float(status['AST'])
    reb = float(status['REB'])

    image_url = f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player['id']}.png"


    response = {
        "full_name": player['full_name'],
        "player_id": player['id'],
        "image_url": image_url,
        "team_id": played_team['id'],
        "team_name": played_team['full_name'],
        "team_abbreviation": team_abbreviation,
        "status": {
            'pts': pts,
            'ast': ast,
            'reb': reb,
            'season': status['TimeFrame'],
            'position': common_info['POSITION'],
            'height': common_info['HEIGHT']
        }
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=False)