var HttpCorl = require("./netCorl/HttpCorl")
var GlobalManager = require("GlobalManager")
var DataManager = cc.Class({



    ctor() {
        this.httpCorl = new HttpCorl();
        this.GlobalManager = new GlobalManager();
        this.httpCorl.constructInit(this);
        this.GlobalManager.constructInit(this);
    },

    // onLoad() {
    //     this.httpC = new Httpcorl;


    // },




});

module.exports = DataManager;
