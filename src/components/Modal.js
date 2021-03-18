import React, { Component } from 'react';
import Close from '@material-ui/icons/Close';

class Modal extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="modal-overlay">    
                    <div id="confirm-deletion" class="modal">
                        <div id="modal-text"><h1>Delete List?</h1></div>
                        <Close id="confirm-delete-exit" class="list-item-control material-icons todo-button" onClick={this.props.showModalCallback}/>
                        <div id="confirm-delete-cancel" class="todo-button" onClick={this.props.showModalCallback}>Cancel</div>
                        <div id="confirm-delete-confirm" class="todo-button" onClick={this.props.deleteCurrentListCallback}>Confirm</div>
                    </div>
            </div>
        )
    }
}

export default Modal;