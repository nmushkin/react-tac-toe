import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
      <button 
        className={"square" + (props.winning ? " winner" : "")}
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  isWinningSquare(squareNum) {
    const winners = this.props.winningSquares
    if (winners) {
      return (squareNum === winners[0] || squareNum === winners[1] || squareNum === winners[2])
    }
    return false
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winning={this.isWinningSquare(i)}
      />
    );
  }

  render() {
    let rows = []
    for (let row=0; row<9; row+=3) {
      rows.push(
        <div className="board-row">
          {this.renderSquare(row)}
          {this.renderSquare(row+1)}
          {this.renderSquare(row+2)}
        </div>
      )
    }
    
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null
      }],
      xNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
          squares: squares,
          position: i,
        }]),
      xNext: !this.state.xNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const squares = current.squares.slice()
    const winner = calculateWinner(squares)
    const moves = history.map((step, move) => {
      let moveText;
      if (move) {
        const coords = `(${step.position % 3 + 1},${Math.floor(step.position / 3) + 1})`
        const player = step.squares[step.position]
        moveText = `Go to move ${move}: ${player} -> ${coords}`
      } else {
        moveText = 'Go to start of game (or Restart)'
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{moveText}</button>
        </li>
      )
    })
    let status;
    let winningSquares = null;
    if (winner) {
      status = `${winner[0]} has won!`
      winningSquares = winner[1]
    } else if (this.state.stepNumber >= 9) {
      status = "It's a Draw!"
    } else {
      status = `Next player: ${this.state.xNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-status">{status}</div>
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares}/>
        </div>
        <div className="game-info">
          <p>History</p>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

