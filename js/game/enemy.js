Declare_Any_Class( "Enemy",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      {
        this.graphics_state  = context.shared_scratchpad.graphics_state;
        this.shared_scratchpad = context.shared_scratchpad;

        this.shared_scratchpad.string_map.enemies = [];
        this.shared_scratchpad.string_map.enemies_speed = [];
        this.shared_scratchpad.string_map.last_time = 0;
        this.shared_scratchpad.string_map.last_spawn = 0;

        shapes_in_use.sphere = new Subdivision_Sphere(1)

        shapes_in_use.strip = new Cube();
        shapes_in_use.fish  = new Shape_From_File( "model/Fish3.obj", scale( 1, 1, 1 ) );
      }, 'game_over': function() {

        main_menu = true;

        audio_snowyhill.pause();
        audio_nyancat.pause();
        audio_snowyhill_fast.pause();

        alert('GAME OVER');

        this.shared_scratchpad.string_map.enemies = [];
        this.shared_scratchpad.string_map.enemies_speed = [];
        this.shared_scratchpad.string_map.last_time = 0;
        this.shared_scratchpad.string_map.last_spawn = 0;

        player_score = 0;
        player_size = 1;
        player_lives = 3;
        player_power = [];

        this.shared_scratchpad.string_map.power_ups = [];
        this.shared_scratchpad.string_map.power_ups_last_time = 0;
        this.shared_scratchpad.string_map.power_ups_last_spawn = 0;

        this.shared_scratchpad.yaw = mat4();
        this.shared_scratchpad.pitch = mat4();
        this.shared_scratchpad.position = mat4();

        this.shared_scratchpad.camera_transform = this.graphics_state.reset_camera;
      },
    'display': function(time)
      {
        var graphics_state  = this.graphics_state;
        var shared_scratchpad = this.shared_scratchpad.string_map;

        var enemies = shared_scratchpad.enemies;

        if (time == null) time = 0;

        // Determine the time since the last render
        var progress = time - shared_scratchpad.last_time;
        var spawn_progress = time - shared_scratchpad.last_spawn;

        // Update the last updated time to the current time
        if (time != null) shared_scratchpad.last_time = time;

        var model_transform = mat4();

        shaders_in_use[ "Default" ].activate();
        shaders_in_use[ "Bump Map" ].activate();

        var fish_material = new Material( Color( .2,.6,.4,1 ), .3, .2, .8, 40, "img/fishScales.jpg" );

        if(main_menu)
          return;

        // Spawn new fish
        if( enemies.length < 100 && (spawn_progress > 500 || spawn_progress == 0) ) {

          var sign = Math.floor(Math.random() * 2);

          if(sign == 0) {
            sign = 1;
          } else {
            sign = -1;
          }

          var x = -250 * sign;
          var y = Math.floor(Math.random() * 75 + 30);
          var z = Math.floor(Math.random() * 350 + 100);
          var size = Math.random() * (10 + 3 * player_size) - 6;

          if(size < 0) {
            size = Math.random() * player_size;
          } else if(size > 30) {
            size == 30;
          }

          model_transform = mult( model_transform, translation( x, y, z ) );
          model_transform = mult( model_transform, translation( 0, -50, -200 ) );

          model_transform = mult( model_transform, scale( size , size, size ));
          model_transform = mult( model_transform, rotation( sign * 90, 0, 1, 0 ) );

          enemies.push([ model_transform , ( Math.random() * 0.001 + 0.005 ) , size , 0 ]);

          shared_scratchpad.last_spawn = time;
        }

        // Manage Fish
        for(var i = 0; i < enemies.length ; i++) {

          enemies[i][3] += progress * enemies[i][1];

          model_transform = mat4();
          model_transform = mult(enemies[i][0], translation(0, 0 , progress * enemies[i][1]));

          // Remove fish that are out of bounds
          if(enemies[i][3]  < -200 || enemies[i][3] > 200) {
            enemies.splice(i, 1);
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
          for(var j = 0; j < enemies.length && !collided; j++) {
              var T = mult( a_inv, b );  // Convert sphere b to a coordinate frame where a is a unit sphere
              for( let p of shape.positions ) {
                var Tp = mult_vec( T, p.concat(1) ).slice(0,3);
                var tmp = dot( Tp, Tp );            // Apply a_inv*b coordinate frame shift
                if( tmp  < 2 * player_size + 0.2) { // change this to 1 or 1.2 if positions are normalized in obj-shapes.js

                  if(enemies[i][2] > player_size && !(player_power.length != 0 && player_power[0] == INV) ) {
                    // Player dies
                    player_size = 1;
                    player_lives -= 1;

                    if(player_lives < 0)
                      this.game_over();

                  } else {
                    player_score += Math.ceil(enemies[i][2]);
                    player_size += 0.1;
                  }

                  enemies.splice(i, 1);
                  i--;
                  collided = true;
                  break;
                }
              }
          }

          if(collided) {
            updateScoreBoard();
            // audio_bubbles_s.play();
            continue;
          }

          shapes_in_use.fish.draw( graphics_state, model_transform, fish_material );

          enemies[i][0] = model_transform;
        }
      }
  }, Animation );
