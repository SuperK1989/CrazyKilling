var addAction = require('ObjAni')
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
        enemyNum: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("FrameSize:" + cc.view.getFrameSize())
        console.log("VisibleSize:" + cc.view.getVisibleSize())
        this.schedule(func => {
            console.log("FrameSize:" + cc.view.getFrameSize())
            console.log("VisibleSize:" + cc.view.getVisibleSize())
        }, 10)
        this.setBulletPool();
        this.setEnemyPool();
        let enemyNums = this.enemyRefresh.childrenCount;
        this.schedule(callBack => {
            if (enemyNums < 10) {
                this.loadEnemy()
            }
        }, 1, cc.macro.REPEAT_FOREVER, 2)
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
    },

    start() {

    },

    openFire(touchPos) {
        let bullet = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.prefabBullet);
        }
        bullet.parent = this.nodeBulletPool; // 将生成的敌人加入节点树
        bullet.getComponent('Bullet').init(this, touchPos); //接下来就可以调用 enemy 身上的脚本进行初始化
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

    touchFire(custom) {
        let touchPos = custom.touch._point;
        this.openFire(touchPos);
        console.log(touchPos);
    },


    update(dt) {

    },
});
