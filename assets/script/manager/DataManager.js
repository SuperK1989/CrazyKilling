var HttpCorl = require("./netCorl/HttpCorl")

var DataMnager = cc.Class({


    properties: {
        httpC: null,
    },

    onLoad() {
        this.httpC = new Httpcorl
        console.log(this.httpC)
    }


});
