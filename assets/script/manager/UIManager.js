var winMana = require("./manager/WinManager")

var UIManager = cc.Class({

    properties: {
        winManager: null,
    },

    ctor() {
        this.openedWin = {};
        this.winManager = new winMana;
    },
});

module.exports = UIManager;
