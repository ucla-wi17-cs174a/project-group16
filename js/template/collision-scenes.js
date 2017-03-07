Declare_Any_Class( "Body",
{ 'construct'(s) { this.randomize(s); },
  'randomize'(s)
    { this.define_data_members( { shape: s, scale: [1, 1+Math.random(), 1],
                                  location_matrix: mult( rotation( 360 * Math.random(), random_vec3(1) ), translation( random_vec3(10) ) ),
                                  linear_velocity: random_vec3(.1),
                                  angular_velocity: .5*Math.random(), spin_axis: random_vec3(1),
                                  material: new Material( Color( 1,Math.random(),Math.random(),1 ), .1, 1, 1, 40, "stars.png" ) } )
    },
  'advance'( b, time_amount )   // Do one timestep.
    { var delta = translation( scale_vec( time_amount, b.linear_velocity ) );  // Move proportionally to real time.
      b.location_matrix = mult( delta, b.location_matrix );                    // Apply translation velocity - pre-multiply to keep translations together

      delta = rotation( time_amount * b.angular_velocity, b.spin_axis );       // Move proportionally to real time.
      b.location_matrix = mult( b.location_matrix, delta );                    // Apply angular velocity - post-multiply to keep rotations together
    },
  'check_if_colliding'( b, a_inv, shape )   // Collision detection function
    { if ( this == b ) return false;        // Nothing collides with itself
      var T = mult( a_inv, mult( b.location_matrix, scale( b.scale ) ) );  // Convert sphere b to a coordinate frame where a is a unit sphere
      for( let p of shape.positions )                                      // For each vertex in that b,
      { var Tp = mult_vec( T, p.concat(1).slice(0,3) );                    // Apply a_inv*b coordinate frame shift
        if( dot( Tp, Tp ) < 1.2 )   return true;     // Check if in that coordinate frame it penetrates the unit sphere at the origin.
      }
      return false;
    }
});

Declare_Any_Class( "Simulation_Scene_Superclass",
{ 'construct'( context )
    { context.shared_scratchpad.animate = true;
      this.define_data_members({ graphics_state: context.shared_scratchpad.graphics_state, bodies: [] });
      this.newest_shapes = { "donut"       : new Torus( 15, 15 ),
                             "cone"        : new Closed_Cone( 10, 10 ),
                             "capped"      : new Capped_Cylinder( 4, 12 ),
                             "axis"        : new Axis_Arrows(),
                             "prism"       :     Capped_Cylinder   .prototype.auto_flat_shaded_version( 10, 10 ),
                             "gem"         :     Subdivision_Sphere.prototype.auto_flat_shaded_version( 2 ),
                             "gem2"        :     Torus             .prototype.auto_flat_shaded_version( 20, 20 ) };

      Object.assign( shapes_in_use, this.newest_shapes );    // This appends newest_shapes onto shapes_in_use
    },
  'random_shape'() { return Object.values(this.newest_shapes)[ Math.floor( 7*Math.random() ) ] },
  'display'(time)
    { shaders_in_use[ "Default" ].activate();
      this.graphics_state.lights = [ new Light( vec4(5,1,1,0), Color( 1, 1, 1, 1 ), 10000 ) ];

      if( Math.random() < .02 ) this.bodies.splice( 0, this.bodies.length/4 ); // Sometimes we delete some so they can re-generate as new ones
      for( let b of this.bodies )
      { b.shape.draw( this.graphics_state, mult( b.location_matrix, scale( b.scale ) ), b.material ); // Draw each shape at its current location
        b.advance( b, this.graphics_state.animation_delta_time );
      }
      this.simulate();    // This is an abstract class; call the subclass's version
    },
}, Animation );

Declare_Any_Class( "Ground_Collision_Scene",    // Scenario 1: Let random initial momentums carry bodies until they fall and bounce.
{ 'simulate'()
    { while( this.bodies.length < 100 )   this.bodies.push( new Body(this.random_shape()) );     // Generate moving bodies
      for( let b of this.bodies )
      { b.linear_velocity[1] += .0001 * -9.8;       // Gravity.
        if( b.location_matrix[1][3] < -4 && b.linear_velocity[1] < 0 ) b.linear_velocity[1] *= -.8;   // If about to fall through floor, reverse y velocity.
      }
    }
}, Simulation_Scene_Superclass );

Declare_Any_Class( "Object_Collision_Scene",    // Scenario 2: Detect when the flying objects collide with one another, coloring them red.
{ 'simulate'(time)
    { if   ( this.bodies.length > 20 )       this.bodies = this.bodies.splice( 0, 20 );                 // Max of 20 bodies
      while( this.bodies.length < 20 )       this.bodies.push( new Body(this.random_shape()) );         // Generate moving bodies

      if( ! this.collider ) this.collider = new Subdivision_Sphere(1);      // The collision shape should be simple

      for( let b of this.bodies )
      { var b_inv = inverse( mult( b.location_matrix, scale( b.scale ) ) );               // Cache b's final transform

        var center = mult_vec( b.location_matrix, vec4( 0, 0, 0, 1 ) ).slice(0,3);        // Center of the body
        b.linear_velocity = subtract( b.linear_velocity, scale_vec( .0003, center ) );    // Apply a small centripetal force to everything
        b.material = new Material( Color( 1,1,1,1 ), .1, 1, 1, 40 );                      // Default color: white

        for( let c of this.bodies )                                      // Collision process starts here
          if( b.check_if_colliding( c, b_inv, this.collider ) )          // Send the two bodies and the collision shape
          { b.material = new Material( Color( 1,0,0,1 ), .1, 1, 1, 40 ); // If we get here, we collided, so turn red
            b.linear_velocity  = vec3();                                 // Zero out the velocity so they don't inter-penetrate more
            b.angular_velocity = 0;
          }
      }
    }
}, Simulation_Scene_Superclass );

var random_vec3 = (scale) => vec3().map(() => scale*(Math.random()-.5) );
