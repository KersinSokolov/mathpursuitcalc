import React from 'react';
import './chooser-button.css';

export class ChooserButton extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            isSelected: (this.props.selectedNumber > -1)
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(){
        this.setState({
            isSelected: !this.state.isSelected
        }, ()=>{
            if (typeof(this.props.onChangeState)==='function'){
                this.props.onChangeState({
                    number: this.props.keynumber,
                    value: this.state
                });
            }
        });
    }

    render(){
        return <div className="chooser-button-wrapper">
            <input
                type="button" 
                onClick={this.clickHandler} 
                className={"chooser-button"+(this.props.selectedNumber > -1?' selected':'')} 
                disabled={this.props.isDisabled}
                defaultValue={this.props.keynumber} 
            />
            {(this.props.selectedNumber > -1) && <div className="chooser-button-hint">{this.props.selectedNumber+1}</div> }
        </div>
    }
}