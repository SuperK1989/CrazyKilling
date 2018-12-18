var SoundManager = require('SoundManager')
cc.Class({
    extends: cc.Component,

    properties: {

        speed: 5,
        damage: 10,
        position: (1000, 1000),
        pauseFlag: true,

        visibalW: 0,
        visibalH: 0,
    },

    onLoad() {

    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
    },

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
    },

    start() {

    },

    init(gamePlay, rotaInit) {
        this.gameplay = gamePlay;//变换坐标，计算子弹飞出时的向量
        this.visibalW = gamePlay.visibalW;
        this.visibalH = gamePlay.visibalH;
        let startPos = gamePlay.nodePlayer.getPosition();
        this.node.setPosition(startPos);
        this.node.rotation = rotaInit;

        let tempPos = cc.v2(0, 1);
        tempPos = tempPos.rotate(-rotaInit * Math.PI / 180).normalize();
        let finalPos = tempPos;
        this.node.active = true;

        this.dirPos = finalPos;
        SoundManager.playSoundEffect("fire1", false);
    },

    update(dt) {
        if (this.pauseFlag) {
            if (this.dirPos) {
                this.node.x += this.dirPos.x * 30;
                this.node.y += this.dirPos.y * 30;
            }
            let tempNodePos = this.node.position;
            if (tempNodePos.y > this.visibalH || tempNodePos.y < -this.visibalH) {
                this.putBackBullet(this.node);
            } else if (tempNodePos.x > this.visibalW || tempNodePos.x < -this.visibalW)
                this.putBackBullet(this.node);
        }

    },

    putBackBullet(bullet) {
        this.gameplay.putBulletToPool(bullet);
        bullet.setPosition(0, 0);
        bullet.removeFromParent();
    },

    onCollisionEnter: function (contact, selfCollider, otherCollider) {
        let num = this.gameplay.playerScore.string
        this.gameplay.playerScore.string = parseInt(num) + 1;
        this.node.stopAllActions();
        this.node.active = false;
        this.putBackBullet(this.node);
    },

});
