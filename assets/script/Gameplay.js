var addAction = require('ObjAni')
var SoundManager = require('SoundManager')
cc.Class({
    extends: cc.Component,

    properties: {
        prefabBullet: cc.Prefab,
        prefabEnemy: cc.Prefab,
        bulletPool: cc.NodePool,
        enemyPool: cc.NodePool,
        nodePlayer: cc.Node,
        enemyRefresh: cc.Node,
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

        btn_sound: {
            type: cc.AudioClip,
            default: null,
        },

        playerMove: false,
        playerSpeed: 1,
        playerMoveDir: cc.v2(0, 0),
        fireDir: cc.v2,
        fireTemp: false,
        enemyNum: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("FrameSize:" + cc.view.getFrameSize())
        console.log("VisibleSize:" + cc.view.getVisibleSize())
        this.scheduleOnce(func => {
            console.log("FrameSize:" + cc.view.getFrameSize())
            console.log("VisibleSize:" + cc.view.getVisibleSize())
        }, 10)

        this.setBulletPool();
        this.setEnemyPool();

        this.nodeStickArea.on("touchstart", this.stickCtrl, this)
        this.nodeStickArea.on("touchmove", this.stickCtrl, this)
        this.nodeStickArea.on("touchend", this.stickCtrl, this)

        this.nodeFireArea.on("touchstart", this.fireCtrl, this)
        this.nodeFireArea.on("touchmove", this.fireCtrl, this)
        this.nodeFireArea.on("touchend", this.fireCtrl, this)


        // this.schedule(this.refreshEnemy, 1, cc.macro.REPEAT_FOREVER, 2)
        this.schedule(this.openFire, 1)


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
        let initCount = 15;
        for (let i = 0; i < initCount; ++i) {
            let bullet = cc.instantiate(this.prefabBullet); // 创建节点
            this.bulletPool.put(bullet); // 通过 putInPool 接口放入对象池
        }
    },

    putBulletToPool(node) {//将子弹放入子弹池
        this.bulletPool.put(node);
    },

    putEnemyToPool(node) {//将子弹放入子弹池
        this.enemyPool.put(node);
    },

    loadEnemy() {
        let enemy = null;
        if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.prefabEnemy);
        }
        enemy.parent = this.enemyRefresh; // 将生成的敌人加入节点树
        enemy.getComponent('Enemy').init(this); //接下来就可以调用 enemy 身上的脚本进行初始化
    },

    setEnemyPool() {
        this.enemyPool = new cc.NodePool();
        let initCount = 15;
        for (let i = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(this.prefabEnemy); // 创建节点
            this.enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
        }
    },

    rotationChange(custom) {
        switch (custom.target.name) {
            case "fanhuiLeft": {
                this.nodePlayer.rotation -= 10;
                break;
            }
            case "fanhuiRight": {
                this.nodePlayer.rotation += 10;
                break;
            }
        }
    },

    gameRestart() {
        cc.director.loadScene("PlayerLogin");
        cc.audioEngine.stopAll();
    },

    gamePause(custom) {
        switch (custom.target.name) {
            case "btn_pause": {
                cc.audioEngine.play(this.btn_sound, false);
                this.unschedule(this.refreshEnemy);
                this.nodePause.active = false;
                this.nodeResume.active = true;
                this.nodePauseBg.active = true;
                this.stopMove(false);
                break;
            }

            case "btn_resume": {
                cc.audioEngine.play(this.btn_sound, false);
                this.schedule(this.refreshEnemy, 1, cc.macro.REPEAT_FOREVER, 2);
                this.nodePause.active = true;
                this.nodeResume.active = false;
                this.nodePauseBg.active = false;
                this.stopMove(true);
                break;
            }
        }
    },

    touchFire(custom) {
        let touchPos = custom.touch._point;
        this.openFire(touchPos);
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

                    let fireDir = this.nodeBulletPool.convertToNodeSpaceAR(sPos);
                    this.nodePlayer.rotation = this.posToRotation(sPos);

                }
                else {
                    var x = Math.cos(this.getRadian(nodeTouchPos)) * radius;
                    var y = Math.sin(this.getRadian(nodeTouchPos)) * radius;
                    this.nodeFireStick.setPosition(cc.v2(x, y));
                    let sPos = cc.v2(x, y).normalize();
                    let fireDir = this.nodeBulletPool.convertToNodeSpaceAR(sPos);
                    // this.fireDir = fireDir;
                    // this.playerMoveDir = sPos;
                    this.nodePlayer.rotation = this.posToRotation(sPos);

                }
                break;
            }

            case "touchend": {
                this.nodeFireBg.active = false;
                this.nodeFireStick.setPosition(0, 0);
                this.fireTemp = false;
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

        var childrenEnCont = this.enemyRefresh.childrenCount;
        for (let i = 0; i < childrenEnCont; i++) {
            let scri = this.enemyRefresh.children[i].getComponent("Enemy")
            scri.pauseFlag = control;
        }
    },

    refreshEnemy() {
        let enemyNums = this.enemyRefresh.childrenCount;//刷怪
        if (enemyNums < 10) {
            this.loadEnemy()
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
            this.nodePlayer.x += this.playerMoveDir.x * this.playerSpeed;
            this.nodePlayer.y += this.playerMoveDir.y * this.playerSpeed;
        }


    },
});
