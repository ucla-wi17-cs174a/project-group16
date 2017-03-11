var player_score = 0;
var player_size = 1;

Declare_Any_Class( "Fish_Scene",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.graphics_state  = context.shared_scratchpad.graphics_state;

        shapes_in_use.fish    = new Shape_From_File( "model/Fish3.obj", scale( 1, 1, 1 ) );
      },
    'display': function(time)
      {
        shaders_in_use[ "Bump Map" ].activate();

        var model_transform = mat4();

        var fish_body_yellow = new Material( Color(  1,  1, .3, 1 ), .2, 1, .3, 10, "img/fishScales.jpg" );

        model_transform = mult( model_transform, inverse(this.graphics_state.camera_transform));
        model_transform = mult( model_transform, translation( 0, -2, -20 ) );
        model_transform = mult( model_transform, rotation( 180, 0, 1, 0 ) );
        model_transform = mult( model_transform, scale( player_size, player_size, player_size) );

        shapes_in_use.fish.draw( this.graphics_state, model_transform, fish_body_yellow);
      }
  }, Animation );
