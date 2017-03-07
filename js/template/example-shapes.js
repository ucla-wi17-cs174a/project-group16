// UCLA's Graphics Example Code (Javascript and C++ translations available), by Garett Ridge for CS174a.
// example_shapes.js is where you can define a number of objects that inherit from class Shape.  All Shapes have certain arrays.  These each manage either
// the shape's 3D vertex positions, 3D vertex normal vectors, 2D texture coordinates, or any other per-vertex quantity.  All subclasses of Shape inherit
// instantiation, any Shape subclass populates these lists in their own way, so we can use GL calls -- special kernel functions to copy each of the lists
// one-to-one into new buffers in the graphics card's memory.

// 1.  Some example simple primitives -- really easy shapes are at the beginning of the list just to demonstrate how Shape is used. Mimic these when
//                        making your own Shapes.  You'll find it to be much easier to work with than raw GL vertex arrays managed on your own.
//     Tutorial shapes:   Triangle, Square, Tetrahedron, Windmill,
//
// 2.  More difficult primitives*:  Surface_of_Revolution, Regular_2D_Polygon, Cylindrical_Tube, Cone_Tip, Torus, Sphere, Subdivision_Sphere,
//                                 OBJ file (loaded using the library webgl-obj-loader.js )
//        *I'll give out the code for these later.
// 3.  Example compound shapes*:    Closed_Cone, Capped_Cylinder, Cube, Axis_Arrows, Text_Line
//        *I'll give out the code for these later.  Except for Text_Line, which you can already have below.
// *******************************************************

// 1.  TUTORIAL SHAPES:     ------------------------------------------------------------------------------------------------------------------------------

// *********** TRIANGLE ***********
Declare_Any_Class( "Triangle",    // First, the simplest possible Shape – one triangle.  It has 3 vertices, each having their own 3D position, normal
  { 'populate': function()        // vector, and texture-space coordinate.
      {
         this.positions      = [ vec3(0,0,0), vec3(1,0,0), vec3(0,1,0) ];   // Specify the 3 vertices -- the point cloud that our Triangle needs.
         this.normals        = [ vec3(0,0,1), vec3(0,0,1), vec3(0,0,1) ];   // ...
         this.texture_coords = [ vec2(0,0),   vec2(1,0),   vec2(0,1)   ];   // ...
         this.indices        = [ 0, 1, 2 ];                                 // Index into our vertices to connect them into a whole Triangle.
      }
  }, Shape )

// *********** SQUARE ***********
Declare_Any_Class( "Square",    // A square, demonstrating shared vertices.  On any planar surface, the interior edges don't make any important seams.
  { 'populate': function()      // In these cases there's no reason not to re-use values of the common vertices between triangles.  This makes all the
      {                         // vertex arrays (position, normals, etc) smaller and more cache friendly.
         this.positions     .push( vec3(-1,-1,0), vec3(1,-1,0), vec3(-1,1,0), vec3(1,1,0) ); // Specify the 4 vertices -- the point cloud that our Square needs.
         this.normals       .push( vec3(0,0,1), vec3(0,0,1), vec3(0,0,1), vec3(0,0,1) );     // ...
         this.texture_coords.push( vec2(0,0),   vec2(1,0),   vec2(0,1),   vec2(1,1)   );     // ...
         this.indices       .push( 0, 1, 2,     1, 3, 2 );                                   // Two triangles this time, indexing into four distinct vertices.
      }
  }, Shape )

// *********** TETRAHEDRON ***********
Declare_Any_Class( "Tetrahedron",              // A demo of flat vs smooth shading.  Also our first 3D, non-planar shape.
  { 'populate': function( using_flat_shading ) // Takes a boolean argument
      {
        var a = 1/Math.sqrt(3);

        if( !using_flat_shading )                                                 // Method 1:  A tetrahedron with shared vertices.  Compact, performs
        {                                                                 // better, but can't produce flat shading or discontinuous seams in textures.
            this.positions     .push( vec3(0,0,0),    vec3(1,0,0), vec3(0,1,0), vec3(0,0,1) );
            this.normals       .push( vec3(-a,-a,-a), vec3(1,0,0), vec3(0,1,0), vec3(0,0,1) );
            this.texture_coords.push( vec2(0,0),      vec2(1,0),   vec2(0,1),   vec2(1,1)   );
            this.indices.push( 0, 1, 2,   0, 1, 3,   0, 2, 3,    1, 2, 3 );                     // Vertices are shared multiple times with this method.
        }
        else
        { this.positions.push( vec3(0,0,0), vec3(1,0,0), vec3(0,1,0) );         // Method 2:  A tetrahedron with four independent triangles.
          this.positions.push( vec3(0,0,0), vec3(1,0,0), vec3(0,0,1) );
          this.positions.push( vec3(0,0,0), vec3(0,1,0), vec3(0,0,1) );
          this.positions.push( vec3(0,0,1), vec3(1,0,0), vec3(0,1,0) );

          this.normals.push( vec3(0,0,-1), vec3(0,0,-1), vec3(0,0,-1) );           // Here's where you can tell Method 2 is flat shaded, since
          this.normals.push( vec3(0,-1,0), vec3(0,-1,0), vec3(0,-1,0) );           // each triangle gets a single unique normal value.
          this.normals.push( vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0) );
          this.normals.push( vec3( a,a,a), vec3( a,a,a), vec3( a,a,a) );

          this.texture_coords.push( vec3(0,0,0), vec3(1,0,0), vec3(0,1,0) );    // Each face in Method 2 also gets its own set of texture coords
          this.texture_coords.push( vec3(0,0,0), vec3(1,0,0), vec3(0,1,0) );    //(half the image is mapped onto each face).  We couldn't do this
          this.texture_coords.push( vec3(0,0,0), vec3(1,0,0), vec3(0,1,0) );    // with shared vertices -- after all, it involves different results
          this.texture_coords.push( vec3(0,0,0), vec3(1,0,0), vec3(0,1,0) );    // when approaching the same point from different directions.

          this.indices.push( 0, 1, 2,    3, 4, 5,    6, 7, 8,    9, 10, 11 );      // Notice all vertices are unique this time.
        }
      }
  }, Shape )

// *********** WINDMILL ***********
Declare_Any_Class( "Windmill",          // As our shapes get more complicated, we begin using matrices and flow control (including loops) to
  { 'populate': function( num_blades )  // generate non-trivial point clouds and connect them.
      {
          for( var i = 0; i < num_blades; i++ )     // A loop to automatically generate the triangles.
          {
              var spin = rotation( i * 360/num_blades, 0, 1, 0 );             // Rotate around a few degrees in XZ plane to place each new point.
              var newPoint  = mult_vec( spin, vec4( 1, 0, 0, 1 ) );           // Apply that XZ rotation matrix to point (1,0,0) of the base triangle.
              this.positions.push( vec3( newPoint[0], 0, newPoint[2] ) );     // Store this XZ position.  This is point 1.
              this.positions.push( vec3( newPoint[0], 1, newPoint[2] ) );     // Store it again but with higher y coord:  This is point 2.
              this.positions.push( vec3( 0, 0, 0 ) );                         // All triangles touch this location.  This is point 3.

              var newNormal = mult_vec( spin, vec4( 0, 0, 1, 0 ) );           // Rotate our base triangle's normal (0,0,1) to get the new one.  Careful!
              this.normals.push( newNormal.slice(0,3) );                      // Normal vectors are not points; their perpendicularity constraint gives them
              this.normals.push( newNormal.slice(0,3) );                      // a mathematical quirk that when applying matrices you have to apply the
              this.normals.push( newNormal.slice(0,3) );                      // transposed inverse of that matrix instead.  But right now we've got a pure
                                                                              // rotation matrix, where the inverse and transpose operations cancel out.
              this.texture_coords.push( vec2( 0, 0 ) );
              this.texture_coords.push( vec2( 0, 1 ) );                       // Repeat the same arbitrary texture coords for each fan blade.
              this.texture_coords.push( vec2( 1, 0 ) );
              this.indices.push ( 3 * i );     this.indices.push ( 3 * i + 1 );        this.indices.push ( 3 * i + 2 ); // Procedurally connect the three
          }                                                                                                             // new vertices into triangles.
      }
  }, Shape )

// 3.  COMPOUND SHAPES, BUILT FROM THE ABOVE HELPER SHAPES      ------------------------------------------------------------------------------------------

Declare_Any_Class( "Text_Line", // Draws a rectangle textured with images of ASCII characters textured over each quad, spelling out a string.
  { 'populate': function( max_size )    // Each quad is a separate rectangle_strip.
      { this.max_size = max_size;
        var object_transform = mat4();
        for( var i = 0; i < max_size; i++ )
        {
          Square.prototype.insert_transformed_copy_into( this, [], object_transform );
          object_transform = mult( object_transform, translation( 1.5, 0, 0 ));
        }
      },
    'draw': function( graphics_state, model_transform, heads_up_display, color )
      { if( heads_up_display )      { gl.disable( gl.DEPTH_TEST );  }
        Shape.prototype.draw.call(this, graphics_state, model_transform, new Material( color, 1, 0, 0, 40, "text.png" ) );
        if( heads_up_display )      { gl.enable(  gl.DEPTH_TEST );  }
      },
    'set_string': function( line )
      { for( var i = 0; i < this.max_size; i++ )
          {
            var row = Math.floor( ( i < line.length ? line.charCodeAt( i ) : ' '.charCodeAt() ) / 16 ),
                col = Math.floor( ( i < line.length ? line.charCodeAt( i ) : ' '.charCodeAt() ) % 16 );

            var skip = 3, size = 32, sizefloor = size - skip;
            var dim = size * 16,  left  = (col * size + skip) / dim,      top    = (row * size + skip) / dim,
                                  right = (col * size + sizefloor) / dim, bottom = (row * size + sizefloor + 5) / dim;

            this.texture_coords[ 4 * i ]     = vec2( left,  1 - bottom );
            this.texture_coords[ 4 * i + 1 ] = vec2( right, 1 - bottom );
            this.texture_coords[ 4 * i + 2 ] = vec2( left,  1 - top );
            this.texture_coords[ 4 * i + 3 ] = vec2( right, 1 - top );
          }
        gl.bindBuffer( gl.ARRAY_BUFFER, this.graphics_card_buffers[2] );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.texture_coords), gl.STATIC_DRAW );
      }
  }, Shape )