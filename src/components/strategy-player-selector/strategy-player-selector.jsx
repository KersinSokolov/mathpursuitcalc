import React from 'react';
import './strategy-player-selector.css';
import { ManualChooserStrategy } from '../manual-chooser-strategy/manual-chooser-strategy';
import { ImprovedChooserStrategy } from '../improved-chooser-strategy/improved-chooser-strategy';
import { connect } from 'react-redux';
import { dictStrategies } from '../../models';

class StrategyPlayerSelector extends React.Component {
    constructor(props){
        super(props);

        this.changeStrategy = this.changeStrategy.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    changeStrategy(e){
        this.props.changeStrategy({index: this.props.index, strategyName:e.target.value, strategyOptions: undefined });
    }

    _onChange(obj){
        this.props.changeStrategy({index: this.props.index, strategyName:this.props.strategyName, strategyOptions:obj });
    }

    render(){
        let options = [];
        for(let i=0; i< this.props.options.length; i++){
            options.push(<option key={i} value={this.props.options[i].name}>{this.props.options[i].name}</option>);
        }
        let strategyChooser = null;
        if (this.props.strategyName===dictStrategies.manual){
            strategyChooser = <ManualChooserStrategy dir={45} onChange={this._onChange}/>;
        }else{
            let selectedStrategyOptions, keyValue;
            for (let key in this.props.options){
                if (this.props.options[key].name === this.props.strategyName){
                    selectedStrategyOptions = this.props.options[key];
                    keyValue = key;
                }
            }
            let availableArr = selectedStrategyOptions.value.availablenumbers;
            let count = selectedStrategyOptions.value.count;
            strategyChooser = <ImprovedChooserStrategy availablenumbers={availableArr} strategyOptions={this.props.strategyOptions} count={count} key={keyValue} prefix={this.props.index+' '+keyValue} onChange={this._onChange}/>;
        }
        return <div className="player-strategy">
                    <select value={this.props.strategyName} onChange={this.changeStrategy}>
                        {options}
                    </select>
                    {strategyChooser}
                </div>
    }
}

function mapDispatchToProps(dispatch, ownProps){
	return {
        'changeStrategy':(arg)=>{
            dispatch({ type: 'CHANGE_STRATEGY_PLAYER', ...arg})
        }
	};
}

export default connect(
	(state, ownProps) => {return {strategyName: state.players[ownProps.index].strategyName, strategyOptions: state.players[ownProps.index].strategyOptions}},
	mapDispatchToProps
)(StrategyPlayerSelector);