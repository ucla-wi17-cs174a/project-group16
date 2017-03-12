var audio_bubbles_s = new Audio('audio/Bubbles_Shorter.mp3');
var audio_bubbles = new Audio('audio/Fishtank_Bubbles.mp3');
var audio_eating = new Audio('audio/Eating.mp3');
var audio_munch = new Audio('audio/Cartoon_Munch.mp3');
var audio_success = new Audio('audio/HighScore.wav');
var audio_grow = new Audio('audio/smw_power-up.wav');
var firstTime = true;

var updateScoreBoard = function() {
  if (firstTime == false && player_size == 1) {
    //play munching noise (lose)
    audio_munch.play();
  } else if (firstTime == false && player_score > 25) // player scored above 25!
  // can make this number lower if it is too hard
  {
    //play munching noise (success)
    audio_success.play();
  } else if (firstTime == false && player_size > 1) // player scored
  {
    //play munching noise (success)
    audio_eating.play();
    audio_grow.play();
  }

  document.getElementById("scoreToUpdate").innerHTML = "<b>Current Score:</b> " + player_score + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Fish Size: </b>" + Math.ceil(player_size * 10) / 10;
  if (firstTime == true) firstTime = false; // at start of game
}
