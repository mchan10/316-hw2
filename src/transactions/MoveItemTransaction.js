'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class MoveItemTransaction extends jsTPS_Transaction {
    constructor(movefn, id, newIndex) {
        super();
        this.movefn = movefn;
        this.id = id;
        this.newIndex = newIndex
    }

    doTransaction() {
        this.oldIndex = this.movefn(this.id, this.newIndex);
    }

    undoTransaction() {
        this.movefn(this.id, this.oldIndex);
    }
}