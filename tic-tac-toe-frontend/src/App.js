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
			player: null
		};
	}

	componentDidMount = () => {
		this.setState({ player: this.flipCoin() });
		this.drawLoop = setInterval(this.drawAll, 20);
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
		const square = this.checkSquare(mouse);
		console.log(square);
		if (this.board[square.i][square.j] === "") {
			this.board[square.i][square.j] = this.state.player;
			if (this.state.player === "X") {
				this.setState({ player: "O" });
			} else if (this.state.player === "O") {
				this.setState({ player: "X" });
			}
		} else {
			console.log("Location Occupied!!!");
		}
		console.log(this.board);
		
	};

	checkWinner = (board) => {
		
	}

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
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

	render() {
		return (
			<div className='App'>
				<canvas
					onClick={this.doMove}
					width='600'
					height='600'
					ref={this.canvas}
				/>
				<h1>{`Current Player: ${this.state.player}`}</h1>
			</div>
		);
	}
}

export default App;
