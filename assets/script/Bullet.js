var SoundManager = require('SoundManager')
cc.Class({
    extends: cc.Component,

    properties: {

        speed: 5,
        damage: 10,
        position: (1000, 1000),
        pauseFlag: true,

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

    init(gamePlay, rotaInit) {
        this.gameplay = gamePlay;//变换坐标，计算子弹飞出时的向量
        let startPos = gamePlay.nodePlayer.getPosition();
        // let movePos = this.node.parent.convertToNodeSpaceAR(pos);
        this.node.setPosition(startPos);
        this.node.rotation = rotaInit;

        let tempPos = cc.v2(0, 1);
        tempPos = tempPos.rotate(-rotaInit * Math.PI / 180).normalize();
        // let movePos = this.rotationToPos(rotaInit);
        // let newPos = gamePlay.nodePlayer.convertToWorldSpaceAR(tempPos);
        // let nextPos = this.node.convertToNodeSpaceAR(newPos);
        let finalPos = tempPos;
        console.log(rotaInit + "1111111")
        console.log(finalPos + "2222222")
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
            let tempNodePos = this.node.parent.convertToWorldSpace(this.node.getPosition())
            if (tempNodePos.y > this.hLimit || tempNodePos.y < -this.hLimit) {
                this.putBackBullet(this.node);
            }
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

    rotationToPos(rotation) {
        let resPos = cc.v2;
        if (rotation != -0 && rotation != 90 && rotation != 180 && rotation != 270) {
            resPos = cc.v2(Math.tan(rotation), 1)
        }
        switch (rotation) {
            case -0: {
                resPos = cc.v2(0, 1)
                break;
            }
            case 90: {
                resPos = cc.v2(1, 0)
                break;
            }
            case 180: {
                resPos = cc.v2(0, -1)
                break;
            }
            case 270: {
                resPos = cc.v2(-1, 0)
                break;
            }
        }
        return resPos.normalize();
    }
});
