

//moveTime
//moveStartPoint
//moveEndPoint
//moveTimeElapsed

eatfish.element.BaseEnemyFishNode = eatfish.element.BaseFishNode.extend({
	sprite:null,
	ctor:function () {		
		this._super();
		
		this.moveTime = 0;
		this.moveStartPoint = cc.p(0, 0);
		this.moveEndPoint = cc.p(0, 0);
		this.moveTimeElapsed = 0;
				
		return true;
	}
});

eatfish.element.BaseEnemyFishNode.prototype.paralysis = function() {
	eatfish.element.BaseFishNode.prototype.pause.call(this);
	this.unscheduleUpdate();
};

eatfish.element.BaseEnemyFishNode.prototype.update = function(delta) {
	this.moveTimeElapsed += delta;
};

//eatfish.element.BaseEnemyFishNode.prototype.paralysisEnd = function(sender) {
//	eatfish.element.BaseFishNode.prototype.paralysisEnd.call(this, sender);
//	
//	
//	this.scheduleUpdate();
//	
//	var gameSceneLayer = this.getParent().getParent();
////	this.runAction(cc.Sequence.create(cc.MoveTo.create(this.moveTime - this.moveTimeElapsed, this.moveEndPoint), cc.CallFunc.create(gameSceneLayer.enemyFishMoveEnd, gameSceneLayer, this)));
//
//};
