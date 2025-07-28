document.addEventListener('DOMContentLoaded', function () {
    const puzzleElement = document.getElementById('puzzle');
    const solveButton = document.getElementById('solveButton');
    const shuffleButton = document.getElementById('shuffleButton');
    const aStarButton = document.getElementById('aStarButton');
    const closeButton = document.getElementById('closeButton');
    const gameContainer = document.getElementById('gameContainer');
    const movesContainer = document.getElementById('movesContainer');

    let currentState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let moves = [];

    function drawPuzzle(state) {
        puzzleElement.innerHTML = '';
        state.forEach((num, index) => {
            const tile = document.createElement('div');
            tile.textContent = num !== 0 ? num : '';
            tile.className = 'tile';
            tile.addEventListener('click', () => moveTile(index));
            puzzleElement.appendChild(tile);
        });
    }

    function moveTile(index) {
        const zeroIndex = currentState.indexOf(0);
        const validMoves = [index - 1, index + 1, index - 3, index + 3];

        if (validMoves.includes(zeroIndex) && isValidMove(index, zeroIndex)) {
            [currentState[index], currentState[zeroIndex]] = [currentState[zeroIndex], currentState[index]];
            moves.push([...currentState]);
            updateMovesContainer();
            drawPuzzle(currentState);
        }
    }

    function isValidMove(index, zeroIndex) {
        if (index % 3 === 0 && zeroIndex === index - 1) return false;
        if (index % 3 === 2 && zeroIndex === index + 1) return false;
        return true;
    }

    function checkWin(state) {
        const winningState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        return JSON.stringify(state) === JSON.stringify(winningState);
    }

    function userSolvePuzzle() {
        if (checkWin(currentState)) {
            alert('Good job! You solved the puzzle!');
        } else {
            alert('The puzzle is not solved yet. Keep trying!');
        }
    }

    function shufflePuzzle() {
        currentState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        moves = [];
        for (let i = 0; i < 100; i++) {
            const zeroIndex = currentState.indexOf(0);
            const validMoves = [zeroIndex - 1, zeroIndex + 1, zeroIndex - 3, zeroIndex + 3].filter(isValidMoveIndex);
            const move = validMoves[Math.floor(Math.random() * validMoves.length)];
            [currentState[zeroIndex], currentState[move]] = [currentState[move], currentState[zeroIndex]];
        }
        updateMovesContainer();
        drawPuzzle(currentState);
    }

    // function updateMovesContainer() {
    //     movesContainer.innerHTML = '';
    //     moves.forEach(move => {
    //         const stateDiv = document.createElement('div');
    //         stateDiv.className = 'state';
    //         move.forEach(num => {
    //             const smallTile = document.createElement('div');
    //             smallTile.textContent = num !== 0 ? num : '';
    //             smallTile.className = 'small-tile';
    //             stateDiv.appendChild(smallTile);
    //         });
    //         movesContainer.appendChild(stateDiv);
    //     });
    // }
    function updateMovesContainer() {
        movesContainer.innerHTML = '';
        moves.forEach(move => {
            const stateDiv = document.createElement('div');
            stateDiv.className = 'state';
            move.forEach(num => {
                const smallTile = document.createElement('div');
                smallTile.textContent = num !== 0 ? num : '';
                smallTile.className = 'small-tile';
                stateDiv.appendChild(smallTile);
            });
            movesContainer.appendChild(stateDiv);
        });
    }


    function isValidMoveIndex(index) {
        return index >= 0 && index < 9;
    }

    function closeGame() {
        gameContainer.style.display = 'none';
        closeButton.style.display = 'none';
        alert('Game closed');
    }

    function aStarSolvePuzzle() {
        class Node {
            constructor(state, parent, cost, heuristic) {
                this.state = state;
                this.parent = parent;
                this.cost = cost;
                this.heuristic = heuristic;
            }

            get f() {
                return this.cost + this.heuristic;
            }
        }

        function manhattanDistance(state) {
            let distance = 0;
            for (let i = 0; i < state.length; i++) {
                if (state[i] !== 0) {
                    const x1 = i % 3, y1 = Math.floor(i / 3);
                    const x2 = (state[i] - 1) % 3, y2 = Math.floor((state[i] - 1) / 3);
                    distance += Math.abs(x1 - x2) + Math.abs(y1 - y2);
                }
            }
            return distance;
        }

        function getNeighbors(node) {
            const zeroIndex = node.state.indexOf(0);
            const moves = [-1, 1, -3, 3];
            return moves.map(move => {
                const newIndex = zeroIndex + move;
                if (isValidMoveIndex(newIndex) && isValidMove(zeroIndex, newIndex)) {
                    const newState = node.state.slice();
                    [newState[zeroIndex], newState[newIndex]] = [newState[newIndex], newState[zeroIndex]];
                    return new Node(newState, node, node.cost + 1, manhattanDistance(newState));
                }
                return null;
            }).filter(neighbor => neighbor !== null);
        }

        function reconstructPath(node) {
            const path = [];
            while (node !== null) {
                path.push(node.state);
                node = node.parent;
            }
            return path.reverse();
        }

        const startNode = new Node(currentState, null, 0, manhattanDistance(currentState));
        const openList = [startNode];
        const closedList = new Set();

        while (openList.length > 0) {
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift();

            if (checkWin(currentNode.state)) {
                const solution = reconstructPath(currentNode);
                moves = solution;
                animateSolution(solution);
                updateMovesContainer(); // Update moves container after finding solution
                return;
            }

            closedList.add(currentNode.state.toString());

            getNeighbors(currentNode).forEach(neighbor => {
                if (!closedList.has(neighbor.state.toString())) {
                    openList.push(neighbor);
                }
            });
        }

        alert('No solution found!');
    }

    function animateSolution(solution) {
        let i = 0;
        function step() {
            if (i < solution.length) {
                currentState = solution[i];
                drawPuzzle(currentState);
                i++;
                setTimeout(step, 300); // Adjust the delay time (in milliseconds) to slow down the animation
            }
        }
        step();
    }

    solveButton.addEventListener('click', userSolvePuzzle);
    shuffleButton.addEventListener('click', shufflePuzzle);
    aStarButton.addEventListener('click', aStarSolvePuzzle);
    closeButton.addEventListener('click', closeGame);

    drawPuzzle(currentState);
    shufflePuzzle();
    closeButton.style.display = 'block';
});
