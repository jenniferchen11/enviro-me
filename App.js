import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { //this component renders a single <button> (button is NOT a user-defined object)
  return ( //FUNCTIONS MUST RETURN REACT ELEMENTS
    <button 
      className="square" //React elements must have classNames
      onClick = {props.onClick} //tell React to re-render that square whenever its button is clicked
      style = 
        {{color: 'white',
          backgroundColor: 'black',
          borderColor: 'white',
          fontSize: 50,
          width: 100,
          height: 100,
          padding: 25}} //prevents box from moving down
      >
      {props.value} 
    </button> //^props.value allows either X or O to be displayed
  );
}

class Board extends React.Component { //this component renders 9 squares
  //has no constructor because wwe do not need to initialize state for Board

  renderSquare(i) { //renderSquare is a method
    return ( <Square //FUNCTIONS MUST RETURN REACT ELEMENTS
      value = {this.props.squares[i]} //value is set to X or O
      onClick = {() => this.props.onClick(i)} //onClick is a second prop of Square
      />
    );
  }

  generateSquares = () => {

    let tictactoeBoard = []
    for(let i = 0; i < 3; i++){
      let children = []
      for (let j = 0; j < 3; j++){
        children.push(this.renderSquare(i*3+j))
      }  
      tictactoeBoard.push(<div>{children}</div>)
    }
    return tictactoeBoard
  } 

  render() { 
    return (
      <div> 
        {this.generateSquares()}
      </div>
    );
  }
}

class Game extends React.Component { //this component renders a board
  
  constructor(props) { //called when your component is being reated and before mounting (being added to the DOm)
    super(props);
    this.state = { //initializing state for the Game component within its constructor
      //state is used for everything that may change during the course of the game
      history: [{ //a 2D array containing all the past moves
        squares: Array(9).fill(null), //null means no one has clicked it yet
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) { //i refers to the number of the square
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]; //gives current board
    const squares = current.squares.slice(); //slice function creates a copy of the squares array
    
    if (calculateWinner(squares) || squares[i]) { //if there is a winner, or if square has already been clicked
      return; //returns early 
    }

    squares[i] = this.state.xIsNext ? 'X': 'O'; //if true: squares[i] = X
    this.setState({ //setState function is used only when a square is clicked or when we go back in time
      history: history.concat([{ //concat method adds new array to history
        squares: squares, //updates information for squares
     }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, //NOTE: this line is still inside this.setState!!
    });
  }

  jumpTo(step) { //step is the move number (an int)
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, //triple equal sign avoids type coercion
    });
  }
  
  render() {  //this is called at the beginning, and when setState() is called
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //map() method creates a new array with the results of calling a function for every array element
    //holds key-value pairs and remembers the original insertion order
    const moves = history.map((step, move) => { //this unnamed function takes two parameters

      const desc = move ? //desc = description
        'Go to: Move #' + move : //if exists
        'Start New Game'; //if false or null
      return ( //returns a list of buttons that allows you to go back in time
        <li key = {move} > 
          <button onClick = {() => this.jumpTo(move)} 
            style = {{
              fontFamily: "Red Rose", 
              fontSize: 16, 
              margin: 3, 
              color: 'white',
              backgroundColor: 'black',
              borderColor: 'white'}}
            > 
            {desc} 
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game" style = {{overflow: 'hidden' }}> 
        <div 
          className = "title"
          style = {{
            fontSize: 50, 
            fontFamily: "Red Rose", 
            flex: 1, 
            textAlign: 'center', 
            color: 'white'}}
          >
          <div>{'Welcome to Tic-Tac-Toe!'}</div>

        </div >
          <div 
            className="game-board" 
            style = {{
              flexDirection: 'row', 
              flex: 1, textAlign: 
              'center'}}
            >
          <Board  //must pass in 2 props
            squares = {current.squares}
            onClick = {i => this.handleClick(i)}
            />

        </div>
        <div 
          className="game-info" 
          style = {{
            color: 'white', 
            padding: 10, 
            fontFamily: "Red Rose", 
            flex: 1, 
            textAlign: 'center', 
            listStyle: 'none'}}
            >
          <div>{status}</div>
          <div>{'------------------------'}</div>
          <li>{moves}</li> 
        </div>
      </div> //li for unordered list
    ); 
  }
}

function calculateWinner(squares) {
  const lines = [ //winning combinations 
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //will return 'X', 'O', or null
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
      return squares[a] //returns X or O, depending on who won
    }
  }
  return null; //no winner
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

export default Game;

//npm start to run