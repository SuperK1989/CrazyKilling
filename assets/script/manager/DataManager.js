var HttpCorl = require("./netCorl/HttpCorl")
var GlobalManager = require("GlobalManager")
var DataManager = cc.Class({

    properties: {
        playerInfo: {
            default: null,
        },

        userName: null,
        passWord: null,
        token: null,
    },


    ctor() {
        this.httpCorl = new HttpCorl();
        this.GlobalManager = new GlobalManager();
        this.httpCorl.constructInit(this);
        this.GlobalManager.constructInit(this);

    },

    handlePlayerInfo() {
        let data = this.userName + "*" + this.passWord;
        return data;
    }






});

module.exports = DataManager;
