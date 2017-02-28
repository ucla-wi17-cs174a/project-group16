var babyObj = function()
{
    this.x;
    this.y;

    this.babyAngle;

    this.babyEye = new Image();
    this.babyBody = new Image();
    this.babyTail = new Image();

    this.babyTailTimer = 0;
    this.babyTailCount = 0;

    this.babyEyeTimer = 0;
    this.babyEyeCount = 0;
    this.babyEyeInterval = 1000;

    this.babyBodyTimer = 0;
    this.babyBodyCount = 0;


}

babyObj.prototype.init = function()
{
    this.x = canWidth * 0.5 - 50;
    this.y = canHeight * 0.5 + 50;
    this.babyAngle = 0;
    //this.babyEye.src  = "./src/bigEye0.png";
    this.babyBody.src = "./src/babyFade0.png";
    //this.babyTail.src = "./src/babyTail0.png";
}

babyObj.prototype.draw = function()
{
    //lerp x, y
    this.x = lerpDistance(mom.x ,this.x, 0.98);
    this.y = lerpDistance(mom.y, this.y, 0.99);
    //lerp angel
    var deltaY = mom.y - this.y;
    var deltaX = mom.x - this.x;
    var beta = Math.atan2(deltaY, deltaX) + Math.PI;//-PI , PI

    //lerp angle
    this.babyAngle = lerpAngle(beta, this.babyAngle, 0.6);  //calculate fish speed with mouth

    //baby tail count
    //this.babyTailTimer += deltaTime;
    this.babyTailTimer += deltaTime;
    if(this.babyTailTimer > 50)
    {
        this.babyTailCount = (this.babyTailCount + 1) % 8;
        this.babyTailTimer %= 50;
    }

    //baby eye
    this.babyEyeTimer += deltaTime ;
    if(this.babyEyeTimer > this.babyEyeInterval)
    {
        this.babyEyeCount = (this.babyEyeCount + 1) % 2;
        this.babyEyeTimer %= this.babyEyeInterval;
        if(this.babyEyeCount == 0)
        {
            this.babyEyeInterval = Math.random() * 1500 + 2000;//[]
        }
        else
        {
            this.babyEyeInterval = 200;
        }
    }

    //baby body
    this.babyBodyTimer += deltaTime;
    if(this.babyBodyTimer > 300)
    {
        this.babyBodyCount = this.babyBodyCount +1 ;
        this.babyBodyTimer %= 300;  //little fish turn white smoothy
        if(this.babyBodyCount > 19 )
        {
            this.babyBodyCount = 19;
            data.gameOver = true;
            // game over
        }
    }

    //console.log(deltaTime);
    //console.log(this.babyTailCount);

    //ctx1
    ctx1.save();
    //translate()
    ctx1.translate(this.x, this.y);     //mouth drop to x y origin
    ctx1.rotate(this.babyAngle);        //fish turn with big 
    var babyTailCount = this.babyTailCount;
    ctx1.drawImage(babyTail[babyTailCount], - babyTail[babyTailCount].width * 0.5 +23, - babyTail[babyTailCount].height * 0.5);
    var babyBodyCount =this.babyBodyCount;
    ctx1.drawImage(babyBody[babyBodyCount], - babyBody[babyBodyCount].width * 0.5, - babyBody[babyBodyCount].height * 0.5);
    var babyEyeCount =this.babyEyeCount;
    ctx1.drawImage(babyEye[babyEyeCount], - babyEye[babyEyeCount].width * 0.5, - babyEye[babyEyeCount].height * 0.5);

    ctx1.restore();
}
