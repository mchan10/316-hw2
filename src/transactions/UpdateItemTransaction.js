'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class UpdateItemTransaction extends jsTPS_Transaction {
    constructor(fn, id, newDesc, newDate, newStatus) {
        super();
        this.fn = fn;
        this.id = id;
        this.newDesc = newDesc;
        this.newDate = newDate;
        this.newStatus = newStatus;
    }

    doTransaction() {
        let oldItem = this.fn(this.id, this.newDesc, this.newDate, this.newStatus);
    }

    undoTransaction() {
        
    }
}