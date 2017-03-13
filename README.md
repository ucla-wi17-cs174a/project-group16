# FISH TANK

project-group16 :

Bryson Li 304-772-658
Matt Garnett 504-573-592
Michael Grieve 604-650-561

Note: Please run this game using Google Chrome! It is the only browser we tested. If you are running this game from your computer, navigate to the directory with index.html. Next, if you have Python 2.x, type python -m SimpleHTTPServer or if you have Python 3.x, type python -m http.server and then open localhost:8000. Or you can go to https://ucla-wi17-cs174a.github.io/project-group16/ to play the game.

## How to play this game (Press Enter to start)

1. You play as a fish which starts at size 1. Every fish that you eat increases your size by 0.1 and your score proportional to the fish's size.
2. Use your mouse to 'set' which direction your fish faces, and wasd keys to move the fish in space.
3. When you collide with a larger fish, you lose a life and are set back to size 1.
4. You can collect power-ups and use them to move faster or be invisible (for a short period of time).

## Game Concept & Thoughts

The idea for the game comes from the a popular 2D game called Fishy Flash (http://fishy-flash-game.com/). We thought that bringing this fun 2D game to the 3D world would be fun and so that is how we came up with Fish Tank. Overall the game is interesting, but more in a novelty sense. It lacks real game design and there are too many frustrations that arise. In the 2D version the game requires skill and finesse to navigate around bigger fish. In the 3D world, navigation it not a major issue. Instead the biggest challenge of our game is perceiving depth. As you play the game you will find yourself often staring down a fish, unsure who is larger. Also, we weren't able to really "gamify" Fish Tank by adding a persistent high scoreboard or achievements. Because of these short comings, it is unlikely that Fish Tank will take off and become an Internet sensation—however, it should address the key points we have learned in the class as well as a couple advanced topics.

## Bugs

* The walls are a suggestion, rather than rigid bodies. The problem we kept running into here is that we were trying to collide the player with the wall and we're not storing the player's coordinates anywhere, only the transform matrix. This is because Garett's template code uses thrust to propel the camera rather than discreet values of x, y, and z.

* Fish and power-ups de-spawn randomly. This is because the code that tracks the distance of how far they have traveled seems to depend on their size. We had to use their distance traveled due to the issue we were having with detecting wall collisions.

* The game performs poorly on some older machines. We aren't exactly sure why this is since there are some WebGL programs that seem much more intricate and run perfectly fine. It is possible that the collision detection of the 100 fish that can spawn is causing this.

## Some Advanced Topics

1. Collision detection (between our fish and enemy fish)
2. Bump mapping (for fish/fish scales)
