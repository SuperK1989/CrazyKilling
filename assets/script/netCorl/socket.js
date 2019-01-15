window.onfire = require("./onfire"); //处理事件的类库
onfire.onmsg = function (msg, func, context) {
    let name = cc.js.getClassName(context);
    return onfire.on(msg, function () {
        if (cc.isValid(context)) {
            func.apply(context, arguments);
        } else if (CC_DEBUG) {
            // console.warn("onmsg error", name, msg);
        }
    })
}

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    ctor: function () {
        this.ws = null;
        this.encrypt = true;

        var keys = Object.keys(msgMap);
        keys.forEach(element => {
            msgMap[msgMap[element][element]] = element
        });
    },

    close: function () {
        if (this.ws != null) {
            this.ws.close()
            this.ws = null
        }
    },
    connect: function (url) {
        var self = this;
        if (this.ws != null) {
            this.ws.close()
        }
        this.msgIndex = 1;
        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
            onfire.fire("connected")
        };
        this.ws.onmessage = function (event) {
            var jsonObj;
            if (typeof (event.data) == 'string') {
                jsonObj = JSON.parse(event.data);
            } else {
                jsonObj = msgpack.decode(new Uint8Array(event.data))
            }
            var msg_name = jsonObj.name;
            var msg_data = jsonObj.data;
            if (self.encrypt) {
                msg_name = msgMap[msg_name];
                var msgMapInfo = msgMap[msg_name];
                msg_data = self.decodeObj(msgMapInfo, msg_data);
            }
            // if (msg_name != "sc_buyu_fish_update") {
            //     console.log(msg_name, msg_data);
            // }

            // if (msg_name == "sc_buyu_item_update" || msg_name == "sc_buyu_level_update") {
            //     console.warn(msg_name, msg_data);
            // }
            var gData = require("../model/initData");
            gData.DataManager.handleMessage(msg_name, msg_data);
        };
        this.ws.onerror = function (event) {
            console.error("Send Text fired an error");
            onfire.fire("onerror");
        };
        this.ws.onclose = function (event) {
            console.warn("WebSocket instance closed.");
            onfire.fire("onclose");
        };
    },

    decodeObj: function (msgMapInfo, orgObj) {
        // console.log(msgMapInfo, orgObj);
        //{"1":"test002","name":10411,"index":1}
        var newMsgObj = {};
        for (const key in msgMapInfo) {
            var keyInfo = msgMapInfo[key];
            var value = orgObj[keyInfo[0]];
            if (value == null)
                continue;
            // console.log(key, value, keyInfo);
            if (keyInfo[1] === 'nil') {
                //基础类型
                newMsgObj[key] = value;
            } else {
                //自定义类型，递归处理
                var _msgMapInfo = msgMap[keyInfo[1]];
                if (keyInfo[2] == true) {
                    //数组？
                    var listObj = [];
                    for (let index = 0; index < value.length; index++) {
                        listObj.push(this.decodeObj(_msgMapInfo, value[index]));
                    }
                    newMsgObj[key] = listObj;
                } else {
                    newMsgObj[key] = this.decodeObj(_msgMapInfo, value);
                }
            }
        }
        return newMsgObj;
    },

    encodeObj: function (msgMapInfo, orgObj) {
        var newMsgObj = {}
        for (const key in orgObj) {
            var keyInfo = msgMapInfo[key];
            var value = orgObj[key];
            if (keyInfo[1] === 'nil') {
                //基础类型
                newMsgObj[keyInfo[0]] = value;
            } else {
                //自定义类型，递归处理
                var _msgMapInfo = msgMap[keyInfo[1]];
                if (keyInfo[2] == true) {
                    //数组？
                    newMsgObj[keyInfo[0]] = [];
                    for (let index = 0; index < value.length; index++) {
                        newMsgObj[keyInfo[0]].push(this.encodeObj(_msgMapInfo, value[index]));
                    }
                } else {
                    newMsgObj[keyInfo[0]] = this.encodeObj(_msgMapInfo, value);
                }
            }
        }
        return newMsgObj;
    },

    send: function (id, msgObj) {
        console.log("id:", id);
        console.log("msgObj:", msgObj)
        if (this.encrypt) {
            var msgMapInfo = msgMap[id];
            msgObj = this.encodeObj(msgMapInfo, msgObj);
            msgObj.name = msgMapInfo[id];
        } else {
            msgObj.name = id
        }
        msgObj.index = this.msgIndex;
        // console.log("->:", msgObj)
        this.msgIndex++;
        this.sendObj(msgObj);
    },

    sendObj: function (jsonObj) {
        this.sendString(msgpack.encode(jsonObj));
    },

    sendString: function (msg) {
        if (this.ws != null && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(msg);
        } else {
            console.warn("websocket not connected");
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});