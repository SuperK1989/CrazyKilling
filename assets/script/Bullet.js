
cc.Class({
    extends: cc.Component,

    properties: {

        speed: 5,
        damage: 10,
        position: (1000, 1000),
    },

    onLoad() {
        console.log(this.node.getPosition())
        this.wLimit = cc.view.getFrameSize().width;
        this.hLimit = cc.view.getFrameSize().height;
        this.node.setPosition(0, 0);
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
        this.node.active = true;
        let action = cc.moveBy(5, 0, 10000);
        this.node.runAction(action);
        this.node.scale = 2;
        this.gameplay = gamePlay;
    },

    update(dt) {
        let tempNodePos = this.node.convertToWorldSpace(0, 0)
        if (tempNodePos.y > this.hLimit || tempNodePos.y < -this.hLimit) {
            this.putBackBullet(this.node);
        }
    },

    putBackBullet(bullet) {
        this.gameplay.putBulletToPool(bullet);
        bullet.setPosition(0, 0);
        bullet.removeFromParent();
    },

    onCollisionEnter: function (contact, selfCollider, otherCollider) {
        this.node.stopAllActions();
        this.node.active = false;
        this.putBackBullet(this.node);
    },
});
