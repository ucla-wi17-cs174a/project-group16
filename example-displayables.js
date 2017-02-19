// UCLA's Graphics Example Code (Javascript and C++ translations available), by Garett Ridge for CS174a.
// example-displayables.js - The subclass definitions here each describe different independent animation processes that you want to fire off each frame, by defining a display
// event and how to react to key and mouse input events.  Make one or two of your own subclasses, and fill them in with all your shape drawing calls and any extra key / mouse controls.

// Now go down to Example_Animation's display() function to see where the sample shapes you see drawn are coded, and a good place to begin filling in your own code.

Declare_Any_Class( "Debug_Screen",  // Debug_Screen - An example of a displayable object that our class Canvas_Manager can manage.  Displays a text user interface.
  { 'construct': function( context )
      { this.define_data_members( { string_map: context.shared_scratchpad.string_map, start_index: 0, tick: 0, visible: false, graphicsState: new Graphics_State() } );
        shapes_in_use.debug_text = new Text_Line( 35 );
      },
    'init_keys': function( controls )
      { controls.add( "t",    this, function() { this.visible ^= 1;                                                                                                             } );
        controls.add( "up",   this, function() { this.start_index = ( this.start_index + 1 ) % Object.keys( this.string_map ).length;                                           } );
        controls.add( "down", this, function() { this.start_index = ( this.start_index - 1   + Object.keys( this.string_map ).length ) % Object.keys( this.string_map ).length; } );
        this.controls = controls;
      },
    'update_strings': function( debug_screen_object )   // Strings that this displayable object (Debug_Screen) contributes to the UI:
      { debug_screen_object.string_map["tick"]              = "Frame: " + this.tick++;
        debug_screen_object.string_map["text_scroll_index"] = "Text scroll index: " + this.start_index;
      },
    'display': function( time )
      { if( !this.visible ) return;

        shaders_in_use["Default"].activate();
        gl.uniform4fv( g_addrs.shapeColor_loc, Color( .8, .8, .8, 1 ) );

        var font_scale = scale( .02, .04, 1 ),
            model_transform = mult( translation( -.95, -.9, 0 ), font_scale ),
            strings = Object.keys( this.string_map );

        for( var i = 0, idx = this.start_index; i < 4 && i < strings.length; i++, idx = (idx + 1) % strings.length )
        {
          shapes_in_use.debug_text.set_string( this.string_map[ strings[idx] ] );
          shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );  // Draw some UI text (strings)
          model_transform = mult( translation( 0, .08, 0 ), model_transform );
        }
        model_transform = mult( translation( .7, .9, 0 ), font_scale );
        shapes_in_use.debug_text.set_string( "Controls:" );
        shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );    // Draw some UI text (controls title)

        for( let k of Object.keys( this.controls.all_shortcuts ) )
        {
          model_transform = mult( translation( 0, -0.08, 0 ), model_transform );
          shapes_in_use.debug_text.set_string( k );
          shapes_in_use.debug_text.draw( this.graphicsState, model_transform, true, vec4(0,0,0,1) );  // Draw some UI text (controls)
        }
      }
  }, Animation );

Declare_Any_Class( "Example_Camera",     // An example of a displayable object that our class Canvas_Manager can manage.  Adds both first-person and
  { 'construct': function( context )     // third-person style camera matrix controls to the canvas.
      { // 1st parameter below is our starting camera matrix.  2nd is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
        context.shared_scratchpad.graphics_state = new Graphics_State( translation(0, 0,-25), perspective(45, canvas.width/canvas.height, .1, 1000), 0 );
        this.define_data_members( { graphics_state: context.shared_scratchpad.graphics_state, thrust: vec3(), origin: vec3( 0, 5, 0 ), looking: false } );

        // *** Mouse controls: ***
        this.mouse = { "from_center": vec2() };
        var mouse_position = function( e ) { return vec2( e.clientX - canvas.width/2, e.clientY - canvas.height/2 ); };   // Measure mouse steering, for rotating the flyaround camera.
        canvas.addEventListener( "mouseup",   ( function(self) { return function(e) { e = e || window.event;    self.mouse.anchor = undefined;              } } ) (this), false );
        canvas.addEventListener( "mousedown", ( function(self) { return function(e) { e = e || window.event;    self.mouse.anchor = mouse_position(e);      } } ) (this), false );
        canvas.addEventListener( "mousemove", ( function(self) { return function(e) { e = e || window.event;    self.mouse.from_center = mouse_position(e); } } ) (this), false );
        canvas.addEventListener( "mouseout",  ( function(self) { return function(e) { self.mouse.from_center = vec2(); }; } ) (this), false );    // Stop steering if the mouse leaves the canvas.
      },
    'init_keys': function( controls )   // init_keys():  Define any extra keyboard shortcuts here
      { controls.add( "Space", this, function() { this.thrust[1] = -1; } );     controls.add( "Space", this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "z",     this, function() { this.thrust[1] =  1; } );     controls.add( "z",     this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "w",     this, function() { this.thrust[2] =  1; } );     controls.add( "w",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "a",     this, function() { this.thrust[0] =  1; } );     controls.add( "a",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( "s",     this, function() { this.thrust[2] = -1; } );     controls.add( "s",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "d",     this, function() { this.thrust[0] = -1; } );     controls.add( "d",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( "f",     this, function() { this.looking  ^=  1; } );
        controls.add( ",",     this, function() { this.graphics_state.camera_transform = mult( rotation( 6, 0, 0,  1 ), this.graphics_state.camera_transform ); } );
        controls.add( ".",     this, function() { this.graphics_state.camera_transform = mult( rotation( 6, 0, 0, -1 ), this.graphics_state.camera_transform ); } );
        controls.add( "o",     this, function() { this.origin = mult_vec( inverse( this.graphics_state.camera_transform ), vec4(0,0,0,1) ).slice(0,3)         ; } );
        controls.add( "r",     this, function() { this.graphics_state.camera_transform = mat4()                                                               ; } );
      },
    'update_strings': function( user_interface_string_manager )       // Strings that this displayable object (Animation) contributes to the UI:
      { var C_inv = inverse( this.graphics_state.camera_transform ), pos = mult_vec( C_inv, vec4( 0, 0, 0, 1 ) ),
                                                                  z_axis = mult_vec( C_inv, vec4( 0, 0, 1, 0 ) );                                                                 
        user_interface_string_manager.string_map["origin" ] = "Center of rotation: " + this.origin[0].toFixed(0) + ", " + this.origin[1].toFixed(0) + ", " + this.origin[2].toFixed(0);                                                       
        user_interface_string_manager.string_map["cam_pos"] = "Cam Position: " + pos[0].toFixed(2) + ", " + pos[1].toFixed(2) + ", " + pos[2].toFixed(2);    // The below is affected by left hand rule:
        user_interface_string_manager.string_map["facing" ] = "Facing: "       + ( ( z_axis[0] > 0 ? "West " : "East ") + ( z_axis[1] > 0 ? "Down " : "Up " ) + ( z_axis[2] > 0 ? "North" : "South" ) );
      },
    'display': function( time )
      { var leeway = 70,  degrees_per_frame = .0004 * this.graphics_state.animation_delta_time,
                          meters_per_frame  =   .01 * this.graphics_state.animation_delta_time;
        // Third-person camera mode: Is a mouse drag occurring?
        if( this.mouse.anchor )
        {
          var dragging_vector = subtract( this.mouse.from_center, this.mouse.anchor );            // Arcball camera: Spin the scene around the world origin on a user-determined axis.
          if( length( dragging_vector ) > 0 )
            this.graphics_state.camera_transform = mult( this.graphics_state.camera_transform,    // Post-multiply so we rotate the scene instead of the camera.
                mult( translation( this.origin ),
                mult( rotation( .05 * length( dragging_vector ), dragging_vector[1], dragging_vector[0], 0 ),
                      translation(scale_vec( -1, this.origin ) ) ) ) );
        }
        // First-person flyaround mode:  Determine camera rotation movement when the mouse is past a minimum distance (leeway) from the canvas's center.
        var offset_plus  = [ this.mouse.from_center[0] + leeway, this.mouse.from_center[1] + leeway ];
        var offset_minus = [ this.mouse.from_center[0] - leeway, this.mouse.from_center[1] - leeway ];

        for( var i = 0; this.looking && i < 2; i++ )      // Steer according to "mouse_from_center" vector, but don't start increasing until outside a leeway window from the center.
        {
          var velocity = ( ( offset_minus[i] > 0 && offset_minus[i] ) || ( offset_plus[i] < 0 && offset_plus[i] ) ) * degrees_per_frame;  // Use movement's quantity unless the &&'s zero it out
          this.graphics_state.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), this.graphics_state.camera_transform );     // On X step, rotate around Y axis, and vice versa.
        }     // Now apply translation movement of the camera, in the newest local coordinate frame
        this.graphics_state.camera_transform = mult( translation( scale_vec( meters_per_frame, this.thrust ) ), this.graphics_state.camera_transform );
      }
  }, Animation );

Declare_Any_Class( "Example_Animation",  // An example of a displayable object that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct': function( context )
      { this.shared_scratchpad    = context.shared_scratchpad;
      
        shapes_in_use.triangle        = new Triangle();                  // At the beginning of our program, instantiate all shapes we plan to use,
        shapes_in_use.strip           = new Square();                   // each with only one instance in the graphics card's memory.
        shapes_in_use.bad_tetrahedron = new Tetrahedron( false );      // For example we'll only create one "cube" blueprint in the GPU, but we'll re-use
        shapes_in_use.tetrahedron     = new Tetrahedron( true );      // it many times per call to display to get multiple cubes in the scene.
        shapes_in_use.windmill        = new Windmill( 10 );
        
        shapes_in_use.triangle_flat        = Triangle.prototype.auto_flat_shaded_version();
        shapes_in_use.strip_flat           = Square.prototype.auto_flat_shaded_version();
        shapes_in_use.bad_tetrahedron_flat = Tetrahedron.prototype.auto_flat_shaded_version( false );
        shapes_in_use.tetrahedron_flat          = Tetrahedron.prototype.auto_flat_shaded_version( true );
        shapes_in_use.windmill_flat             = Windmill.prototype.auto_flat_shaded_version( 10 );
      },
    'init_keys': function( controls )   // init_keys():  Define any extra keyboard shortcuts here
      {
        controls.add( "ALT+g", this, function() { this.shared_scratchpad.graphics_state.gouraud       ^= 1; } );   // Make the keyboard toggle some
        controls.add( "ALT+n", this, function() { this.shared_scratchpad.graphics_state.color_normals ^= 1; } );   // GPU flags on and off.
        controls.add( "ALT+a", this, function() { this.shared_scratchpad.animate                      ^= 1; } );
      },
    'update_strings': function( user_interface_string_manager )       // Strings that this displayable object (Animation) contributes to the UI:
      {
        user_interface_string_manager.string_map["time"]    = "Animation Time: " + Math.round( this.shared_scratchpad.graphics_state.animation_time )/1000 + "s";
        user_interface_string_manager.string_map["animate"] = "Animation " + (this.shared_scratchpad.animate ? "on" : "off") ;
      },
    'display': function(time)
      {
        var graphics_state  = this.shared_scratchpad.graphics_state,
            model_transform = mat4();             // We have to reset model_transform every frame, so that as each begins, our basis starts as the identity.
        shaders_in_use[ "Default" ].activate();

        // *** Lights: *** Values of vector or point lights over time.  Arguments to construct a Light(): position or vector (homogeneous coordinates), color, size
        // If you want more than two lights, you're going to need to increase a number in the vertex shader file (index.html).  For some reason this won't work in Firefox.
        graphics_state.lights = [];                    // First clear the light list each frame so we can replace & update lights.

        var t = graphics_state.animation_time/1000, light_orbit = [ Math.cos(t), Math.sin(t) ];
        graphics_state.lights.push( new Light( vec4(  30*light_orbit[0],  30*light_orbit[1],  34*light_orbit[0], 1 ), Color( 0, .4, 0, 1 ), 100000 ) );
        graphics_state.lights.push( new Light( vec4( -10*light_orbit[0], -20*light_orbit[1], -14*light_orbit[0], 0 ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) );

        // *** Materials: *** Declare new ones as temps when needed; they're just cheap wrappers for some numbers.
        // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
        var purplePlastic = new Material( Color( .9,.5,.9,1 ), .4, .4, .8, 40 ), // Omit the final (string) parameter if you want no texture
              greyPlastic = new Material( Color( .5,.5,.5,1 ), .4, .8, .4, 20 ),
              placeHolder = new Material( Color(0,0,0,0), 0,0,0,0, "Blank" );

        /**********************************
        Start coding down here!!!!
        **********************************/                                     // From here on down it's just some example shapes drawn for you -- replace them with your own!

        model_transform = mult( model_transform, translation( 0, 5, 0 ) );
        shapes_in_use.triangle       .draw( graphics_state, model_transform, purplePlastic );

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        shapes_in_use.strip          .draw( graphics_state, model_transform, greyPlastic );

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        shapes_in_use.tetrahedron    .draw( graphics_state, model_transform, purplePlastic );

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        shapes_in_use.bad_tetrahedron.draw( graphics_state, model_transform, greyPlastic );

        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        shapes_in_use.windmill       .draw( graphics_state, mult( model_transform, rotation( .7*graphics_state.animation_time, .1, .8, .1 ) ), purplePlastic );        
        
        shaders_in_use[ "Demo_Shader" ].activate();
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        shapes_in_use.windmill       .draw( graphics_state, model_transform, placeHolder );
      }
  }, Animation );