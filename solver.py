import heapq


class Node:
    def __init__(self, state, parent, move, depth, cost):
        self.state = state
        self.parent = parent
        self.move = move
        self.depth = depth
        self.cost = cost

    def __lt__(self, other):
        return self.cost < other.cost


def heuristic(state, goal):
    return sum(abs(s % 3 - g % 3) + abs(s // 3 - g // 3)
               for s, g in ((state.index(i), goal.index(i)) for i in range(1, 9)))


def get_neighbors(state):
    neighbors = []
    i = state.index(0)
    moves = []
    if i % 3 > 0:
        moves.append(-1)
    if i % 3 < 2:
        moves.append(1)
    if i // 3 > 0:
        moves.append(-3)
    if i // 3 < 2:
        moves.append(3)

    for move in moves:
        new_state = state[:]
        new_state[i], new_state[i + move] = new_state[i + move], new_state[i]
        neighbors.append((new_state, move))

    return neighbors


def solve_puzzle(initial_state):
    goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    open_set = []
    closed_set = set()
    start_node = Node(initial_state, None, None, 0,
                      heuristic(initial_state, goal))
    heapq.heappush(open_set, start_node)

    while open_set:
        current_node = heapq.heappop(open_set)

        if current_node.state == goal:
            moves = []
            node = current_node
            while node.parent is not None:
                moves.append(node.move)
                node = node.parent
            moves.reverse()
            return moves

        closed_set.add(tuple(current_node.state))

        for neighbor, move in get_neighbors(current_node.state):
            if tuple(neighbor) in closed_set:
                continue
            neighbor_node = Node(neighbor, current_node, move, current_node.depth +
                                 1, current_node.depth + 1 + heuristic(neighbor, goal))
            heapq.heappush(open_set, neighbor_node)

    return None
