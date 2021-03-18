// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'

class ListLink extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " constructor");
        this.state={
            inputNameChange:false
        }
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " did mount");
    }

    handleLoadList = () => {
        this.props.loadToDoListCallback(this.props.toDoList);
    }

    handleNameChange = (event) =>{
        let name = event.target.value;
        this.props.changeListNameCallback(name);
        this.setState({
            inputNameChange:false
        })
    }

    toggleNameChange = () => {
        this.setState({
            inputNameChange:true
        })
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink render");
        let first = this.props.first;
        return (
            <div>
                {this.props.first ?
                    this.state.inputNameChange ?
                        <input type='text' className='todo-list-button' autoFocus onBlur={this.handleNameChange} defaultValue={this.props.toDoList.name}>
                        </input>:
                        <div 
                            className='todo-list-button firstList'
                            onDoubleClick={this.toggleNameChange}
                        >
                            {this.props.toDoList.name}
                        </div>
                    :
                    <div 
                        className='todo-list-button'
                        onClick={this.handleLoadList}
                    >
                        {this.props.toDoList.name}
                    </div>
                }
            </div>
        )
    }
}

export default ListLink;