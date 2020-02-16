import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.canvas = React.createRef();
		this.board = [
			["", "", ""],
			["", "", ""],
			["", "", ""]
		];
		this.state = {
			computeCount: 0,
			startTime: 0,
			endTime: 0,
			totalTime: 0,
			settingsMenu: false,
			difficulty: 2,
			AI: false,
			winner: null,
			player: this.flipCoin(),
			playerMode: 0
		};
		this.scores = {
			X: 1,
			O: -1,
			Tie: 0
		};
		this.drawLoop = setInterval(this.updateAll, 20);
	}

	componentDidMount() {
		if (this.state.player === "X" && this.state.AI) {
			console.log("AI first");
			this.AIMove();
		}
	}

	updateAll = () => {
		if (!this.state.winner && this.state.AI && this.state.player === "X") {
			this.AIMove();
		}
		this.drawAll();
		this.setState({
			canvasSize: Math.min(
				document.documentElement.clientHeight * 0.8,
				document.documentElement.clientWidth * 0.8
			)
		});
	};

	flipCoin() {
		let flip = Math.round(Math.random());
		let player = null;
		if (flip === 0) {
			player = "X";
		} else if (flip === 1) {
			player = "O";
		}
		console.log(player);
		return player;
	}

	doMove = event => {
		const mouse = this.getMouse(event);
		if (!this.state.winner) {
			if (this.state.player === "O") {
				this.playerMove(mouse);
			}
			if (!this.state.AI && this.state.player === "X") {
				this.playerMove(mouse);
			}
		}
		else (
			this.handleReset()
		)
	};

	playerMove = mouse => {
		const square = this.checkSquare(mouse);
		console.log(square);
		if (this.board[square.i][square.j] === "") {
			this.board[square.i][square.j] = this.state.player;
			let winner = this.checkWinner(this.board);
			if (winner) {
				this.setState({ winner: winner });
			}

			if (this.state.player === "X") {
				this.setState({ player: "O" });
			} else if (this.state.player === "O") {
				this.setState({ player: "X" });
			}
		} else {
			console.log("Location Occupied!!!");
		}
	};

	AIMove = () => {
		console.clear();
		this.setState({ computeCount: 0, startTime: Date.now() })
		let bestScore = -Infinity;
		let move = null;
		let empty = true;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.board[i][j] !== "") {
					empty = false;
				}
			}
		}
		if (empty) {
			move = { i: 0, j: 0 };
		}
		if (!move) {
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (this.board[i][j] === "") {
						this.board[i][j] = "X";
						console.log(
							`depth: root, i: ${i}, j: ${j} ${this.board}`
						);
						this.setState({ 
							computeCount: this.state.computeCount + 1
						})
						let score = this.minimax(this.board, 0, false, -Infinity, Infinity);						this.board[i][j] = "";
						if (score > bestScore) {
							bestScore = score;
							move = { i, j };
						}
					}
				}
			}
		}

		
		this.board[move.i][move.j] = "X";
		let winner = this.checkWinner(this.board);
		if (winner) {
			this.setState({ winner: winner });
		}
		this.setState({ player: "O", endTime: Date.now() });
		this.setState({ totalTime: this.state.endTime - this.state.startTime });		
		console.log(
			`Move: {${move.i}, ${move.j}}, Compute Count: ${this.state.computeCount}, Total Time: ${this.state.totalTime}ms`
		);
	};

	minimax = (board, depth, maximisingPlayer, alpha , beta) => {
		if (depth > this.state.difficulty) {
			return 0;
		}
		let result = this.checkWinner(board);
		if (result !== null) {
			return this.scores[result];
		}
		if (maximisingPlayer) {
			let bestScore = -Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j] === "") {
						board[i][j] = "X";
						console.log(
							`depth: ${depth}, i: ${i}, j: ${j} ${board}`
						);
						this.setState({
							computeCount: this.state.computeCount + 1
						});
						let score = this.minimax(board, depth + 1, false, alpha, beta);						alpha = Math.max(alpha, score)
						board[i][j] = "";
						bestScore = Math.max(score, bestScore);						if ( alpha >= beta ) {
							break
						}						
						
					}
				}
			}
			return bestScore;
		} else {
			let bestScore = Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (board[i][j] === "") {
						board[i][j] = "O";
						console.log(
							`depth: ${depth}, i: ${i}, j: ${j} ${board}`
						);
						this.setState({
							computeCount: this.state.computeCount + 1
						});
						let score = this.minimax(board, depth + 1, true, alpha, beta);						beta = Math.min(beta, score)
						board[i][j] = "";
						bestScore = Math.min(score, bestScore);
						if (alpha >= beta) {
							break
						}
					}
				}
			}
			return bestScore;
		}
	};

	checkWinner = board => {
		// check col
		for (let i = 0; i < 3; i++) {
			if (board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
				if (board[i][0] === "X") {
					return "X";
				} else if (board[i][0] === "O") {
					return "O";
				}
			}
		}
		//check row
		for (let j = 0; j < 3; j++) {
			if (board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
				if (board[0][j] === "X") {
					return "X";
				} else if (board[0][j] === "O") {
					return "O";
				}
			}
		}
		//check diag one
		if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
			if (board[0][0] === "X") {
				return "X";
			} else if (board[0][0] === "O") {
				return "O";
			}
		}
		//check diag one
		if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
			if (board[0][0] === "X") {
				return "X";
			} else if (board[0][0] === "O") {
				return "O";
			}
		}
		//check diag two
		if (board[2][0] === board[1][1] && board[2][0] === board[0][2]) {
			if (board[2][0] === "X") {
				return "X";
			} else if (board[2][0] === "O") {
				return "O";
			}
		}
		//check tie
		let gameDone = true;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] === "") {
					gameDone = false;
				}
			}
		}

		if (gameDone) {
			return "Tie";
		}

		return null;
	};

	checkSquare = mousePosition => {
		const canvas = this.canvas.current;
		let pos = {
			i: null,
			j: null
		};
		//X grid
		if (mousePosition.x < canvas.width / 3) {
			pos.i = 0;
		} else if (mousePosition.x < canvas.width * (2 / 3)) {
			pos.i = 1;
		} else {
			pos.i = 2;
		}
		//Y grid
		if (mousePosition.y < canvas.height / 3) {
			pos.j = 0;
		} else if (mousePosition.y < canvas.height * (2 / 3)) {
			pos.j = 1;
		} else {
			pos.j = 2;
		}
		return pos;
	};

	getMouse = event => {
		let rect = this.canvas.current.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	};

	drawAll = () => {
		if (this.canvas) {
			const canvas = this.canvas.current;
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.drawBoard(canvas, ctx);
			this.drawPieces(canvas, ctx);
		} else {
			console.log("No Canvas");
		}
	};

	drawO = (canvas, ctx, i, j) => {
		let c = {
			x: canvas.width * (1 / 6 + (2 / 6) * i),
			y: canvas.height * (1 / 6 + (2 / 6) * j)
		};
		let smallLength = Math.min(canvas.width / 3, canvas.height / 3) / 3;
		ctx.beginPath();
		ctx.arc(c.x, c.y, smallLength, 0, 2 * Math.PI);
		ctx.stroke();
	};

	drawX = (canvas, ctx, i, j) => {
		let c = {
			x: canvas.width * (1 / 6 + (2 / 6) * i),
			y: canvas.height * (1 / 6 + (2 / 6) * j)
		};
		let smallLength = Math.min(canvas.width / 3, canvas.height / 3) / 3;
		ctx.beginPath();
		ctx.moveTo(c.x - smallLength, c.y - smallLength);
		ctx.lineTo(c.x + smallLength, c.y + smallLength);
		ctx.moveTo(c.x + smallLength, c.y - smallLength);
		ctx.lineTo(c.x - smallLength, c.y + smallLength);
		ctx.stroke();
	};

	drawBoard = (canvas, ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.moveTo((canvas.width * 1) / 3, 0);
		ctx.lineTo((canvas.width * 1) / 3, canvas.height);
		ctx.moveTo((canvas.width * 2) / 3, 0);
		ctx.lineTo((canvas.width * 2) / 3, canvas.height);
		ctx.moveTo(0, (canvas.height * 1) / 3);
		ctx.lineTo(canvas.width, (canvas.height * 1) / 3);
		ctx.moveTo(0, (canvas.height * 2) / 3);
		ctx.lineTo(canvas.width, (canvas.height * 2) / 3);
		ctx.stroke();
	};

	drawPieces = (canvas, ctx) => {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.board[i][j] === "X") {
					this.drawX(canvas, ctx, i, j);
				} else if (this.board[i][j] === "O") {
					this.drawO(canvas, ctx, i, j);
				}
			}
		}
	};

	ResetButton = () => {
		if (!this.state.settingsMenu) {
			if (this.state.winner) {
				return (
					<button className="reset-button" onClick={this.handleReset}>
						{"Reset"}
					</button>
				);
			} else {
				return null;
			}
		}
		else {
			return (
				<button className="reset-button" onClick={this.handleReset}>
					{"Reset"}
				</button>
			);
		}
		
	};

	handleReset = () => {
		this.board = [
			["", "", ""],
			["", "", ""],
			["", "", ""]
		];
		this.setState({ winner: null, player: this.flipCoin() });
	};

	DifficultySlider = () => {
		if (this.state.settingsMenu) {
			return (
				<div className="settings-container">
					<h1 className="setting-title">{"Difficulty"}</h1>
					<input
						type="range"
						className="slider"
						step="3"
						min="2"
						max="5"
						onChange={this.handleDifficulty}
						value={this.state.difficulty}
					></input>
				</div>
			);
		} else {
			return null;
		}
	};

	PlayerSlider = () => {
		if (this.state.settingsMenu) {
			return (
				<div className="settings-container">
					<h1 className="setting-title">{"PlayerMode"}</h1>
					<input
						type="range"
						className="slider"
						min="0"
						max="1"
						onChange={this.handlePlayer}
						value={this.state.playerMode}
					></input>
					<h1 className="setting-title">{this.state.AI ? "AI" : "Two Player"}</h1>
				</div>
			);
		} else {
			return null;
		}
	};

	handlePlayer = event => {
		this.setState({ playerMode: event.target.value });
		if (event.target.value === "1") {
			this.setState({ AI: true })
		} else if (event.target.value === "0") {
			this.setState({ AI: false });
		}
		
	};

	handleDifficulty = event => {
		this.setState({ difficulty: event.target.value });
	};

	Navbar = () => {
		return (
			<h1 className="navbar">
				{this.state.winner
					? `Winner: ${this.state.winner}`
					: `Player: ${this.state.player}`}
				<button
					className="settings-button"
					onClick={this.handleSettings}
				>
					{" "}
					{"Settings"}{" "}
				</button>
			</h1>
		);
	};

	handleSettings = () => {
		if (this.drawLoop) {
			clearInterval(this.drawLoop);
			this.drawLoop = null;
		} else {
			this.drawLoop = setInterval(this.updateAll, 20);
		}
		let settingsMenu = this.state.settingsMenu;
		this.setState({ settingsMenu: !settingsMenu });
	};

	MainPane = () => {
		if (this.state.settingsMenu) {
			return (
				<div className="settings-panel">
					<this.DifficultySlider />
					<this.PlayerSlider />
				</div>
			);
		} else {
			return (
				<canvas
					onClick={this.doMove}
					width={this.state.canvasSize}
					height={this.state.canvasSize}
					ref={this.canvas}
				/>
			);
		}
	};

	render() {
		return (
			<div className="App">
				<this.Navbar />
				<this.MainPane />
				<this.ResetButton />
			</div>
		);
	}
}

export default App;
