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
        this.gameplay = gamePlay;//变换坐标，计算子弹飞出时的向量
        let startPos = gamePlay.nodePlayer.getPosition();
        let movePos = this.node.parent.convertToNodeSpaceAR(pos);
        this.node.setPosition(startPos);
        let newPos = movePos.sub(startPos);
        let finalPos = newPos.normalize();
        this.node.active = true;

        let changeX = movePos.x - startPos.x;//修改炮台子弹的rotation
        let changeY = movePos.y - startPos.y;
        let rota = Math.atan(changeX / changeY);
        let rotation = rota * 180 / Math.PI;
        if (changeY <= 0)
            rotation = 180 + rotation;
        this.node.rotation = rotation;
        gamePlay.nodePlayer.rotation = rotation;

        this.dirPos = finalPos;
        SoundManager.playSoundEffect("fire1", false);
    },

    update(dt) {
        if (this.dirPos) {
            this.node.x += this.dirPos.x * 30;
            this.node.y += this.dirPos.y * 30;
        }
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
        let num = this.gameplay.playerScore.string
        this.gameplay.playerScore.string = parseInt(num) + 1;
        this.node.stopAllActions();
        this.node.active = false;
        this.putBackBullet(this.node);
    },
});
