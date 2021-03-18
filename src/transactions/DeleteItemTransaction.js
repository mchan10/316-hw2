'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DeleteItemTransaction extends jsTPS_Transaction {
    constructor(rmfn, addfn, id) {
        super();
        this.rmfn = rmfn;
        this.id = id;
        this.addfn = addfn;
    }

    doTransaction() {
        let data = this.rmfn(this.id);
        this.listItem = data[0];
        this.position = data[1];
    }

    undoTransaction() {
        this.addfn(this.listItem, this.position);
    }
}