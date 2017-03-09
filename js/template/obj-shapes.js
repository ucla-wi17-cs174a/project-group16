// This is adapted from Garett's code for the old template.  Hopefully this works.
// http://web.cs.ucla.edu/~garett/collide/Custom_Shapes.js

// *********** Shape From File ***********
Declare_Any_Class( "Shape_From_File",  
  { 'populate': function(filename, points_transform=[1,1,1])        
      {
          this.filename = filename;     this.points_transform = points_transform;
           // Begin downloading the mesh, and once it completes return control to our webGLStart function

          this.webGLStart = function (meshes)
          {
            for (var j = 0; j < meshes.mesh.vertices.length / 3; j++) {
              this.positions.push(vec3(meshes.mesh.vertices[3 * j], meshes.mesh.vertices[3 * j + 1], meshes.mesh.vertices[3 * j + 2]));

              this.normals.push(vec3(meshes.mesh.vertexNormals[3 * j], meshes.mesh.vertexNormals[3 * j + 1], meshes.mesh.vertexNormals[3 * j + 2]));
              this.texture_coords.push(vec2(meshes.mesh.textures[2 * j], meshes.mesh.textures[2 * j + 1]));
            }
            this.indices = meshes.mesh.indices;
            
            // Don't use this code. If you want to scale just use the model transform!
            // I'll try to get this to work later
            /*
            for (var i = 0; i < this.positions.length; i++) // Apply points_transform to all points added during this call
            {
              this.positions[i] = vec3(mult_vec(this.points_transform, vec4(this.positions[i], 1)));
              this.normals[i] = vec3(mult_vec(transpose(inverse(this.points_transform)), vec4(this.normals[i], 1)));
            }*/


            Shape.prototype.copy_onto_graphics_card.call(this);
            this.ready = true;

          }

          var fcn = this.webGLStart;

          OBJ.downloadMeshes({
            'mesh': filename 
          }, (function(self) {
            return fcn.bind(self)
          }(this)));
      },                                    
      'draw': function( graphics_state, model_transform, material )
      { 
        if( this.ready )
        {
          Shape.prototype.draw.call(this, graphics_state, model_transform, material);
        }
      }

  }, Shape )
