import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.canvas = React.createRef();
	}

	componentDidMount = () => {
		this.drawLoop = setInterval(this.drawAll, 20);
	}

	getMouse = (event) => {
		console.log("called")
		let rect = this.canvas.current.getBoundingClientRect();
		console.log(event.clientX - rect.left)
		console.log(event.clientY - rect.top);
	}

	drawAll = () => {
		if (this.canvas) {
			const canvas = this.canvas.current;
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.drawBoard(canvas, ctx);
		}
		else {
			console.log("No Canvas")
		}
	}

	drawBoard = (canvas, ctx) => {
		ctx.lineWidth = 10;
		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.moveTo(canvas.width * 1/3, 0);
		ctx.lineTo(canvas.width * 1/3, canvas.height);
		ctx.moveTo(canvas.width * 2/3, 0);
		ctx.lineTo(canvas.width * 2/3, canvas.height);
		ctx.moveTo(0, canvas.height * 1/3);
		ctx.lineTo(canvas.width, canvas.height * 1/3);
		ctx.moveTo(0, canvas.height * 2/3);
		ctx.lineTo(canvas.width, canvas.height * 2/3);
		ctx.stroke();
	}


	render() {
		return (
			<div className="App">
				<canvas onClick = {this.getMouse} width = "600" height = "600" ref = {this.canvas}/>
			</div>
		);
	}
  
}

export default App;
