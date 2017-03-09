

//status
//isInvincible
//elementName

eatfish.element.PlayerNodeStatus = {	
	small: 1,
	normal: 2,
	big: 3		
};

eatfish.element.PlayerNodeTag = {	
	water: 10,
	flower: 11
};

eatfish.element.PlayerNode = eatfish.element.BaseFishNode.extend({
	sprite:null,
	ctor:function () {		
		this._super();
		
		this.elementName = eatfish.element.Name.player;
		
		this.status = eatfish.element.PlayerNodeStatus.small;
		this.isInvincible = false;
		this.animSpriteList = eatfish.element.fishData.playerFish;
		this.isMoving = false;
		
		var fish = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(this.animSpriteList[0]));
		fish.setAnchorPoint(0, 0);
		fish.setPosition(0, 0);
		fish.setTag(eatfish.element.BaseFishNodeTag.fish);		
		this.addChild(fish);
		
		this.setAnchorPoint(0.5, 0.5);
		this.setContentSize(fish.getContentSize());

		var center = new cc.Node();
		center.setAnchorPoint(0.5, 0.5);
		center.setPosition(this.getContentSize().width / 2, 21);
		center.setTag(eatfish.element.BaseFishNodeTag.centerPoint);
		center.setContentSize(cc.size(16, 16));
		this.addChild(center);

		this.changeStatus(this.status);
		
		return true;
	}
});

eatfish.element.PlayerNode.prototype.changeStatus = function(status) {
	this.status = status;
	var water = this.getChildByTag(eatfish.element.PlayerNodeTag.water);
	var center = this.getChildByTag(eatfish.element.BaseFishNodeTag.centerPoint);
	//var test = this.getChildByTag(9999);
	switch(this.status) {
	case eatfish.element.PlayerNodeStatus.normal:
		this.animSpriteList = eatfish.element.fishData.playerMFish;
		this.animKey = cfg.animKeyPlayerMFish;
		if (water)
			water.setScale(10.0);
			center.setPosition(56, 40);
			center.setContentSize(cc.size(56, 56));
			//test.setPosition(56, 40);
			//test.setContentSize(cc.size(56, 56));
			//test.setScale(1.75);
			break;
	case eatfish.element.PlayerNodeStatus.big:
		this.animSpriteList = eatfish.element.fishData.playerBFish;
		this.animKey = cfg.animKeyPlayerBFish;
		if (water)
			water.setScale(15.0);
			center.setPosition(120, 96);
			center.setContentSize(cc.size(96, 96));
			//test.setPosition(120, 96);
			//test.setContentSize(cc.size(96, 96));
			//test.setScale(3);
			break;
	default:
		this.animSpriteList = eatfish.element.fishData.playerFish;
		this.animKey = cfg.animKeyPlayerFish;
		if (water)
			water.setScale(5.0);
			center.setPosition(28, 21);
			center.setContentSize(cc.size(16, 16));
			//test.setPosition(28, 21);
			//test.setContentSize(cc.size(16, 16));
			//test.setScale(0.5);
			break;
	}
	this.playAnim();
	
};

eatfish.element.PlayerNode.prototype.invincible = function() {
	this.isInvincible = true;
	
	var water = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("water1.png"));
	water.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
	water.setScale(5.0);
	water.setTag(eatfish.element.PlayerNodeTag.water);
	this.addChild(water);
	
	this.scheduleOnce(this.invincibleCallback, cfg.playerInvincible);
};

eatfish.element.PlayerNode.prototype.invincibleCallback = function() {
	this.isInvincible = false;
	var water = this.getChildByTag(eatfish.element.PlayerNodeTag.water);
	if(water)
		water.removeFromParent(true);
};

eatfish.element.PlayerNode.prototype.invincible2 = function() {
	this.isInvincible = true;
	
	
	var water = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("water1.png"));
	water.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
	water.setScale(5.0);
	water.setTag(eatfish.element.PlayerNodeTag.water);
	this.addChild(water);
	
	
	var flower = cc.ParticleSystemQuad(res.particle_sys_flower_plist);
	flower.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
	flower.setTag(eatfish.element.PlayerNodeTag.flower);
	this.addChild(flower);
	
	
	this.scheduleOnce(this.invincible2Callback1, cfg.playerInvincible2 - 3.0);
	this.scheduleOnce(this.invincible2Callback2, cfg.playerInvincible2);
};

eatfish.element.PlayerNode.prototype.invincible2Callback1 = function(delay) {
	var water = this.getChildByTag(eatfish.element.PlayerNodeTag.water);
	var blink = cc.Blink(3.0, 5);
	if(water)
		water.runAction(blink);
};

eatfish.element.PlayerNode.prototype.invincible2Callback2 = function(delay) {
	this.isInvincible = false;
	var water = this.getChildByTag(eatfish.element.PlayerNodeTag.water);
	if(water)
		water.removeFromParent(true);
	var flower = this.getChildByTag(eatfish.element.PlayerNodeTag.flower);
	if(flower) {
		flower.stopSystem();
		flower.removeFromParent(true);
	}
};

eatfish.element.PlayerNode.prototype.pause = function() {
	if(this.getChildByTag(eatfish.element.PlayerNodeTag.water))
		this.getChildByTag(eatfish.element.PlayerNodeTag.water).pause();
	if(this.getChildByTag(eatfish.element.PlayerNodeTag.flower))
		this.getChildByTag(eatfish.element.PlayerNodeTag.flower).pause();
	eatfish.element.BaseFishNode.prototype.pause.call(this);
};

eatfish.element.PlayerNode.prototype.resume = function() {
	if(this.getChildByTag(eatfish.element.PlayerNodeTag.water))
		this.getChildByTag(eatfish.element.PlayerNodeTag.water).resume();
	if(this.getChildByTag(eatfish.element.PlayerNodeTag.flower))
		this.getChildByTag(eatfish.element.PlayerNodeTag.flower).resume();
	eatfish.element.BaseFishNode.prototype.resume.call(this);
};

eatfish.element.PlayerNode.prototype.cump = function(enemyFishType) {
	if(Math.random() <= 0.2)
		cc.audioEngine.playEffect(res.audios_eatfish2_mp3);
	else
		cc.audioEngine.playEffect(res.audios_eatfish1_mp3);
	
	var scoreEffect = new ccui.TextField();
	switch(enemyFishType) {
	case eatfish.element.Name.enemtyFish2:
		scoreEffect.setString("+" + cfg.scoreFish2);
	break;
	case eatfish.element.Name.enemtyFish3:
		scoreEffect.setString("+" + cfg.scoreFish3);
	break;
	case eatfish.element.Name.enemtyFish4:
		scoreEffect.setString("+" + cfg.scoreFish4);
	break;
	default:
		scoreEffect.setString("+" + cfg.scoreFish1);
	break;
	}
	
	scoreEffect.setFontSize(24);
	scoreEffect.setFontName(cfg.globalFontName01);
	scoreEffect.setTextColor(cc.color(255, 255, 0, 255));
	scoreEffect.setPosition(this.getContentSize().width / 2, this.getContentSize().height);
	this.addChild(scoreEffect);
	scoreEffect.runAction(cc.Sequence.create(cc.MoveBy.create(1.0, cc.p(0, 20)), cc.CallFunc.create(this.scoreEffectMoveEnd, this, scoreEffect)));

	eatfish.element.BaseFishNode.prototype.cump.call(this);
};

eatfish.element.PlayerNode.prototype.scoreEffectMoveEnd = function(sender) {
	sender.removeFromParent(true);
};
