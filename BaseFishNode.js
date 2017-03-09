

//animSpriteList
//animKey
//orientation
//isMoving

eatfish.element.BaseFishNodeTag = {
	fish: 1,
	centerPoint: 2,
	cump: 3
};

eatfish.element.BaseFishNodeOrientation = {
	left: 1,
	right: 2
};

eatfish.element.Name = {
	player: 1,
	jellyFish: 2,
	enemtyFish1: 3,
	enemtyFish2: 4,
	enemtyFish3: 5,
	enemtyFish4: 6,
	enemtyFish5: 7,
	enemtyFish6: 8	
};

eatfish.element.BaseFishNode = cc.Node.extend({
	sprite:null,
	ctor:function () {		
		this._super();
		
		this.animSpriteList = null;
		this.animKey = null;
		this.orientation = eatfish.element.BaseFishNodeOrientation.left;
		this.isMoving = false;
				
		return true;
	}
});

eatfish.element.BaseFishNode.prototype.centerRect = function() {

	var center = this.getChildByTag(eatfish.element.BaseFishNodeTag.centerPoint);
	if(!center)
		return cc.rect(0, 0, 0, 0);
	var point = cc.p(center.getBoundingBox().x, center.getBoundingBox().y);
	point = this.convertToWorldSpace(point);
	return cc.rect(point.x, point.y, center.getContentSize().width, center.getContentSize().height);	
};

eatfish.element.BaseFishNode.prototype.orientationLeft = function() {
	this.orientation = eatfish.element.BaseFishNodeOrientation.left;
	var fish = this.getChildByTag(eatfish.element.BaseFishNodeTag.fish);
	fish.setFlippedX(false);
};

eatfish.element.BaseFishNode.prototype.orientationRight = function() {
	this.orientation = eatfish.element.BaseFishNodeOrientation.right;
	var fish = this.getChildByTag(eatfish.element.BaseFishNodeTag.fish);
	fish.setFlippedX(true);
};

eatfish.element.BaseFishNode.prototype.cump = function() {
	var chumSprite = this.getChildByTag(eatfish.element.BaseFishNodeTag.cump);
	if(chumSprite) {
		chumSprite.stopAllActions();
		chumSprite.removeFromParent(true);
	}
	

	var cumpList = [ "cump1.png", "cump2.png", "cump3.png", "cump4.png", "cump5.png" ];
	var i = rangeRandom(0, cumpList.length - 1);

	chumSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(cumpList[i]));
	

	if(this.orientation == eatfish.element.BaseFishNodeOrientation.left)
		chumSprite.setPosition(-chumSprite.getContentSize().width / 2, this.getContentSize().height / 2);
	else
		chumSprite.setPosition(this.getContentSize().width + (chumSprite.getContentSize().width / 2), this.getContentSize().height / 2);

	chumSprite.setTag(eatfish.element.BaseFishNodeTag.cump);
	this.addChild(chumSprite);
	chumSprite.runAction(cc.Sequence.create(cc.DelayTime.create(0.2), cc.CallFunc.create(this.cumpAutoHide, this, chumSprite)));

};

eatfish.element.BaseFishNode.prototype.paralysis = function() {
	if(!this.isMoving)
		return;
	this.isMoving = false;
	this.stopAllActions();
	var fish = this.getChildByTag(eatfish.element.BaseFishNodeTag.fish);
	if(fish)
		fish.stopAllActions();
	var act1 = cc.MoveBy.create(0.01, cc.p(-3, 0));
	var act2 = cc.MoveBy.create(0.02, cc.p(6, 0));
	var act3 = act2.reverse();
	var act4 = cc.MoveBy.create(0.01, cc.p(3, 0));
	this.runAction(cc.Sequence.create(
			act1, 
			act2, 
			act3, 
			act4, 
			cc.DelayTime.create(5.0), 
			cc.CallFunc.create(function() {
				this.playAnim();
				this.isMoving = true;
			}, this)
	));
};

eatfish.element.BaseFishNode.prototype.pause = function() {
	if(this.getChildByTag(eatfish.element.BaseFishNodeTag.fish))
		this.getChildByTag(eatfish.element.BaseFishNodeTag.fish).pause();
	if(this.getChildByTag(eatfish.element.BaseFishNodeTag.cump))
		this.getChildByTag(eatfish.element.BaseFishNodeTag.cump).pause();

	cc.Node.prototype.pause.call(this);
};

eatfish.element.BaseFishNode.prototype.resume = function() {
	if(this.getChildByTag(eatfish.element.BaseFishNodeTag.fish))
		this.getChildByTag(eatfish.element.BaseFishNodeTag.fish).resume();
	if(this.getChildByTag(eatfish.element.BaseFishNodeTag.cump))
		this.getChildByTag(eatfish.element.BaseFishNodeTag.cump).resume();

	cc.Node.prototype.resume.call(this);
};

eatfish.element.BaseFishNode.prototype.cumpAutoHide = function(sender) {
	sender.stopAllActions();
	sender.removeFromParent(true);
};

eatfish.element.BaseFishNode.prototype.playAnim = function() {
	var anim = cc.animationCache.getAnimation(this.animKey);
	var fish = this.getChildByTag(eatfish.element.BaseFishNodeTag.fish);
	if(!anim) {
		var frames = new Array();
		
		for(var i = 0; i < this.animSpriteList.length; i++) {
			frames.push(cc.spriteFrameCache.getSpriteFrame(this.animSpriteList[i]));
		}
		
		anim = new cc.Animation(frames);
		anim.setDelayPerUnit(0.1);
		anim.setRestoreOriginalFrame(false);
		cc.animationCache.addAnimation(anim, this.animKey);
		this.setContentSize(frames[0].getOriginalSize());
	}
	fish.stopAllActions();
	var animate = cc.repeatForever(cc.animate(anim));
	fish.runAction(animate);
};
