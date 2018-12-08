var SoundManager = require('SoundManager')
cc.Class({
    extends: cc.Component,

    properties: {

        speed: 5,
        damage: 10,
        position: (1000, 1000),
    },

    onLoad() {
        this.wLimit = cc.view.getFrameSize().width;
        this.hLimit = cc.view.getFrameSize().height;
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
    },

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
    },

    start() {

    },

    init(gamePlay, pos) {
        this.gameplay = gamePlay;
        let startPos = gamePlay.nodePlayer.getPosition();
        let movePos = this.node.parent.convertToNodeSpaceAR(pos);
        let normalPos = movePos.normalize();
        let overMove = normalPos.scale(cc.v2(900, 900));
        movePos.addSelf(overMove)
        this.node.setPosition(startPos);
        this.node.active = true;
        let action = cc.moveTo(0.5, movePos);
        this.node.runAction(action);
        SoundManager.playSoundEffect("fire1", false);
    },

    update(dt) {
        let tempNodePos = this.node.parent.convertToWorldSpace(this.node.getPosition())
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
