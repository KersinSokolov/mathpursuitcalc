import React from 'react';
import './improved-chooser-strategy.css';
import { ChooserButton } from '../chooser-button/chooser-button';

export class ImprovedChooserStrategy extends React.Component {

    constructor(props) {
        super(props);
        this.checkState = this.checkState.bind(this);
    }

    checkState(e) {
        if ((typeof(this.props.onChange)!=='function')) return;
        let newState = this.props.strategyOptions || [];
        (e.value.isSelected) ? newState.push(e.number) : newState.splice(newState.indexOf(e.number), 1);
        this.props.onChange(newState);
    }

    render() {
        const opts = this.props.strategyOptions;
        const allButtons = this.props.availablenumbers.map(el => {
            return <ChooserButton 
                        key={el + this.props.prefix} 
                        keynumber={el} 
                        onChangeState={this.checkState} 
                        selectedNumber={opts ? opts.indexOf(el) : -1}
                        isDisabled={ (opts && opts.length===this.props.count)? !opts.includes(el): false}/>;
        });
        return(
            <div className="improved-chooser-strategy">
                {allButtons}
            </div>
        );
    }
}