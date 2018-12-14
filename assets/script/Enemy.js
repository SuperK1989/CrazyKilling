var SoundManager = require('SoundManager')
cc.Class({
    extends: cc.Component,

    properties: {
        collision: cc.BoxCollider,
        boom: cc.ParticleSystem,
        nodeCollider: cc.Node,
        enemyspeed: 1,
        pauseFlag: true,
        enemyType: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
        this.collision.enabled = true;
        this.boom.resetSystem();
        let reFreshX = 1334 * Math.random();
        let reFreshY = 750 * Math.random();
        let randomPosition = cc.v2(reFreshX, reFreshY)
        let turnPosition = this.node.parent.convertToNodeSpaceAR(randomPosition)
        this.node.setPosition(turnPosition);
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
        let fadeIn = cc.fadeIn(0.5);
        this.node.runAction(fadeIn);
        this.gamePlay = gamePlay;
    },

    onCollisionEnter: function (selfCollider, otherCollider) {
        switch (selfCollider.node.name) {
            case "bullet": {
                this.boom.node.active = true;
                SoundManager.playSoundEffect("boom1", false);
                this.node.stopAllActions();
                this.collision.enabled = false;
                let fadeOut = cc.fadeOut(0.5);
                this.node.runAction(fadeOut)
                this.scheduleOnce(callBack => {
                    this.node.active = false;
                    this.putEnemyBackToPool(this.node)
                }, 1)
                break;
            }

            case "sp_player": {
                this.gamePlay.nodeGameOver.active = true;
                this.gamePlay.gameOverScore.string = this.gamePlay.playerScore.string;
                this.gamePlay.getComponent("Gameplay").unschedule(callBack => {
                    console.log("unschedule success")
                })
                break;
            }
        }

    },

    putEnemyBackToPool(enemy) {
        this.gamePlay.putEnemyToPool(enemy);
        enemy.removeFromParent();
    },

    update(dt) {
        if (this.pauseFlag) {
            var charactor = this.gamePlay.nodePlayer;
            var charactorPos = charactor.getPosition();
            var turnWorldPos = charactor.parent.convertToWorldSpaceAR(charactorPos);
            var turnPos = this.node.parent.convertToNodeSpaceAR(turnWorldPos);
            var movePos = turnPos.sub(this.node.getPosition());
            var handlePos = movePos.normalize();

            this.node.x += handlePos.x * this.enemyspeed;
            this.node.y += handlePos.y * this.enemyspeed;

        }
    },

    enemyMove() {

    },
});
