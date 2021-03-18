'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItemTransaction extends jsTPS_Transaction {
    constructor(addfn,rmfn) {
        super();
        this.addfn = addfn;
        this.rmfn = rmfn;
    }

    doTransaction() {
        if (this.id === undefined){
            this.id = this.addfn();
        }
        else{
            this.addfn(this.id);
        }
    }

    undoTransaction() {
        this.rmfn(this.id);
    }
}