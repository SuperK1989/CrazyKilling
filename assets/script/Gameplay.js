var addAction = require('ObjAni')
cc.Class({
    extends: cc.Component,

    properties: {
        prefabBullet: cc.Prefab,
        bulletPool: cc.NodePool,
        parentNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.setBulletPool();

    },

    start() {

    },

    openFire() {
        console.log(this.parentNode.children);
        let bullet = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.enemyPrefab);
        }
        bullet.parent = this.parentNode; // 将生成的敌人加入节点树
        bullet.getComponent('Bullet').init(this); //接下来就可以调用 enemy 身上的脚本进行初始化
        console.log(this.parentNode.children);
    },

    setBulletPool() {
        this.bulletPool = new cc.NodePool();
        let initCount = 5;
        for (let i = 0; i < initCount; ++i) {
            let bullet = cc.instantiate(this.prefabBullet); // 创建节点
            this.bulletPool.put(bullet); // 通过 putInPool 接口放入对象池
        }
    },

    putBulletToPoll(node) {
        this.bulletPool.put(node);
    },



    update(dt) {

    },
});
