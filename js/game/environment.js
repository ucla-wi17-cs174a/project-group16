var main_menu = true;

Declare_Any_Class( "Environment",
  { 'construct': function( context )
      { this.graphics_state  = context.shared_scratchpad.graphics_state;

        shapes_in_use.square = new Square();
      },
    'init_keys': function( controls )   // init_keys():  Define any extra keyboard shortcuts here
        {
          controls.add( "Enter", this, function() { main_menu = false;  } );
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
        var sign = new Material( Color( 0,0,0,1 ), .7, .4, .4, 40, "img/press.png" );

        // Front wall
        model_transform = mult( model_transform, translation( 0, 0, -150 ) );
        model_transform = mult( model_transform, scale( 250,125,10 ) );
        shapes_in_use.square.draw( this.graphics_state, model_transform, hello );

        // Back wall
        model_transform = mat4();
        model_transform = mult( model_transform, scale( 250,125,10 ) );
        model_transform = mult( model_transform, translation( 0, 0, 25 ) );
        shapes_in_use.square.draw( this.graphics_state, model_transform, color );

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

        //start sign
        if(main_menu) {
          model_transform = mat4();
          model_transform = mult( model_transform, translation( 0, 10, -50 ) );
          model_transform = mult( model_transform, scale( 17,17,0 ) );
          shapes_in_use.square.draw( this.graphics_state, model_transform, sign );
          model_transform = mat4();
          model_transform = mult( model_transform, translation( 0, 10, -49 ) );
          model_transform = mult( model_transform, scale( 17,3,0 ) );
          //shapes_in_use.square.draw( this.graphics_state, model_transform, hello );
        }

      }
  }, Animation );
