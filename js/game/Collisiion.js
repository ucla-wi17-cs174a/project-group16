function momFishCollision()
{
    if(!data.gameOver)
    {
        for (var i = 0; i < fish.num ; i++)
        {
            if(fish.alive[i])
            {
                //calculate length
                var l = calLength2(fish.x[i], fish.y[i], mom.x, mom.y);//big eat
                if (l < 900)
                {
                    //fruit eaten
                    fish.dead(i);
                    data.fishNum ++;
                    mom.momBodyCount ++;
                    if(mom.momBodyCount > 7)
                    {
                        mom.momBodyCount = 7;
                    }
                    if(fish.fishType[i] == "blue") //blue
                    {
                        data.double =2;
                    }
                    wave.born(fish.x[i], fish.y[i]);  //big fish eat and create a x y
                }
            }
        }
    }
}

//mom body collision

function momBodyCollision()
{
    if(data.fishNum > 0 && !data.gameOver)
    {
        var l = calLength2(mom.x, mom.y, enermy.x, enermy.y);   //big fish eat small
        if(l < 900)
        {
            //fish recover
            enermy.babyBodyCount = 0;
            mom.momBodyCount = 0;
            //data.reset();
            data.addScore();

            //draw halo
            halo.born(enermy.x, enermy.y);


        }
    }
}
