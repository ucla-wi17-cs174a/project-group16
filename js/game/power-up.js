var INV = 0;
var SPD = 1;

Declare_Any_Class( "Power_Up",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      {
        this.graphics_state  = context.shared_scratchpad.graphics_state;
        this.shared_scratchpad = context.shared_scratchpad;

        this.shared_scratchpad.string_map.power_ups = [];

        this.shared_scratchpad.string_map.power_ups_last_time = 0;
        this.shared_scratchpad.string_map.power_ups_last_spawn = 0;

        shapes_in_use.cube = new Cube();
      },
    'display': function(time)
      {
        var graphics_state  = this.graphics_state;
        var shared_scratchpad = this.shared_scratchpad.string_map;

        var power_ups = shared_scratchpad.power_ups;

        if (time == null) time = 0;

        // Determine the time since the last render
        var power_ups_progress = time - shared_scratchpad.power_ups_last_time;
        var power_ups_spawn_progress = time - shared_scratchpad.power_ups_last_spawn;

        // Update the last updated time to the current time
        if (time != null) shared_scratchpad.power_ups_last_time = time;

        var model_transform = mat4();

        shaders_in_use[ "Default" ].activate();

        var invincibility = new Material( Color( 1,.2,.1,1 ), .3, .2, .8, 40 );
        var speed = new Material( Color(.2,1,.2, 1), .3, .2, .8, 40);

        // Spawn new power up
        if( power_ups.length < 2){// && Math.random() < 0.001 ) {

          var sign = Math.floor(Math.random() * 2);

          if(sign == 0) {
            sign = 1;
          } else {
            sign = -1;
          }

          var x = -250 * sign;
          var y = Math.floor(Math.random() * 100);
          var z = Math.floor(Math.random() * 500);
          var size = 2;

          model_transform = mult( model_transform, translation( x, y, z ) );
          model_transform = mult( model_transform, translation( 0, -50, -200 ) );

          model_transform = mult( model_transform, scale( size , size, size ));
          model_transform = mult( model_transform, rotation( sign * 90, 0, 1, 0 ) );

          var type = Math.floor(Math.random() * 2);
          power_ups.push([ model_transform , ( Math.random() * 0.001 + 0.005 ) , size , 0, type]);

          power_ups_spawn_progress = time;
        }

        // Manage Power Ups
        for(var i = 0; i < power_ups.length ; i++) {

          power_ups[i][3] += power_ups_progress * power_ups[i][1];

          model_transform = mat4();
          model_transform = mult(power_ups[i][0], translation(0, 0 , power_ups_progress * power_ups[i][1]));

          // Remove fish that are out of bounds
          if(power_ups[i][3]  < -200 || power_ups[i][3] > 200) {
            power_ups.splice(i, 1);
            i--;
            continue;
          }

          var shape = shapes_in_use.sphere;
          var b = mat4();

          b = mult( b, inverse(this.graphics_state.camera_transform));
          b = mult( b, translation( 0, -2, -20 ) );
          b = mult( b, rotation( 180, 0, 1, 0 ) );
          b = mult( b, scale( 0.2, 0.2, 0.2 ) );

          var a_inv = inverse(model_transform); //inverse(this.graphics_state.camera_transform);
          var collided = false;

          // Detect collision
          for(var j = 0; j < power_ups.length && !collided; j++) {
              var T = mult( a_inv, b );  // Convert sphere b to a coordinate frame where a is a unit sphere
              for( let p of shape.positions ) {
                var Tp = mult_vec( T, p.concat(1) ).slice(0,3);
                var tmp = dot( Tp, Tp );            // Apply a_inv*b coordinate frame shift
                if( tmp  < player_size + 0.2) { // change this to 1 or 1.2 if positions are normalized in obj-shapes.js

                  if(power_ups[i][4] == INV) {
                    // Go invincible
                    if(player_power.length != 0 && player_power[0] == INV) {
                      player_power[1] += 10000;
                    } else {
                      player_power = [ INV, 10000 ];
                    }
                  } else if(power_ups[i][4] == SPD) {
                    player_power = [ SPD, 20000 ];
                    player_speed = .05;
                  }

                  power_ups.splice(i, 1);
                  i--;
                  collided = true;
                  break;
                }
              }
          }

          if(collided) {
            updateScoreBoard();
            continue;
          }

          if(power_ups[i][4] == INV) {
            shapes_in_use.cube.draw( graphics_state, model_transform, invincibility );
          } else if(power_ups[i][4] == SPD) {
            shapes_in_use.cube.draw( graphics_state, model_transform, speed );
          }

          power_ups[i][0] = model_transform;
        }

        if(player_power.length != 0) {
          player_power[1] -= power_ups_progress;

          if(player_power[1] < 0) {
            player_power = [];
            player_speed = 0.02;
          }
        }

      }
  }, Animation );
