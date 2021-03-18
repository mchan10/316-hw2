// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS' // WE NEED THIS TOO
import UpdateItemTransaction from './transactions/UpdateItemTransaction'
import AddNewItemTransaction from './transactions/AddNewItemTransaction'
import MoveItemTransaction from './transactions/MoveItemTransaction';
import DeleteItemTransaction from './transactions/DeleteItemTransaction';

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
import Modal from './components/Modal'
{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}

class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };

    // SETUP OUR APP STATE
    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true,
      showModal: false
    }
  }

  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    });
  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1
    }, this.afterToDoListsChangeComplete);
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.highListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }

  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      description: "No Description",
      dueDate: "none",
      status: "incomplete"
    };
    return newToDoListItem;
  }

  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recent_work", toDoListsString);
  }

  doUpdateItemTransaction = (id, desc, date, stat) => {
    let newListItem = {
      description: desc,
      due_date: date,
      id: id,
      status: stat
    };
    let updatedList = this.state.currentList;
    let oldItem = updatedList.items.filter(listItem => listItem.id === id)[0];
    updatedList.items = updatedList.items.map(listItem => listItem.id === id ? newListItem : listItem);
    let updatedLists = this.state.toDoLists;
    updatedLists.shift();
    updatedLists.unshift(updatedList);
    this.setState({
      currentList: updatedList,
      toDoLists: updatedLists
    }, this.afterToDoListsChangeComplete);
    return oldItem;
  }

  updateTodoListItem = (id, desc, date, stat) => {
    let transaction = new UpdateItemTransaction(this.doUpdateItemTransaction, id, desc, date, stat);
    this.tps.addTransaction(transaction);
  }

  undoTransaction = () => {
    this.tps.undoTransaction();
  }

  redoTransaction = () => {
    this.tps.doTransaction();
  }

  addNewTodoItem = (id) => {
    let nextId = this.state.nextListItemId
    let newListItem;
    if (id === undefined){
      newListItem = {
        description: "No Description",
        due_date: "No Date",
        id: nextId,
        status: "incomplete"
      };
      id = nextId;
      nextId++;
    }
    else{
      newListItem = {
        description: "No Description",
        due_date: "No Date",
        id: id,
        status: "incomplete"
      };
    }
    let updatedList = this.state.currentList;
    updatedList.items.push(newListItem);
    let updatedLists = this.state.toDoLists;
    updatedLists.shift();
    updatedLists.unshift(updatedList);
    this.setState({
      currentList: updatedList,
      toDoLists: updatedLists,
      nextListItemId: nextId
    }, this.afterToDoListsChangeComplete);
    return id;
  }

  removeTodoItem = (id) => {
    let updatedList = this.state.currentList;
    updatedList.items = updatedList.items.filter(listItem => listItem.id !== id);
    let updatedLists = this.state.toDoLists;
    updatedLists.shift();
    updatedLists.unshift(updatedList);
    this.setState({
      currentList: updatedList,
      toDoLists: updatedLists
    }, this.afterToDoListsChangeComplete);
  }

  addNewTodoItemTrans = () => {
    let transaction = new AddNewItemTransaction(this.addNewTodoItem, this.removeTodoItem);
    this.tps.addTransaction(transaction);
  }
  
  moveTodoItem = (id, position) =>{
    let updatedList = this.state.currentList;
    let oldpos;
    for (let i = 0; i < updatedList.items.length; i++){
      if (updatedList.items[i].id === id){
        oldpos = i;
        break;
      }
    }
    let listItem = updatedList.items.splice(oldpos, 1);
    updatedList.items.splice(position, 0, listItem[0]);
    let updatedLists = this.state.toDoLists;
    updatedLists.shift();
    updatedLists.unshift(updatedList);
    this.setState({
      currentList: updatedList,
      toDoLists: updatedLists
    }, this.afterToDoListsChangeComplete);
    return oldpos;
  }

  moveTodoItemTrans = (id, offset) => {
    let updatedList = this.state.currentList;
    let index = 0;
    for (let i = 0; i < updatedList.items.length; i++){
      if (updatedList.items[i].id == id){
        index = i;
        break;
      }
    }
    index = index + offset;
    let transaction = new MoveItemTransaction(this.moveTodoItem, id, index);
    this.tps.addTransaction(transaction);
  }
  
  removeTodoItemRet = (id) =>{
    let updatedList = this.state.currentList;
    let position = 0;
    for (let i = 0; i < updatedList.items.length; i++){
      if (updatedList.items[i].id == id){
        position = i;
        break;
      }
    }
    let rmItem = updatedList.items.filter(listItem => listItem.id === id)[0];
    updatedList.items = updatedList.items.filter(listItem => listItem.id !== id);
    let updatedLists = this.state.toDoLists;
    updatedLists.shift();
    updatedLists.unshift(updatedList);
    this.setState({
      currentList: updatedList,
      toDoLists: updatedLists
    }, this.afterToDoListsChangeComplete);
    return [rmItem,position];
  }

  addTodoItemAtPos = (listItem, position) => {
    let updatedList = this.state.currentList;
    updatedList.items.splice(position, 0, listItem);
    let updatedLists = this.state.toDoLists;
    updatedLists.shift();
    updatedLists.unshift(updatedList);
    this.setState({
      currentList: updatedList,
      toDoLists: updatedLists
    }, this.afterToDoListsChangeComplete);
  }

  removeTodoItemTrans = (id) =>{
    let transaction = new DeleteItemTransaction(this.removeTodoItemRet, this.addTodoItemAtPos, id);
    this.tps.addTransaction(transaction);
  }

  deleteItemConfirmation = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  deleteCurrentList = () =>{
    let updatedList = this.state.currentList;
    updatedList = null;
    let updatedLists = this.state.toDoLists;
    updatedLists.shift();
    this.setState({
      currentList: updatedList,
      toDoLists: updatedLists,
      showModal: !this.state.showModal
    }, this.afterToDoListsChangeComplete);
  }

  closeCurrentList = () => {
    let updatedList = null;
    this.tps.clearAllTransactions();
    this.setState({
      currentList: updatedList
    }, this.afterToDoListsChangeComplete);
  }

  render() {
    let items = this.state.currentList === null ? [] : this.state.currentList.items;
    return (
      <div id="root">
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          undoTransactionCallback = {this.undoTransaction}
          redoTransactionCallback = {this.redoTransaction}
        />
        <Workspace 
          toDoListItems={items} 
          updateTodoListCallback={this.updateTodoListItem}
          addNewTodoItemCallback={this.addNewTodoItemTrans}
          moveTodoItemCallback={this.moveTodoItemTrans}
          deleteItemCallback={this.removeTodoItemTrans}
          showModalCallback={this.deleteItemConfirmation}
          closeCurrentListCallback={this.closeCurrentList}
        />
        {this.state.showModal?
        <Modal 
          showModalCallback={this.deleteItemConfirmation}
          deleteCurrentListCallback={this.deleteCurrentList}
        />:
        null}
      </div>
    );
  }
}

export default App;