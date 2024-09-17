from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')


@app.route('/api/users', methods=['GET'])
def users():
    return jsonify({'users': ['Zach', 'Jess']})

@app.route('/api/submit_answers', methods=['POST'])
def submit_answers():
    data = request.get_json(force=True)
    print(data)  # For debugging purposes
    return jsonify({'status': 'success', 'data': data})

# @app.route('/api/get_answers', methods=['GET'])
# def get_answers():
#     return jsonify({'answers': answers_storage})

if __name__ == '__main__':
    app.run(debug=True, port=5000)