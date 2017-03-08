// This is adapted from Garett's code for the old template.  Hopefully this works.
// http://web.cs.ucla.edu/~garett/collide/Custom_Shapes.js

// *********** Shape From File ***********
Declare_Any_Class( "Shape_From_File",    // First, the simplest possible Shape – one triangle.  It has 3 vertices, each having their own 3D position, normal
  { 'populate': function(filename, points_transform)        // vector, and texture-space coordinate.
      {
          this.filename = filename;     this.points_transform = points_transform;
          this.meshes = {};
           // Begin downloading the mesh, and once it completes return control to our webGLStart function
          this.positions = [];
          this.ready = false;
          this.normals = [];
          this.texture_coords = [];
          var fcn = this.webGLStart;
          OBJ.downloadMeshes({
            'mesh': filename
          }, (function(self) {
            return fcn.bind(self)
          }(this)));

      },
      'webGLStart' : function(meshes)
      {
        /*this.positions = [];
          this.normals = [];
          this.texture_coords = [];*/
        for (var j = 0; j < meshes.mesh.vertices.length / 3; j++) {
          this.positions.push(vec3(meshes.mesh.vertices[3 * j], meshes.mesh.vertices[3 * j + 1], meshes.mesh.vertices[3 * j + 2]));

          this.normals.push(vec3(meshes.mesh.vertexNormals[3 * j], meshes.mesh.vertexNormals[3 * j + 1], meshes.mesh.vertexNormals[3 * j + 2]));
          this.texture_coords.push(vec2(meshes.mesh.textures[2 * j], meshes.mesh.textures[2 * j + 1]));
        }
        this.indices = meshes.mesh.indices;

        for (var i = 0; i < this.positions.length; i++) // Apply points_transform to all points added during this call
        {
          this.positions[i] = vec3(mult_vec(this.points_transform, vec4(this.positions[i], 1)));
          this.normals[i] = vec3(mult_vec(transpose(inverse(this.points_transform)), vec4(this.normals[i], 1)));
        }

        this.ready = true;

      }  ,                                              
      'draw': function( graphics_state, model_transform, material )
      { 
        if( this.ready )
          Shape.prototype.draw.call(this, graphics_state, model_transform, material);
      },

  }, Shape )
