// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ToDoItem from './ToDoItem'
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';

class Workspace extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let updateTodoListCallback = this.props.updateTodoListCallback
        let count = 0;
        return (
            <div id="workspace">
                <div id="todo-list-header-card">
                    <div id="task-col-header" className="header-text">Task</div>
                    <div id="date-col-header" className="header-text">Due Date</div>
                    <div id="status-col-header" className="header-text">Status</div>
                    {this.props.activeList ?
                        <div className="header-text header-button">
                            <AddBox id="add-item-button" className="list-item-control material-icons todo-button" onClick={this.props.addNewTodoItemCallback}/>
                            <Delete id="delete-list-button" className="list-item-control material-icons todo-button" onClick={this.props.showModalCallback}/>
                            <Close id="close-list-button" className="list-item-control material-icons todo-button" onClick={this.props.closeCurrentListCallback}/>
                        </div>:
                        <div className="header-text header-button">
                            <AddBox id="add-item-button" className="list-item-control material-icons disabled-button"/>
                            <Delete id="delete-list-button" className="list-item-control material-icons disabled-button"/>
                            <Close id="close-list-button" className="list-item-control material-icons disabled-button"/>
                        </div>
                    }
                </div>
                <div id="todo-list-items-div">
                    {
                        this.props.toDoListItems.map((toDoListItem) => (
                        <ToDoItem
                            key={toDoListItem.id}
                            toDoListItem={toDoListItem}     // PASS THE ITEM TO THE CHILDREN
                            updateTodoListCallback = {updateTodoListCallback}
                            moveTodoItemCallback = {this.props.moveTodoItemCallback}
                            deleteItemCallback={this.props.deleteItemCallback}
                            canUp={count !== 0}
                            canDown={count++ !== this.props.toDoListItems.length - 1}
                        />))
                    }
                </div>
                <br />
            </div>
        );
    }
}

export default Workspace;