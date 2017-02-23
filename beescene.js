Declare_Any_Class( "Bee_Scene",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.graphics_state  = context.shared_scratchpad.graphics_state;
      
        shapes_in_use[ "box"  ] = new Cube();
        shapes_in_use[ "ball" ] = new Sphere( 10, 10 );
      },
    'display': function(time)
      {
        var model_transform = mat4();
        
        shaders_in_use[ "Default" ].activate();
        this.graphics_state.lights = [ new Light( vec4(  3,  2,  1, 1 ), Color( 1, 0, 0, 1 ), 100000000 ),
                                       new Light( vec4( -1, -2, -3, 1 ), Color( 0, 1, 0, 1 ), 100000000 ) ];
        var yellow_clay = new Material( Color(  1,  1, .3, 1 ), .2, 1, .7, 40 ),
            brown_clay  = new Material( Color( .5, .5, .3, 1 ), .2, 1,  1, 40 );
        
        model_transform = mult(model_transform, rotation( -.04 * this.graphics_state.animation_time, 0, 1, 0));
        model_transform = mult(model_transform, translation(15, 5, 0));
        model_transform = mult(model_transform, rotation(90, 0, 1, 0));
        
        var bodyCenter = model_transform;
        
        model_transform = mult(model_transform, scale(3, 1, 1));
        shapes_in_use.box.draw( this.graphics_state, model_transform, brown_clay);
        
        model_transform = bodyCenter;
        
        model_transform = mult(model_transform, translation(6, 0, 0));
        model_transform = mult(model_transform, scale(3, 2, 2));
        shapes_in_use.ball.draw( this.graphics_state, model_transform, yellow_clay);
        
        model_transform = bodyCenter;
        
        model_transform = mult(model_transform, translation(-4, 0, 0));
        model_transform = mult(model_transform, scale(1, 1, 1));
        shapes_in_use.ball.draw( this.graphics_state, model_transform, yellow_clay);
        
        for(var i = 0; i < 2; i++){
          model_transform = bodyCenter;
          
          model_transform = mult(model_transform, translation(0, 1, 1 * Math.pow(-1, i)));
          model_transform = mult(model_transform, rotation(70 * Math.pow(-1, i) * 
                Math.sin( this.graphics_state.animation_time/700), 1, 0, 0));
          model_transform = mult(model_transform, translation(0, .2, 2 * Math.pow(-1, i)));
          model_transform = mult(model_transform, scale(1, .2, 2));
          shapes_in_use.box.draw( this.graphics_state, model_transform, yellow_clay); 
        }
        
        for(var o = 0; o < 3; o++){
          for(var i = -1; i < 2; i++){
            model_transform = bodyCenter;
            model_transform = mult(model_transform, translation(0, -1, 1*Math.pow(-1, o)));       //upper legs
            model_transform = mult(model_transform, rotation((5*Math.pow(-1, o) * 
                          Math.sin( this.graphics_state.animation_time/700 ) ), 1, 0, 0));
            model_transform = mult(model_transform, translation(i, -1, .25 * Math.pow(-1, o)));
            model_transform = mult(model_transform, scale(.25, 1, .25));
            shapes_in_use.box.draw( this.graphics_state, model_transform, yellow_clay);
            
            model_transform = mult(model_transform, scale(4, 1, 4));                              //lower legs
            model_transform = mult(model_transform, translation(0, -1, -.25 * Math.pow(-1, o)));
            model_transform = mult(model_transform, rotation((5*Math.pow(-1, o) * 
                          Math.sin( this.graphics_state.animation_time/700 ) ), 1, 0, 0));
            model_transform = mult(model_transform, translation(0, -1, .25 * Math.pow(-1, o)));
            model_transform = mult(model_transform, scale(.25, 1, .25));
            shapes_in_use.box.draw( this.graphics_state, model_transform, brown_clay);
          }
        }
      }
  }, Animation );