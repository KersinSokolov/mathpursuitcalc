import React, { Component } from 'react';
import './App.css';
import { ControlPane } from './components/control-pane/control-pane';
import Player from './components/player/player';
import { PlayerObject } from './librares/player';
import { globalGeometryTypes } from './librares/geometrytypes';
import { CanvasWrapper } from './components/canvas-wrapper/canvas-wrapper';
import gerRenderPlayers from './librares/getRenderPlayers';
import getStrategyForPlayer from './librares/getStrategyForPlayer';
import { connect } from 'react-redux';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			renderObjects: [],
			tickNumber: 0
		}
		this.intervalIndex = false;
		this._playStopEventHandler = this._playStopEventHandler.bind(this);
		this._calculateFrame = this._calculateFrame.bind(this);
		this.saveGame = this.saveGame.bind(this);
		this.onLoadGame = this.onLoadGame.bind(this);
		this.onMultiplyTick = this.onMultiplyTick.bind(this);
		window.renderSettings = {
			settingsfeasibleset: 10,
			pursuersLinksEnabled: true
		};
	}

	_calculateFrame(){
		this.props.nextCoordAll();
		this.setState({
			tickNumber: this.state.tickNumber+1
		});
	}

	_playStopEventHandler(status){
		status ? (this.intervalIndex = setInterval(this._calculateFrame, 50)) : clearInterval(this.intervalIndex);
	}

	saveGame(){
		var data = JSON.stringify({
			players: this.props.players,
			params: {}
		});
		var filename = 'catch_game_'+new Date().toISOString().substring(0,9)+'.json'
		this._download(data, filename, 'application/json');
	}
	_download(data, filename, type) {
		var file = new Blob([data], {type: type});
		if (window.navigator.msSaveOrOpenBlob) // IE10+
			window.navigator.msSaveOrOpenBlob(file, filename);
		else {
			var url = URL.createObjectURL(file),
			a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(function() {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);  
			}, 0); 
		}
	}

	onLoadGame(object){
		if (!object){
			console.log('Upload Game Error');
			return;
		}
		if (object.players){
			const playersObjArray = object.players.map((p)=>{
				return new PlayerObject({
					isPursuer: p.isPursuer,
					position: globalGeometryTypes.Point(p.position.x, p.position.y),
					strategyName: p.strategyName,
					strategyOptions: p.strategyOptions
				})
			})
			this.props.setGame(playersObjArray);
		}
	}

	onMultiplyTick(number){
		clearInterval(this.intervalIndex);
		for (let i=0; i<number; i++){
			this.props.nextCoordAll();
		}
		this.setState({
			tickNumber: this.state.tickNumber+number
		});
	}

	render() {
		let playersComponents = this.props.players.map((player, index) => (
			<Player
				strategies={ getStrategyForPlayer(index, this.props.players) }
				index={ index }
				key={ 'player-' + index }
			/>
		));

		return (
			<div>
				<ControlPane 
					onPlayStop={this._playStopEventHandler} 
					time={ this.state.tickNumber }
					onAddPlayer={ this.props.addPlayer } 
					onSaveGame={this.saveGame}
					onLoadGame={this.onLoadGame}
					onMultiplyTick={this.onMultiplyTick} />
				<CanvasWrapper	options={{height: '600px', width: '600px'}} objectsForRender={ gerRenderPlayers(this.props.players) } />
				{playersComponents}
				
			</div>
		);
	}
}

function mapDispatchToProps(dispatch, ownProps){
	return {
		'addPlayer':(playerType)=>{
			dispatch({ type: 'ADD_PLAYER', playerType })
		},
		'nextCoordAll':(positions)=>{
            dispatch({ type: 'NEXT_COORDINATES_ALLPLAYERS', positions})
		},
		'setGame': (players)=>{
			dispatch({ type: 'SET_PLAYERS', players});
		}
	};
}

export default connect(
	(state)=>state,
	mapDispatchToProps
)(App);