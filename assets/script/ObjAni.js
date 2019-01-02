module.exports = {
    IconAnimation(node) {
        var posX = node.x
        var posY = node.y
        var action1 = cc.moveTo(0.1, posX + 5, posY + 5).easing(cc.easeBackOut())
        var action2 = cc.moveTo(0.1, posX - 5, posY - 5).easing(cc.easeBackOut())
        var action = cc.repeat(cc.sequence(action1, action2), 5)
        node.runAction(action)
    }
}   