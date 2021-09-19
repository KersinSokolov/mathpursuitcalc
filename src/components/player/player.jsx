import React from 'react';
import './player.css';
import StrategyPlayerSelector from '../strategy-player-selector/strategy-player-selector';
import { connect } from 'react-redux';
import { dictStrategies } from '../../models';

class Player extends React.Component {
    /* PROPS:
        strategies: {name: str, availablenumbers: arrOfInt, count: Int}//see StrategyPlayerSelector
        index: Int
    */
    constructor(props) {
        super(props);
        this.state = {
            selectedStrategy: {type: dictStrategies.manual, options: {angle: 33, step:1}}
        };
        this._onChangeX = this._onChangeX.bind(this);
        this._onChangeY = this._onChangeY.bind(this);
        this._onRequestToGetCoords = this._onRequestToGetCoords.bind(this);
    }

    _onChangeX(s){
        this.props.changeCoord({index: this.props.index, x:parseFloat(s.target.value)});
    }

    _onChangeY(s){
        this.props.changeCoord({index: this.props.index, y:parseFloat(s.target.value)});
    }
    _onRequestToGetCoords(s){
        let btn = s.target;
        btn.classList.add('awaiting-btn');
        document.getElementById('maincanvas').getPositionForPlayerAfterClick((e)=>{
            this.props.changeCoord({index: this.props.index, x:parseFloat(e.x), y:parseFloat(e.y)});
            btn.classList.remove('awaiting-btn');
        });
    }

    render() {
        return <div className={`player ${this.props.current.isPursuer?'pursuer':'evader'}`}>
            <div className="player-coords">
                <input type="number" value={this.props.current.position.x} onChange={this._onChangeX} />
                <input type="number" value={this.props.current.position.y} onChange={this._onChangeY} />
                <input type="button" defaultValue="X" onClick={ ()=> this.props.removePlayer(this.props.index)} />
            </div>
            <input type="button" defaultValue={'Игрок #'+this.props.index} className="player-button-coordinates" onClick={this._onRequestToGetCoords} />
            <StrategyPlayerSelector options={this.props.strategies} index={this.props.index}/>
        </div>
    }
}

function mapDispatchToProps(dispatch, ownProps){
	return {
		'removePlayer':(index)=>{
			dispatch({ type: 'REMOVE_PLAYER', index})
        },
        'changeCoord':(arg)=>{
            dispatch({ type: 'CHANGE_COORDINATES_PLAYER', ...arg})
        }
	};
}

export default connect(
	(state, ownProps) => {return {current: state.players[ownProps.index]}},
	mapDispatchToProps
)(Player);