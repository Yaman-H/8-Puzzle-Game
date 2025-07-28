from flask import Flask, render_template, jsonify, request
from solver import solve_puzzle

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/solve', methods=['POST'])
def solve():
    initial_state = request.json.get('initial_state')
    solution = solve_puzzle(initial_state)
    return jsonify(solution)


if __name__ == '__main__':
    app.run(debug=True)
