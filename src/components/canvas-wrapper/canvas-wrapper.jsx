import React from 'react';
import PropTypes from 'prop-types';
import './canvas-wrapper.css';

export class CanvasWrapper extends React.Component {

	renderMathOptions = {
		offsetX: 0,
		offsetY: 0,
		scale: 1
	}
	_canvasRender() {
		const canvas = this.refs.canvas,
			  ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (!this.props.objectsForRender) return;
		if (this.props.objectsForRender.length) {
			var pointsArr = this.props.objectsForRender.filter(function (e) {
				return (e.geometry.type === 'point');
			});
			this.renderMathOptions = this._detectScaleAndOffset(pointsArr);
			for (var i = 0; i < this.props.objectsForRender.length; i++) {
				this._renderGeometry(this.props.objectsForRender[i]);
			}
			this._renderGeometry({geometry:{type: 'scale'}, options:{color: '#090'}});
		}
	}
	_detectScaleAndOffset(objs) {
		const canvas = this.refs.canvas;
		let minx = objs[0].geometry.x, miny = objs[0].geometry.y,
			maxx = objs[0].geometry.x, maxy = objs[0].geometry.y;
		for (let i = 1; i < objs.length; i++) {
			minx = Math.min(minx, objs[i].geometry.x);
			miny = Math.min(miny, objs[i].geometry.y);
			maxx = Math.max(maxx, objs[i].geometry.x);
			maxy = Math.max(maxy, objs[i].geometry.y);
		}
		(maxx === minx) && (maxx += 1);
		(miny === maxy) && (maxy += 1);

		let scale = Math.min(canvas.width / (Math.abs(maxx - minx) + 100), canvas.height / (100 + Math.abs(maxy - miny))),
			offsetX = -minx * scale + 50,
			offsetY = -miny * scale + 50;
		return { scale, offsetX, offsetY };
	}
	defaultRenderSettings = {
		pointRadius: 3,
		pointColor: '#000',
		lineWidth: 2,
		lineColor: '#000',
		textColor: '#000',
		circleColor: 'rgba(255, 0, 0, 0.5)'
	}
	_renderGeometry(o) {
		if (!o || !o.geometry) return;
		const ctx = this.refs.canvas.getContext('2d');
		o.options = o.options || {};
		ctx.beginPath();
		switch(o.geometry.type){
			case 'point':{
				ctx.strokeStyle = o.options.color || this.defaultRenderSettings.pointColor;
				ctx.fillStyle = o.options.color || this.defaultRenderSettings.pointColor;
				let radius = o.options.radius || this.defaultRenderSettings.pointRadius;
				ctx.arc(o.geometry.x * this.renderMathOptions.scale + this.renderMathOptions.offsetX, 
						o.geometry.y * this.renderMathOptions.scale + this.renderMathOptions.offsetY, 
						radius, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.fill();
				break;
			}
			case 'line':{
				ctx.moveTo(o.geometry.p1.x * this.renderMathOptions.scale + this.renderMathOptions.offsetX, 
						   o.geometry.p1.y * this.renderMathOptions.scale + this.renderMathOptions.offsetY);
				ctx.lineTo(o.geometry.p2.x * this.renderMathOptions.scale + this.renderMathOptions.offsetX, 
						   o.geometry.p2.y * this.renderMathOptions.scale + this.renderMathOptions.offsetY);
				ctx.lineWidth = o.options.width || this.defaultRenderSettings.lineWidth;
				ctx.strokeStyle = o.options.color || this.defaultRenderSettings.lineColor;
				ctx.stroke();
				break;
			}
			case 'text':{
				ctx.fillStyle = o.options.color || this.defaultRenderSettings.textColor;
				ctx.textAlign = 'center';
				ctx.font = '16px Arial';
				ctx.textBaseline = 'bottom';
				ctx.fillText(o.geometry.text, o.geometry.x * this.renderMathOptions.scale + this.renderMathOptions.offsetX, 
						     o.geometry.y * this.renderMathOptions.scale + this.renderMathOptions.offsetY-3);
				break;
			}
			case 'scale':{
				ctx.fillStyle = o.options.color || this.defaultRenderSettings.textColor;
				ctx.textAlign = 'left';
				ctx.font = '9px monospace';
				ctx.textBaseline = 'bottom';
				ctx.fillText('X:'+(-this.renderMathOptions.offsetX).toFixed(2), 1, 10);
				ctx.fillText('Y:'+(-this.renderMathOptions.offsetY).toFixed(2), 1, 19);
				const w = ctx.canvas.width;
				const h = ctx.canvas.height;
				const xLabel = ((w-this.renderMathOptions.offsetX)/this.renderMathOptions.scale).toFixed(2)+':X';
				const yLabel = ((h-this.renderMathOptions.offsetY)/this.renderMathOptions.scale).toFixed(2)+':Y';
				const ofX = ctx.measureText(xLabel).width;
				const ofY = ctx.measureText(yLabel).width;
				ctx.fillText(xLabel, w-ofX-1, h-9);
				ctx.fillText(yLabel, w-ofY-1, h);
				break;
			}
			case 'circle':{
				if (!o.geometry.radius) return;
				ctx.fillStyle = o.options.color || this.defaultRenderSettings.circleColor;
				ctx.arc(o.geometry.x * this.renderMathOptions.scale + this.renderMathOptions.offsetX, 
						o.geometry.y * this.renderMathOptions.scale + this.renderMathOptions.offsetY, 
						o.geometry.radius * this.renderMathOptions.scale, 0, 2 * Math.PI);
				ctx.fill();
				break;
			}
			default:{}
		}
		ctx.closePath();
	}

	componentDidMount() {
		this._canvasRender();
		const canvas = this.refs.canvas;
		canvas.getPositionForPlayerAfterClick = (clbk)=>{
			let clickhandler = (event)=>{
				const point = {
					x: (event.offsetX - this.renderMathOptions.offsetX) / this.renderMathOptions.scale,
					y: (event.offsetY - this.renderMathOptions.offsetY) / this.renderMathOptions.scale
				};
				clbk(point);
				canvas.removeEventListener('click', clickhandler);
			}
			canvas.addEventListener('click', clickhandler);

		}
	}

	componentDidUpdate(o) {
		this._canvasRender();
	}
	
	render() {
		return (
			<canvas className="gameField" id="maincanvas" ref="canvas"
				width={this.props.options.width || '200px'}
				height={this.props.options.height || '200px'}
			/>
		);
	}
}

CanvasWrapper.propTypes = {
	options: PropTypes.shape({
		width: PropTypes.string,
		height: PropTypes.string
	})
};
