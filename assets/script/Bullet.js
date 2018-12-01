
cc.Class({
    extends: cc.Component,

    properties: {

        speed: 5,
        damage: 10,
        position: (1000, 1000),
    },

    onLoad() {
        this.wLimit = cc.view.getVisibleSize().width;
        this.hLimit = cc.view.getVisibleSize().height;
        this.node.setPosition(0, 0);
        console.log(this.node.getPosition())
    },

    start() {

    },

    init(gamePlay) {
        console.log(this.node.getPosition())
        let action = cc.moveBy(0.1, 0, 1000);
        this.node.runAction(action);
        this.node.scale = 2;
        this.gameplay = gamePlay;
    },

    update(dt) {
        if (this.node.y > this.wLimit / 2) {
            this.gameplay.putBulletToPoll(this.node);
            this.node.setPosition(0, 0);
            this.node.removeFromParent();
        }
    },
});
