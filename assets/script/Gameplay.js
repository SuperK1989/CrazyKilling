var addAction = require('ObjAni')
var SoundManager = require('./manager/SoundManager')
var conf = require('initConf')
var gData = require("./manager/InitData")
cc.Class({
    extends: cc.Component,

    properties: {
        prefabBullet: cc.Prefab,
        prefabEnemy: [cc.Prefab],
        bulletPool: cc.NodePool,
        enemyPool: cc.NodePool,
        nodePlayer: cc.Node,
        enemyRefresh: {
            type: [cc.Node],
            default: [],
        },
        nodeBulletPool: cc.Node,
        nodeGameOver: cc.Node,
        nodeStickArea: cc.Node,
        nodeJoyStick: cc.Node,
        nodeMoveStick: cc.Node,
        nodeFireArea: cc.Node,
        nodeFireBg: cc.Node,
        nodeFireStick: cc.Node,
        nodePause: cc.Node,
        nodeResume: cc.Node,
        nodePauseBg: cc.Node,
        nodeCanvas: cc.Node,
        playerScore: cc.Label,
        gameOverScore: cc.Label,
        playerCoin: cc.Label,

        btn_sound: {
            type: cc.AudioClip,
            default: null,
        },

        playerMove: false,
        playerSpeed: 1,
        playerFireTime: 0.5,
        playerMoveDir: cc.v2(0, 0),
        fireDir: cc.v2,
        fireTemp: true,
        enemyNum: 0,

        visibalW: 0,
        visibalH: 0,

        stage: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let visibalSize = cc.view.getVisibleSize();
        if (visibalSize.width > 1334) {
            this.visibalW = 1334 / 2;
            this.visibalH = visibalSize.height / 2;
        }
        else {
            this.visibalW = visibalSize.width / 2;
            this.visibalH = visibalSize.height / 2;
        }

        this.scheduleOnce(func => {
            this.visibalW = visibalSize.width / 2;
            this.visibalH = visibalSize.height / 2;
            console.log("FrameSize:" + cc.view.getFrameSize())
            console.log("VisibleSize:" + cc.view.getVisibleSize())
        }, 3)

        this.setBulletPool();
        this.setEnemyPool();

        this.nodeStickArea.on("touchstart", this.stickCtrl, this)
        this.nodeStickArea.on("touchmove", this.stickCtrl, this)
        this.nodeStickArea.on("touchend", this.stickCtrl, this)

        this.nodeFireArea.on("touchstart", this.fireCtrl, this)
        this.nodeFireArea.on("touchmove", this.fireCtrl, this)
        this.nodeFireArea.on("touchend", this.fireCtrl, this)


        this.schedule(this.refreshEnemy, 5, cc.macro.REPEAT_FOREVER, 5)

        this.schedule(this.openFire, this.playerFireTime)

        this.playerCoin.string = gData.DataManager.playerInfo.player_coin;
        this.playerScore.string = 0;
        this.gameOverScore.string = 0;
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;

    },

    start() {

    },

    openFire() {
        if (this.fireTemp) {
            let bullet = null;
            if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                bullet = this.bulletPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                bullet = cc.instantiate(this.prefabBullet);
            }
            bullet.parent = this.nodeBulletPool; // 将生成的敌人加入节点树
            bullet.getComponent('Bullet').init(this, this.nodePlayer.rotation); //接下来就可以调用 enemy 身上的脚本进行初始化
        }
    },

    setBulletPool() {
        this.bulletPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let bullet = cc.instantiate(this.prefabBullet); // 创建节点
            this.bulletPool.put(bullet); // 通过 putInPool 接口放入对象池
        }
    },

    setEnemyPool() {
        this.enemyPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(this.prefabEnemy[0]); // 创建节点
            this.enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
        }
    },

    putBulletToPool(node) {//将子弹放入子弹池
        this.bulletPool.put(node);
    },

    putEnemyToPool(node) {//将子弹放入子弹池
        this.enemyPool.put(node);
    },

    loadEnemy(type) {

        var randomAreaNum = 4 * Math.random();
        randomAreaNum = Math.floor(randomAreaNum)
        var enemy = null;
        if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.prefabEnemy[0]);
        }
        enemy.parent = this.enemyRefresh[randomAreaNum]; // 将生成的敌人加入节点树
        enemy.getComponent('Enemy').init(this, type, randomAreaNum); //接下来就可以调用 enemy 身上的脚本进行
        // console.log("刷新区域:" + randomAreaNum, this.enemyRefresh[randomAreaNum].childrenCount)
    },

    refreshEnemy() {//type,num,config  //刷新
        this.stage += 1;
        let stageNum = conf.stageConfig[this.stage];
        let keys = Object.keys(conf.stageConfig)
        if (stageNum == undefined) {
            let stage = keys.length
            stageNum = conf.stageConfig[stage]
        }
        let enemyGroup = stageNum.enemy;
        for (let i = 0; i < enemyGroup.length; i++) {
            this.fresh(enemyGroup[i].type, enemyGroup[i].num)
        }
    },

    fresh(type, num) {
        let self = this;
        this.schedule(function () {
            self.loadEnemy(type)
        }, 2, num, 0)
    },

    gameRestart() {
        cc.audioEngine.play(this.btn_sound, false);
        cc.director.resume();
        let data = gData.DataManager.handlePlayerInfo() + "#" + gData.DataManager.token;
        gData.DataManager.httpCorl.HttpPost('/restart', JSON.stringify(data), this.restartBack);


    },

    restartBack(interFaceHandle, status, responseText) {
        if (responseText == '') {
            cc.director.loadScene("PlayerLogin", callFun => {
                let winLogin = cc.find("Canvas/Main Camera/bg/login");
                winLogin.active = false;

            });
        }
        else {
            gData.UIManager.tipsFly(responseText);
            cc.director.loadScene("PlayerLogin");
        }
    },

    gamePause(custom) {
        switch (custom.target.name) {
            case "btn_pause": {
                cc.audioEngine.play(this.btn_sound, false);
                this.unschedule(this.refreshEnemy);
                this.nodePause.active = false;
                this.nodeResume.active = true;
                this.nodePauseBg.active = true;
                cc.director.pause();
                // this.stopMove(false);
                break;
            }

            case "btn_resume": {
                cc.audioEngine.play(this.btn_sound, false);
                this.schedule(this.refreshEnemy, 1, cc.macro.REPEAT_FOREVER, 2);
                this.nodePause.active = true;
                this.nodeResume.active = false;
                this.nodePauseBg.active = false;
                cc.director.resume();
                // this.stopMove(true);
                break;
            }
        }
    },


    stickCtrl(custom) {
        switch (custom.type) {
            case "touchstart": {
                this.nodeJoyStick.active = true;
                let location = custom.getLocation();
                let handleLo = this.nodeStickArea.convertToNodeSpaceAR(location);
                this.nodeJoyStick.setPosition(handleLo);
                break;
            }

            case "touchmove": {
                let touchPos = custom.getLocation();
                let nodeTouchPos = this.nodeJoyStick.convertToNodeSpaceAR(touchPos);
                let moveStickdis = Math.sqrt(Math.pow(nodeTouchPos.x, 2) + Math.pow(nodeTouchPos.y, 2))
                var radius = this.nodeJoyStick.width / 2;
                if (moveStickdis < radius) {
                    this.nodeMoveStick.setPosition(nodeTouchPos);
                    let sPos = nodeTouchPos.normalize();
                    this.playerMoveDir = sPos;
                    this.playerMove = true;
                }
                else {
                    var x = Math.cos(this.getRadian(nodeTouchPos)) * radius;
                    var y = Math.sin(this.getRadian(nodeTouchPos)) * radius;
                    this.nodeMoveStick.setPosition(cc.v2(x, y));
                    let sPos = cc.v2(x, y).normalize();
                    this.playerMoveDir = sPos;
                    this.playerMove = true;
                }
                break;
            }

            case "touchend": {
                this.playerMove = false;
                this.nodeJoyStick.active = false;
                this.nodeMoveStick.setPosition(0, 0);
                break;
            }
        }

    },

    fireCtrl(custom) {
        switch (custom.type) {
            case "touchstart": {
                // this.nodePlayer.getComponent(cc.Sprite).spriteFrame
                this.nodeFireBg.active = true;
                let location = custom.getLocation();
                let handleLo = this.nodeFireArea.convertToNodeSpaceAR(location);
                this.nodeFireBg.setPosition(handleLo);
                this.fireTemp = true;

                break;
            }

            case "touchmove": {
                let touchPos = custom.getLocation();
                let nodeTouchPos = this.nodeFireBg.convertToNodeSpaceAR(touchPos);
                let moveStickdis = Math.sqrt(Math.pow(nodeTouchPos.x, 2) + Math.pow(nodeTouchPos.y, 2))
                var radius = this.nodeFireBg.width / 2;
                if (moveStickdis < radius) {
                    this.nodeFireStick.setPosition(nodeTouchPos);
                    let sPos = nodeTouchPos.normalize();
                    this.nodePlayer.rotation = this.posToRotation(sPos);

                }
                else {
                    var x = Math.cos(this.getRadian(nodeTouchPos)) * radius;
                    var y = Math.sin(this.getRadian(nodeTouchPos)) * radius;
                    this.nodeFireStick.setPosition(cc.v2(x, y));
                    let sPos = cc.v2(x, y).normalize();
                    this.nodePlayer.rotation = this.posToRotation(sPos);

                }
                break;
            }

            case "touchend": {
                this.nodeFireBg.active = false;
                this.nodeFireStick.setPosition(0, 0);
                this.fireTemp = true;
                break;
            }
        }
    },

    posToRotation(pos) {
        let rota = Math.atan(pos.x / pos.y);
        let rotation = rota * 180 / Math.PI;
        if (pos.y <= 0)
            rotation = 180 + rotation;
        return rotation;
    },

    stopMove(control) {
        var childrenBuCont = this.nodeBulletPool.childrenCount;
        for (let i = 0; i < childrenBuCont; i++) {
            let scri = this.nodeBulletPool.children[i].getComponent("Bullet")
            scri.pauseFlag = control;
        }

        for (let k = 0; k < this.enemyRefresh.length; k++) {
            var childrenEnCont = this.enemyRefresh[k].childrenCount;
            for (let i = 0; i < childrenEnCont; i++) {
                let scri = this.enemyRefresh[k].children[i].getComponent("Enemy")
                scri.pauseFlag = control;
            }
        }
    },


    getRadian(point) {
        let radian = Math.PI / 180 * this.getAngle(point);
        return radian;
    },

    getAngle(point) {
        let angle = Math.atan2(point.y, point.x) * 180 / Math.PI;
        return angle;
    },


    update(dt) {
        if (this.playerMove) {
            if (this.nodePlayer.x >= this.visibalW)
                this.nodePlayer.x = this.visibalW;
            if (this.nodePlayer.x <= -this.visibalW)
                this.nodePlayer.x = -this.visibalW;
            if (this.nodePlayer.y >= this.visibalH)
                this.nodePlayer.y = this.visibalH;
            if (this.nodePlayer.y <= -this.visibalH)
                this.nodePlayer.y = -this.visibalH;
            this.nodePlayer.x += this.playerMoveDir.x * this.playerSpeed;
            this.nodePlayer.y += this.playerMoveDir.y * this.playerSpeed;
        }


    },
});
