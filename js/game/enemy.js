Declare_Any_Class( "Enemy",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      {
        this.graphics_state  = context.shared_scratchpad.graphics_state;
        this.shared_scratchpad = context.shared_scratchpad;

        this.shared_scratchpad.string_map.enemies = [];
        this.shared_scratchpad.string_map.enemies_speed = [];
        this.shared_scratchpad.string_map.last_time = 0;
        this.shared_scratchpad.string_map.last_spawn = 0;

        shapes_in_use.strip = new Cube();
        shapes_in_use.fish  = new Shape_From_File( "model/Fish3.obj", scale( 1, 1, 1 ) );
      },
    'display': function(time)
      {
        var graphics_state  = this.graphics_state;
        var shared_scratchpad = this.shared_scratchpad.string_map;

        var enemies = shared_scratchpad.enemies;
        var enemies_speed = shared_scratchpad.enemies_speed;

        if (time == null) time = 0;

        // Determine the time since the last render
        var progress = time - shared_scratchpad.last_time;
        var spawn_progress = time - shared_scratchpad.last_spawn;

        // Update the last updated time to the current time
        if (time != null) shared_scratchpad.last_time = time;

        var model_transform = mat4();

        shaders_in_use[ "Default" ].activate();
        //this.graphics_state.lights = [ new Light( vec4(  3,  2,  1, 1 ), Color( 1, 0, 0, 1 ), 100000000 ),
        //                               new Light( vec4( -1, -2, -3, 1 ), Color( 0, 1, 0, 1 ), 100000000 ) ];

        var fish_material = new Material( Color( .4,.6,.5,1 ), .4, .4, .8, 40, "img/fishScales.jpg" );


        // Spawn new fish
        if(spawn_progress > 500 || spawn_progress == 0) {

          var sign = Math.floor(Math.random() * 2);

          if(sign == 0) {
            sign = 1;
          } else {
            sign = -1;
          }

          var x = -250 * sign;
          var y = Math.floor(Math.random() * 100);
          var z = Math.floor(Math.random() * 500);
          var size = Math.floor(Math.random() * 20) * 0.2 + 0.5;

          model_transform = mult( model_transform, translation( x, y, z ) );

          model_transform = mult( model_transform, scale( size , size, size ));
          model_transform = mult( model_transform, rotation( sign * 90, 0, 1, 0 ) );

          enemies.push([ x , y , z , ( Math.random() * 0.01 + 0.01 ) * sign , size , sign ]);

          shared_scratchpad.last_spawn = time;
        }

        // Manage Fish
        for(var i = 0; i < enemies.length; i++) {

          var x = enemies[i][0] + (progress * enemies[i][3]);
          var y = enemies[i][1];
          var z = enemies[i][2];
          var size = enemies[i][4];
          var sign = enemies[i][5]

          // Remove fish that are out of bounds
          if(x  < -300 || x > 300) {
            enemies.splice(i, 1);
            i--;
            continue;
          }

          // Detect collision
          


          model_transform = mat4();
          model_transform = mult( model_transform, translation( x, y, z ) );
          model_transform = mult( model_transform, scale( size , size, size ));
          model_transform = mult( model_transform, rotation( sign * 90, 0, 1, 0 ) );

          shapes_in_use.fish.draw( graphics_state, model_transform, fish_material );

          enemies[i][0] = x;
        }
      }
  }, Animation );
