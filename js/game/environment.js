Declare_Any_Class( "Environment",
  { 'construct': function( context )
      { this.graphics_state  = context.shared_scratchpad.graphics_state;

        shapes_in_use.square = new Square();
      },
    'display': function(time)
      {
        var model_transform = mat4();

        shaders_in_use[ "Default" ].activate();
        this.graphics_state.lights = [ new Light( vec4(  3,  2,  1, 1 ), Color( 1, 0, 0, 1 ), 100000000 ),
                                       new Light( vec4( -1, -2, -3, 1 ), Color( 0, 1, 0, 1 ), 100000000 ) ];

        var brown  = new Material( Color( .5, .5, .3, 1 ), .2, 1,  1, 40 );
        var orange = new Material( Color( 1, 0.64, 0, 1 ), .2, 1,  1, 40 );
        var color  = new Material( Color( .2, .4, .5, 1 ), .2, 1,  1, 40 );

        var hello  = new Material( Color( .2,.4,.5,1 ), .4, .4, .8, 40 );


        // Front wall
        model_transform = mult( model_transform, translation( 0, 0, -200 ) );
        model_transform = mult( model_transform, scale( 250,125,10 ) );
        shapes_in_use.square.draw( this.graphics_state, model_transform, hello );

        // Back wall
        model_transform = mult( model_transform, translation( 0, 0, 50 ) );
        shapes_in_use.square.draw( this.graphics_state, model_transform, color );


        model_transform = mult( model_transform, translation( 0, 0, -100 ) );
        model_transform = mult( model_transform, rotation( 90, 0, 0, 0 ) );
        //shapes_in_use.square.draw( this.graphics_state, model_transform, hello );

        // Bottom
        model_transform = mat4();
        model_transform = mult( model_transform, translation( 0, -50, 0 ) );
        model_transform = mult( model_transform, scale( 250,0,300 ) );
        model_transform = mult( model_transform, rotation( 90, 90, 0, 0 ) );
        shapes_in_use.square.draw( this.graphics_state, model_transform, hello );

        // Top
        model_transform = mat4();
        model_transform = mult( model_transform, translation( 0, 125, 0 ) );
        model_transform = mult( model_transform, scale( 250,0,300 ) );
        model_transform = mult( model_transform, rotation( 90, 90, 0, 0 ) );
        shapes_in_use.square.draw( this.graphics_state, model_transform, hello );



      }
  }, Animation );
