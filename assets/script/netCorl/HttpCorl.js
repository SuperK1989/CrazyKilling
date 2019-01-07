var conf = require('initConf')

var ClassHttp = cc.Class({

    properties: {
        dataManager: null,
    },

    // ctor(dataManager) {
    //     this.dataManager = dataManager;
    // },

    constructInit(dataManager) {
        this.dataManager = dataManager;
    },

    HttpPost(interFaceHandle, data, completeFunc) {
        let url = conf.netConfig.httpUrl + interFaceHandle;

        let httpXml = new XMLHttpRequest();
        httpXml.open("POST", url, true);
        httpXml.setRequestHeader("Content-Type", "application/json");

        httpXml.onreadystatechange = function () {
            if (httpXml.readyState == 4 && (httpXml.status >= 200 && httpXml.status < 400)) {
                completeFunc(interFaceHandle, httpXml.status, httpXml.responseText)
            }
        };

        httpXml.send(data);
    },


});

module.exports = ClassHttp
