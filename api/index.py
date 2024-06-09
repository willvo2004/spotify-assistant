from flask import Flask, request, jsonify
import requests
from googlesearch import search

app = Flask(__name__)

@app.route("/api/name", methods=['GET'])
def hello_world():
    return "hello, world!"

@app.route("/api/tracks", methods=['GET'])
def search_spotify_songs():
    query = request.args.get('query')
    num_results = request.args.get('num_results', 10, type=int)

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Modify the query to focus on Spotify results
    modified_query = f"{query} site:open.spotify.com/track"
    
    # Replace with your search implementation or a mock function
    search_results = search(modified_query, num_results=num_results)  

    try:
        results_to_list = list(search_results)
        if not results_to_list or "None" in str(results_to_list[0]):
            spotify_url = str(results_to_list[1])
        else:
            spotify_url = str(results_to_list[0])

        response = requests.get(spotify_url)
        response.raise_for_status()
        
        return jsonify({"spotify_url": spotify_url}), 200

    except requests.RequestException as e:
        print(f"Failed to retrieve : {e}")
        return jsonify({"error": f"Failed to retrieve: {e}"}), 500

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred"}), 500


if __name__ == '__main__':
    app.run(port=5000)
