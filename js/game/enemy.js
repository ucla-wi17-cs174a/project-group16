Declare_Any_Class( "Enemy",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      {
        this.graphics_state  = context.shared_scratchpad.graphics_state;
        shapes_in_use.strip = new Cube();
      },
    'display': function(time)
      {
        var graphics_state  = this.graphics_state;
        var model_transform = mat4();

        shaders_in_use[ "Default" ].activate();
        this.graphics_state.lights = [ new Light( vec4(  3,  2,  1, 1 ), Color( 1, 0, 0, 1 ), 100000000 ),
                                       new Light( vec4( -1, -2, -3, 1 ), Color( 0, 1, 0, 1 ), 100000000 ) ];

        var purplePlastic = new Material( Color( .9,.5,.9,1 ), .4, .4, .8, 40 );

        model_transform = mult( model_transform, translation( 0, 0, -5 ) );
        shapes_in_use.strip.draw( graphics_state, model_transform, purplePlastic );

      }
  }, Animation );
