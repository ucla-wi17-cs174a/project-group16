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

        var purplePlastic = new Material( Color( .9,.5,.9,1 ), .4, .4, .8, 40 );


        if(spawn_progress > 1000 || spawn_progress == 0) {
          model_transform = mult( model_transform, translation( -250, Math.floor(Math.random() * 100), Math.floor(Math.random() * 500) ) );

          var size = Math.floor(Math.random() * 5 + 0.5);
          model_transform = mult( model_transform, scale( size , size, size ));
          enemies.push(model_transform);
          enemies_speed.push(Math.random() * 0.01 + 0.01);

          shared_scratchpad.last_spawn = time;
        }

        // Update the cubes' degree offset
        for(var i = 0; i < enemies.length; i++) {

          model_transform = mat4();
          model_transform = mult(enemies[i], translation(progress * enemies_speed[i], 0 , 0));
          shapes_in_use.strip.draw( graphics_state, model_transform, purplePlastic );

          enemies[i] = model_transform;
        }
      }
  }, Animation );
