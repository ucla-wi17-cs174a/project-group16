function momFruitsCollision()
{
    if(!data.gameOver)
    {
        for (var i = 0; i < fruit.num ; i++)
        {
            if(fruit.alive[i])
            {
                //calculate length
                var l = calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y);//big eat
                if (l < 900)
                {
                    //fruit eaten
                    fruit.dead(i);
                    data.fruitNum ++;
                    mom.momBodyCount ++;
                    if(mom.momBodyCount > 7)
                    {
                        mom.momBodyCount = 7;
                    }
                    if(fruit.fruitType[i] == "blue") //blue
                    {
                        data.double =2;
                    }
                    wave.born(fruit.x[i], fruit.y[i]);  //big fish eat and create a x y
                }
            }
        }
    }
}

//mom body collision

function momBodyCollision()
{
    if(data.fruitNum > 0 && !data.gameOver)
    {
        var l = calLength2(mom.x, mom.y, baby.x, baby.y);   //big fish eat small
        if(l < 900)
        {
            //baby recover
            baby.babyBodyCount = 0;
            mom.momBodyCount = 0;
            //data.reset();
            data.addScore();

            //draw halo
            halo.born(baby.x, baby.y);


        }
    }
}
