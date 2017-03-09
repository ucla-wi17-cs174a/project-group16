
//type
//elementName

eatfish.element.EnemyFishType = {
	fish1: 1,
	fish2: 2,
	fish3: 3,
	fish4: 4,
	fish5: 5
};

eatfish.element.EnemyFishNode = eatfish.element.BaseEnemyFishNode.extend({
	sprite:null,
	ctor:function (type) {		
		this._super();

		this.type = type;
		this.moveTimeElapsed = 0;
		
		switch (this.type) {
		case eatfish.element.EnemyFishType.fish2:
			this.animSpriteList = eatfish.element.fishData.fish2;
			this.animKey = cfg.animKeyEnemyFish2;
			this.elementName = eatfish.element.Name.enemtyFish2;
			
			break;
		case eatfish.element.EnemyFishType.fish3:
			this.animSpriteList = eatfish.element.fishData.fish3;
			this.animKey = cfg.animKeyEnemyFish3;
			this.elementName = eatfish.element.Name.enemtyFish3;
			
			break;
		case eatfish.element.EnemyFishType.fish4:
			this.animSpriteList = eatfish.element.fishData.fish4;
			this.animKey = cfg.animKeyEnemyFish4;
			this.elementName = eatfish.element.Name.enemtyFish4;
			
			break;
		case eatfish.element.EnemyFishType.fish5:
			this.animSpriteList = eatfish.element.fishData.fish5;
			this.animKey = cfg.animKeyEnemyFish5;
			this.elementName = eatfish.element.Name.enemtyFish5;
	
			break;
		default:
			this.animSpriteList = eatfish.element.fishData.fish1;
			this.animKey = cfg.animKeyEnemyFish1;
			this.elementName = eatfish.element.Name.enemtyFish1;
			
			break;
		}
		
		var enemyFish = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(this.animSpriteList[0]));
		enemyFish.setAnchorPoint(0, 0);
		enemyFish.setPosition(0, 0);
		enemyFish.setTag(eatfish.element.BaseFishNodeTag.fish);
		this.addChild(enemyFish);
		
		this.setAnchorPoint(0.5, 0.5);
		this.setContentSize(enemyFish.getContentSize());
		
		var center = new cc.Node();
		center.setAnchorPoint(0.5, 0.5);
		center.setTag(eatfish.element.BaseFishNodeTag.centerPoint);		
		switch(this.type) {
		case eatfish.element.EnemyFishType.fish2:
			center.setPosition(this.getContentSize().width / 2, 12);
			center.setContentSize(cc.size(16, 16));
			break;
		case eatfish.element.EnemyFishType.fish3:
			center.setPosition(this.getContentSize().width / 2, 30);
			center.setContentSize(cc.size(24, 24));
			break;
		case eatfish.element.EnemyFishType.fish4:
			center.setPosition(this.getContentSize().width / 2, 50);
			center.setContentSize(cc.size(40, 40));
			break;
		case eatfish.element.EnemyFishType.fish5:
			center.setPosition(this.getContentSize().width / 2, 105);
			center.setContentSize(cc.size(128, 96));
			break;
		default:
			center.setPosition(this.getContentSize().width / 2, 12);
			center.setContentSize(cc.size(16, 16));
			break;
		}
		this.addChild(center);
		this.playAnim();
		this.scheduleUpdate();
		
		return true;
	}
});
