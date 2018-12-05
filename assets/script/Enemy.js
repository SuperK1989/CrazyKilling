cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let reFreshX = 1334 * Math.random();
        let reFreshY = 750 * Math.random();
        this.node.setPosition(reFreshX, reFreshY);
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
    },

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
    },

    start() {

    },

    init(gamePlay) {
        this.gamePlay = gamePlay;
        let destination = gamePlay.nodePlayer.getPosition();
        let action = cc.moveTo(5, destination);
        this.node.runAction(action);
    },

    onCollisionEnter: function (selfCollider, otherCollider) {
        this.node.stopAllActions();
        this.node.active = false;
        this.putEnemyBackToPool(this.node)
    },

    putEnemyBackToPool(enemy) {
        this.gamePlay.putEnemyToPool(enemy);
        enemy.removeFromParent();
    }

    // update (dt) {},
});
