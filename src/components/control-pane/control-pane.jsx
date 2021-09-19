import React from 'react';

import { playerType } from '../../models';
import './control-pane.css';

export class ControlPane extends React.Component {
	constructor(props){
		super(props);
		this.state={
			isRunned: false,
			isOpenedSettingsDialog: false,
			isOpenedInstruction: false
		};
		this.onChangePlayingState = this.onChangePlayingState.bind(this);
		this.handleAddPlayer = this.handleAddPlayer.bind(this);
		this.saveGame = this.saveGame.bind(this);
		this.loadGame = this.loadGame.bind(this);
		this.multiplyTick = this.multiplyTick.bind(this);
	}

	onChangePlayingState(e){
		this.setState({isRunned: !this.state.isRunned}, ()=>{
			if (typeof(this.props.onPlayStop) === 'function' ){
				this.props.onPlayStop(this.state.isRunned);
			}
		});
	}

	saveGame(){
		if (typeof(this.props.onSaveGame) === 'function'){
			this.props.onSaveGame();
		}
	}
	
	loadGame(evt){
		let files = evt.target.files;
		let file = files[0];           
		let reader = new FileReader();
		reader.readAsText(file);
		reader.onloadend = ()=>{
			const t = reader.result;
			let p;
			try{
				p = JSON.parse(t);
			}catch(e){
				console.log(e);
			}finally{
				if (typeof(this.props.onLoadGame)==='function'){
					this.props.onLoadGame(p);
				}
			}
		}
	}

	multiplyTick(number){
		this.setState({
			isRunned: false
		},()=>{
			if (typeof(this.props.onMultiplyTick)==='function'){
				this.props.onMultiplyTick(number);
			}
		})
		
	}

	render() {
		return (
			<div className="buttonswrapper">
				<label className="timelabel">{ "Время: " + this.props.time }</label>
				<input type="button" value={ this.state.isRunned ? "Пауза" : "Старт"} onClick={this.onChangePlayingState} />
				<input type="button" onClick={()=>this.multiplyTick(1)} defaultValue="+1 Тик" />
				<input type="button" onClick={()=>this.multiplyTick(10)} defaultValue="+10 Тиков" />
				<input type="button" onClick={()=>this.multiplyTick(50)} defaultValue="+50 Тиков" />
				<input type="button" role={ playerType.pursuer } value={"+ Преследователь"} onClick={ this.handleAddPlayer } />
				<input type="button" role={ playerType.evader } value={"+ Убегающий"} onClick={this.handleAddPlayer} />
				<input onClick={()=>this.setState({isOpenedInstruction: true})} className="instructionbtn" type="button" defaultValue="Инструкция"/>
				<input type="button" defaultValue="Настройки" onClick={()=>{this.setState({isOpenedSettingsDialog:!this.state.isOpenedSettingsDialog})}} />
				{this.state.isOpenedSettingsDialog && 
				<div className="settingsdialog">
					<div>Глобальные настройки<input type="button" className="closebtn" defaultValue="X" onClick={()=>this.setState({isOpenedSettingsDialog:false})} /></div>
					<input className="savebtn" type="button" defaultValue="Сохранить" onClick={this.saveGame} />
					<div className="loadbtn"><label>Загрузить</label><input type="file" id="fileload" defaultValue="Load" onChange={this.loadGame} /></div>
					<div>
						<input type="checkbox" id="settingslinkedpursuers" checked={window.renderSettings.pursuersLinksEnabled} onChange={(e)=>{
							window.renderSettings.pursuersLinksEnabled = e.target.checked;
							this.multiplyTick(0); //for refresh
						}} />
						<label htmlFor="settingslinkedpursuers">Отображать отрезки между преследователями</label>
					</div>
					<div>
						<input type="text" className="settingsfeasiblesetinput" defaultValue={window.renderSettings.settingsfeasibleset} onChange={(e)=>{
							window.renderSettings.settingsfeasibleset = parseInt(e.target.value,10);
							this.multiplyTick(0); //for refresh
						}} />
						<label>Область достижимости (0 - выключено)</label>
					</div>
				</div>}
				{this.state.isOpenedInstruction &&
					<div className="instructionbck">
						<input className="clsoeinstructionbtn" type="button" onClick={()=>this.setState({isOpenedInstruction: false})} defaultValue="Закрыть"/>
						<img src={require('../instructionsimages/1.png')} alt="" /><hr/>
						<img src={require('../instructionsimages/2.png')} alt="" /><hr/>
						<img src={require('../instructionsimages/3.png')} alt="" /><hr/>
						<img src={require('../instructionsimages/4.png')} alt="" /><hr/>
						<img src={require('../instructionsimages/5.png')} alt="" /><hr/>
						<img src={require('../instructionsimages/6.png')} alt="" /><hr/>
						<img src={require('../instructionsimages/7.png')} alt="" /><hr/>
						<img src={require('../instructionsimages/8.png')} alt="" />
					</div>
				}
			</div>
		);
	}

	handleAddPlayer(event) {
		this.props.onAddPlayer(event.target.getAttribute('role') === playerType.pursuer);
	}
}
