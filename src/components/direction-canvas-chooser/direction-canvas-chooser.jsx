import React from 'react';
import './direction-canvas-chooser.css';

export class DirectionCanvasChooser extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            dir: this.props.value,
            step: this.props.step
        };
        this.staticProperties = {
            width: 180,
            height: 180,
            maxRange: 70,
            centerPoint: 90
        };
    }

    componentWillReceiveProps(e){ // TODO: should be componentDidUpdate ??
        this.setState({
            dir: parseFloat(e.value).toFixed(),
            step: e.step
        }, ()=>{
            const ctx = this.refs.canvas.getContext('2d'),
            angPI = this.state.dir*Math.PI/180,
            length = this.state.step*this.staticProperties.maxRange,
            x = Math.cos(angPI)*length+this.staticProperties.centerPoint,
            y = Math.sin(angPI)*length+this.staticProperties.centerPoint;
            ctx.clearRect(0, 0, 180, 180);
            ctx.beginPath();
            ctx.moveTo(this.staticProperties.centerPoint, this.staticProperties.centerPoint);
            ctx.lineTo(x , y);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#855';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x ,y,4,0,2*Math.PI);
            ctx.fill();
        });
    }

    componentDidMount() {
        const canvas = this.refs.canvas;
        canvas.addEventListener('mouseout', () => {
            canvas.removeEventListener('mousemove', onMove);
        });
        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', onMove);
        });
        canvas.addEventListener('mousedown', (e) => {
            onMove(e);
            canvas.addEventListener('mousemove', onMove);
        });
        let that = this;
        function onMove(e){
            const dX = e.offsetX - that.staticProperties.centerPoint,
                  dY = e.offsetY - that.staticProperties.centerPoint,
                  r = Math.sqrt(dX*dX+dY*dY);
            let ang = Math.acos(dX/r)*180/Math.PI;
            const step =Math.min(r/ that.staticProperties.maxRange , 1);
            (dY<0) && (ang=360-ang);
            that.setState({
                dir: ang,
                step: step
            }, ()=>{
                if (typeof(that.props.onChange)==='function'){
                    that.props.onChange(that.state.dir.toFixed(2), step.toFixed(2));
                }
            });
        }
    }

    render() {
        return <canvas ref="canvas" width={180} height={180}></canvas>;
    }
}