import React from 'react';
import './manual-chooser-strategy.css';
import { DirectionCanvasChooser } from '../direction-canvas-chooser/direction-canvas-chooser';

export class ManualChooserStrategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dir: this.props.dir,
            step: this.props.step || 1
        };
        this.onChangeByControl = this.onChangeByControl.bind(this);
    }

    onChangeByControl(newDir, newStep) {
        this.setState({
            dir: isNaN(newDir) ? this.state.dir : newDir,
            step: isNaN(newStep) ? this.state.step : Math.min(newStep, 1)
        }, ()=>{
            if (typeof(this.props.onChange)==='function'){
                this.props.onChange({angle: this.state.dir, step: this.state.step});
            }
        });
    }

    render() {
        return <div className="manual-chooser-strategy">
            <input type="number" value={this.state.dir} step={1} onChange={(e)=>{
                this.onChangeByControl(e.target.value);
            }}/>
            <input type="number" value={this.state.step} step={0.1} max={1} onChange={(e)=>{
                this.onChangeByControl(undefined, e.target.value);
            }}/>
            <DirectionCanvasChooser value={this.state.dir} step={this.state.step} onChange={this.onChangeByControl}/>
        </div>
    }
}