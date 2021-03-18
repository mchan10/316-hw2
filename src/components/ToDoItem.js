// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");
        this.state = {
            inputOpenName: false ,
            inputOpenDate: false ,
            inputOpenStatus: false
        }
    }
    
    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
    }

    inputName = () => {
        this.setState({
            inputOpenName: true
        });
    }

    inputDate = () => {
        this.setState({
            inputOpenDate: true
        });
    }

    inputStatus = () => {
        this.setState({
            inputOpenStatus: true
        });
    }

    updateName = (event) => {
        let newName = event.target.value;
        let listItem = this.props.toDoListItem;
        this.props.updateTodoListCallback(listItem.id, newName, listItem.due_date, listItem.status);
        this.setState({
            inputOpenName: false
        });
    }

    updateDate = (event) => {
        let newDate = event.target.value;
        let listItem = this.props.toDoListItem;
        this.props.updateTodoListCallback(listItem.id, listItem.description, newDate, listItem.status);
        this.setState({
            inputOpenDate: false
        });
    }

    updateStatus = (event) => {
        let newStatus;
        if (event.target.value === '1'){
            newStatus = "complete"
        }
        else{
            newStatus = "incomplete"
        }
        let listItem = this.props.toDoListItem;
        this.props.updateTodoListCallback(listItem.id, listItem.description, listItem.due_date, newStatus);
        this.setState({
            inputOpenStatus: false
        });
    }

    moveItemUp = () => {
        let listItem = this.props.toDoListItem;
        this.props.moveTodoItemCallback(listItem.id, -1);
    }

    moveItemDown = () => {
        let listItem = this.props.toDoListItem;
        this.props.moveTodoItemCallback(listItem.id, 1);
    }

    deleteItem = () => {
        let listItem = this.props.toDoListItem;
        this.props.deleteItemCallback(listItem.id);
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem render");
        let listItem = this.props.toDoListItem;
        let statusType = "status-complete";
        if (listItem.status === "incomplete")
            statusType = "status-incomplete";
        return (
            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>
                <div className='item-col'>
                    {this.state.inputOpenName?
                        <input className='input-col' type='text' autoFocus
                        defaultValue={listItem.description} onBlur={this.updateName}></input> :
                        <div className='task-col itemunedited' onClick={this.inputName}>{listItem.description}</div>
                    }
                </div>
                <div className='item-col'>
                    {this.state.inputOpenDate?
                        <input className='input-col' type='date' autoFocus
                        defaultValue={listItem.due_date} onBlur={this.updateDate}></input> :
                        <div className='due-date-col itemunedited' onClick={this.inputDate}>{listItem.due_date}</div>
                    }       
                </div> 
                <div className='item-col test-4-col'>
                    {this.state.inputOpenStatus?
                        <select class='input-col' autoFocus onBlur={this.updateStatus}>
                            <option value='' style={{display: "none"}}> {listItem.status} </option>
                            <option value='1'> complete </option> 
                            <option value='2'> incomplete </option>
                        </select>:
                        <div className={'status-col itemunedited ' + statusType} onClick={this.inputStatus}>{listItem.status}</div>
                    }
                </div>
                <div className='item-col list-controls-col itemunedited'>
                    {this.props.canUp ?
                        <KeyboardArrowUp className='list-item-control todo-button' onClick={this.moveItemUp}/>:
                        <KeyboardArrowUp className='list-item-control disabled-button'/>
                    }
                    {this.props.canDown ?
                        <KeyboardArrowDown className='list-item-control todo-button' onClick={this.moveItemDown}/>:
                        <KeyboardArrowDown className='list-item-control disabled-button'/>
                    }
                    <Close className='list-item-control todo-button' onClick={this.deleteItem}/>
                    <div className='list-item-control'></div>
        <div className='list-item-control'></div>
                </div>
            </div>
        )
    }
}

export default ToDoItem;