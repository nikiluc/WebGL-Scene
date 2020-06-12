let camera = new Camera();

//Final Objects
let objRust = [];
let objHouse = [];
let objConcrete = [];
let objCrate = [];
let objFHouse = [];
let objFreight = [];


function myMain(resources) {

    const canvas = document.getElementById('draw_surface');  
    let gl = canvas.getContext('webgl2');
    var shaderProgram = gl.createProgram();

    //Loads shaders externally
    shaderProgram = shaderInit(gl, shaderProgram, resources);

    //Loads images externally
    const htmlImageRust = document.getElementById('rust');
    const htmlImageHouse = document.getElementById('house'); 
    const htmlImageConcrete = document.getElementById('concrete');    
    const htmlImageCrate = document.getElementById('crate');  
    const htmlImageFHouse = document.getElementById('fhouse'); 
    const htmlImageFreight = document.getElementById('freight');     

    //constructs final 3d models
    objRust = loadExternalJSON('./models/rust.json', htmlImageRust, gl);
    objHouse = loadExternalJSON('./models/house_02.json', htmlImageHouse, gl);
    objConcrete = loadExternalJSON('./models/crate.json', htmlImageConcrete, gl);
    objCrate = loadExternalJSON('./models/crate.json', htmlImageCrate, gl);
    objFHouse = loadExternalJSON('./models/farmhouse.json', htmlImageFHouse, gl);
    objFreight = loadExternalJSON('./models/Freigther_BI_Export_3ds.json', htmlImageFreight, gl);

    initWebGL(gl, shaderProgram);


}


/**
 * @function initWebGL - Beginning of drawing process.
 * @param {uri} shaderProgram -- shaderProgram
 * @param {gl} gl
 */
function initWebGL(gl, shaderProgram) {
    
    drawLoop(gl, shaderProgram);
 
}


/**
 * @function makeMesh - Makes a model (mesh) object and returns it. Also initializes buffers.
 * @param {uri} model -- a mesh
 * @param {img} image -- the image to put onto the 3D Model
 * @param {objMaterials} materials - Materials extracted from JSON
 * @param {objAttrib} attributes - Attributes extracted from JSON
 * @param {gl} gl
 */
function makeMesh(model, attributes, materials, image, gl) {

    model.vertices = attributes.vertices;
    model.normals = attributes.normals;
    model.indices = attributes.indexs;
    model.matIndex = attributes.matIndex;
    model.vertexTextureCoords = attributes.textureCoords;


    /*

    model.shadingm = materials.shadingm;
    model.ambient = materials.ambient;
    model.diffuse = materials.diffuse;
    model.specular = materials.specular;
    model.shininess = materials.shininess;

    */


    model.vertexBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.textBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.textImgBuffer = gl.createTexture();


    modelTexture(model, image, gl);

    bindAndBuffer(model, gl);


}

/**
 * @function bindAndBuffer - Binds buffers for this mesh object.
 * @param {uri} mesh -- a mesh
 * @param {gl} gl
 */
function bindAndBuffer(mesh, gl) {

    //Vertex Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);

    //Normal Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);


    //Texture Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexTextureCoords), gl.STATIC_DRAW);

    //Index Buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
        
}

/**
 * @function shaderInit - Initializes shaderProgram and returns it
 * @param {uri} shaderProgram -- shaderProgram
 * @param {gl} gl
 * @param {resources} resources -- Vertex and Fragement shader code
 * */
function shaderInit(gl, shaderProgram, resources){

    let vertCode = resources[0];
    let fragCode = resources[1];


    // Create a vertex shader object
    vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    let success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
    if (!success) {
        console.log('Compiler Error in vertex shader: ', gl.getShaderInfoLog(vertShader));
    }
   
    // Create fragment shader object
    fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    if (!success) {
        console.log('Compiler Error in frag shader: ', gl.getShaderInfoLog(fragShader));
    }

    shaderProgram = gl.createProgram()

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);


    let successFrag = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!successFrag) {
        console.log('Error linking shaders into Program: ', gl.getProgramInfoLog(shaderProgram));
    }
    
    return shaderProgram;


}


/**
 * 
 * @function shadersAndBuffersMesh - Enables attributes
 * @param {uri} shaderProgram -- shaderProgram
 * @param {gl} gl
 * @param {obj} mesh
 */
function shadersAndBuffersMesh(gl, shaderProgram, mesh) {
    /**********************Cube code*****************************/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "v_position");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);


    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    // Get the attribute location
    var normCube = gl.getAttribLocation(shaderProgram, "v_normal");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(normCube, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(normCube);


    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textBuffer);
    mesh.textPositionAttribLocation = gl.getAttribLocation(shaderProgram, "t_coord");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(mesh.textPositionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(mesh.textPositionAttribLocation);


}


/**
 * @function modelTexture - Applies image to the mesh
 * @param {uri} model -- a mesh
 * @param {img} img -- the image to put onto the 3D Model
 * @param {gl} gl
 */
function modelTexture(model, img, gl) {

    gl.bindTexture(gl.TEXTURE_2D, model.textImgBuffer);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);

    //set wrapping modes
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE) //s-axis

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) //t-axis

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.bindTexture(gl.TEXTURE_2D, null);


 }



/**
 * @function drawLoop - A loop to continuously draw the scene
 * @param {uri} shaderProgram -- shaderProgram
 * @param {gl} gl
 */
function drawLoop(gl, shaderProgram){

    let stop
    let angle = 0;
        
        /*
         * Draw Loop
         * This function is what the requestAnimationFrame
         * will call on each browser window update
         * @param {DOMHighResTimeStamp} now 
         * */
    function drawLoop(now){
            
        angle = angle + 0.5;
    
        draw(gl, angle, shaderProgram);
    
            /* Callback */
        stop = requestAnimationFrame(drawLoop)
    }
    
    drawLoop();
        
    }

/**
 * 
 * @function draw - Draw the scene.
 * @param {*} angle 
 * @param {uri} shaderProgram -- shaderProgram
 * @param {gl} gl
 */
function draw(gl, angle, shaderProgram){


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.8, 0.4);
    
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(shaderProgram);

    matrixSetUp(gl, shaderProgram);

    let worldMatrix = glMatrix.mat4.create();
    let modelMatrixLocation = gl.getUniformLocation(shaderProgram, 'modelMatrix');


    for (i = 0; i < objRust.length; i++) {

        bindTexture(gl, shaderProgram, objRust[i]);

        //Rust 1

        let rustModelMatrix = glMatrix.mat4.create();

        glMatrix.mat4.translate(rustModelMatrix, rustModelMatrix, [0, -1.47, -7]);
        glMatrix.mat4.rotate(rustModelMatrix, rustModelMatrix, -1.62,[0.2, 0.0, 0]);    
        glMatrix.mat4.rotate(rustModelMatrix, rustModelMatrix, 3 * Math.PI/180,[0, 1.0, 0]);    
        glMatrix.mat4.scale(rustModelMatrix, rustModelMatrix, [0.00375, 0.00375, 0.00375]);
        glMatrix.mat4.multiply(rustModelMatrix, worldMatrix, rustModelMatrix);

        gl.uniformMatrix4fv(modelMatrixLocation, false, rustModelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objRust[i].indexBuffer);

        gl.drawElements(gl.TRIANGLES, objRust[i].indices.length, gl.UNSIGNED_SHORT, 0);

        //Rust 2

        let rustModelMatrix2 = glMatrix.mat4.create();

        glMatrix.mat4.translate(rustModelMatrix2, rustModelMatrix2, [0, -1.47, -4]);
        glMatrix.mat4.rotate(rustModelMatrix2, rustModelMatrix2, -1.62,[0.2, 0.0, 0]);    
        glMatrix.mat4.rotate(rustModelMatrix2, rustModelMatrix2, 180 * Math.PI/180,[0.0, 0.0, 1.0]);    
        glMatrix.mat4.scale(rustModelMatrix2, rustModelMatrix2, [0.00375, 0.00375, 0.00375]);
        glMatrix.mat4.multiply(rustModelMatrix2, worldMatrix, rustModelMatrix2);
        
        gl.uniformMatrix4fv(modelMatrixLocation, false, rustModelMatrix2);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objRust[i].indexBuffer);
        
        gl.drawElements(gl.TRIANGLES, objRust[i].indices.length, gl.UNSIGNED_SHORT, 0);


    }

    
    for (i = 0; i < objHouse.length; i++) {

        bindTexture(gl, shaderProgram, objHouse[i]);

        //house
        let houseModelMatrix = glMatrix.mat4.create();

        glMatrix.mat4.translate(houseModelMatrix, houseModelMatrix, [0, 0, -10.5]);    
        glMatrix.mat4.rotate(houseModelMatrix, houseModelMatrix, 3 * Math.PI/180,[0, 1.0, 0]);    
        glMatrix.mat4.scale(houseModelMatrix, houseModelMatrix, [0.0175, 0.0175, 0.0175]);
        glMatrix.mat4.multiply(houseModelMatrix, worldMatrix, houseModelMatrix);

        gl.uniformMatrix4fv(modelMatrixLocation, false, houseModelMatrix);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objHouse[i].indexBuffer);

        gl.drawElements(gl.TRIANGLES, objHouse[i].indices.length, gl.UNSIGNED_SHORT, 0);

    
        }


    for (i = 0; i < objConcrete.length; i++) {

        bindTexture(gl, shaderProgram, objConcrete[i]);
    
    
        //concrete
        let concreteModelMatrix = glMatrix.mat4.create();
    
        glMatrix.mat4.translate(concreteModelMatrix, concreteModelMatrix, [0, -1.5, 20]);    
        glMatrix.mat4.rotate(concreteModelMatrix, concreteModelMatrix, 3 * Math.PI/180,[0, 1.0, 0]);    
        glMatrix.mat4.scale(concreteModelMatrix, concreteModelMatrix, [100000, 0.0175, 50]);
        glMatrix.mat4.multiply(concreteModelMatrix, worldMatrix, concreteModelMatrix);
    
        gl.uniformMatrix4fv(modelMatrixLocation, false, concreteModelMatrix);
    
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objConcrete[i].indexBuffer);
    
        gl.drawElements(gl.TRIANGLES, objConcrete[i].indices.length, gl.UNSIGNED_SHORT, 0);
    
        }


    for (i = 0; i < objCrate.length; i++) {

        bindTexture(gl, shaderProgram, objCrate[i]);
    
        //crate
        let crateModelMatrix = glMatrix.mat4.create();
    
        glMatrix.mat4.translate(crateModelMatrix, crateModelMatrix, [-.4, -1, -7]);    
        glMatrix.mat4.rotate(crateModelMatrix, crateModelMatrix, angle * Math.PI/180,[0.0, 0.0, 1.0]);    
        glMatrix.mat4.scale(crateModelMatrix, crateModelMatrix, [0.175, 0.175, 0.175]);
        glMatrix.mat4.multiply(crateModelMatrix, worldMatrix, crateModelMatrix);
    
        gl.uniformMatrix4fv(modelMatrixLocation, false, crateModelMatrix);
    
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objCrate[i].indexBuffer);
    
        gl.drawElements(gl.TRIANGLES, objCrate[i].indices.length, gl.UNSIGNED_SHORT, 0);


        //crate2
        let crateModelMatrix2 = glMatrix.mat4.create();
    
        glMatrix.mat4.translate(crateModelMatrix2, crateModelMatrix2, [.4, -1, -7]);    
        glMatrix.mat4.rotate(crateModelMatrix2, crateModelMatrix2, -angle * Math.PI/180,[0.0, 0.0, 1.0]);    
        glMatrix.mat4.scale(crateModelMatrix2, crateModelMatrix2, [0.175, 0.175, 0.175]);
        glMatrix.mat4.multiply(crateModelMatrix2, worldMatrix, crateModelMatrix2);
    
        gl.uniformMatrix4fv(modelMatrixLocation, false, crateModelMatrix2);
    
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objCrate[i].indexBuffer);
    
        gl.drawElements(gl.TRIANGLES, objCrate[i].indices.length, gl.UNSIGNED_SHORT, 0);
    
    
        }

    for (i = 0; i < objFHouse.length; i++) {

        bindTexture(gl, shaderProgram, objFHouse[i]);

        //fHouse
        let fHouseModelMatrix = glMatrix.mat4.create();

        glMatrix.mat4.translate(fHouseModelMatrix, fHouseModelMatrix, [0, -.25, 0]); 
        glMatrix.mat4.translate(fHouseModelMatrix, fHouseModelMatrix, [0, (0.5 + Math.abs(Math.sin((angle * 2.3)/100)))/20, -6.5]);    
        glMatrix.mat4.rotate(fHouseModelMatrix, fHouseModelMatrix, 180 * Math.PI/180,[0, 1.0, 0.0]);   
        glMatrix.mat4.rotate(fHouseModelMatrix, fHouseModelMatrix, 25 * Math.PI/180,[1, 1.0, 0.0]);  
        glMatrix.mat4.rotate(fHouseModelMatrix, fHouseModelMatrix, 15 * Math.PI/180,[0, 1.0, 0.0]);  
        glMatrix.mat4.scale(fHouseModelMatrix, fHouseModelMatrix, [0.06, 0.06, 0.06]);
        glMatrix.mat4.multiply(fHouseModelMatrix, worldMatrix, fHouseModelMatrix);
    
        gl.uniformMatrix4fv(modelMatrixLocation, false, fHouseModelMatrix);
    
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objFHouse[i].indexBuffer);
    
        gl.drawElements(gl.TRIANGLES, objFHouse[i].indices.length, gl.UNSIGNED_SHORT, 0);
    
        }
    
    for (i = 0; i < objFreight.length; i++) {

        bindTexture(gl, shaderProgram, objFreight[i]);

        //freight
        let freightModelMatrix = glMatrix.mat4.create();

        glMatrix.mat4.translate(freightModelMatrix, freightModelMatrix, [0, -.3, 0]); 
        glMatrix.mat4.translate(freightModelMatrix, freightModelMatrix, [0, (0.5 + Math.abs(Math.sin((angle * 2.5)/100)))/20, -4]);    
        glMatrix.mat4.rotate(freightModelMatrix, freightModelMatrix, 180 * Math.PI/180,[1.0, 1.0, 1.0]);   
        glMatrix.mat4.rotate(freightModelMatrix, freightModelMatrix, 100 * Math.PI/180,[0, 1.0, 1.0]);  
        glMatrix.mat4.rotate(freightModelMatrix, freightModelMatrix, -30 * Math.PI/180,[0, 1.0, 0.0]);  
        glMatrix.mat4.scale(freightModelMatrix, freightModelMatrix, [0.1, 0.1, 0.1]);
        glMatrix.mat4.multiply(freightModelMatrix, worldMatrix, freightModelMatrix);

        gl.uniformMatrix4fv(modelMatrixLocation, false, freightModelMatrix);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objFreight[i].indexBuffer);

        gl.drawElements(gl.TRIANGLES, objFreight[i].indices.length, gl.UNSIGNED_SHORT, 0);

    }
    
}

/**
 * 
 * @function matrixSetUp - Handles Perspective and Camera matrices, as well as light uniforms.
 * @param {uri} shaderProgram -- shaderProgram
 * @param {gl} gl
 */
function matrixSetUp(gl, shaderProgram){

    //Perspective//
    let projectMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projectMatrix, 45 * Math.PI/180, 800/600, 0.1, 100.0);
    let projectMatrixLocation = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
    gl.uniformMatrix4fv(projectMatrixLocation, false, projectMatrix);

    //CAMERA
    glMatrix.mat4.lookAt(camera, camera.viewDirectionVector, camera.positionVector, camera.upVector);
    let viewMatrixLocation = gl.getUniformLocation(shaderProgram, 'viewMatrix');
    gl.uniformMatrix4fv(viewMatrixLocation, false, camera.cameraMatrix);


    //Lighting
    let ambientColorLocation = gl.getUniformLocation(shaderProgram, "ambientLightColor");
    gl.uniform3fv(ambientColorLocation, [1.0, 0.8, 0.8]);


   let diffuseColorLocation = gl.getUniformLocation(shaderProgram, "diffuseLightColor");
   gl.uniform3fv(diffuseColorLocation, [0.9, 0.95, 0.9]);


    let diffuseDirectionLocation = gl.getUniformLocation(shaderProgram, "diffuseLightDirection");
    gl.uniform3fv(diffuseDirectionLocation, [5.0, 5.0, 6.0]);



}

/**
 * 
 * @function bindTexture - Activates and binds texture for each mesh (and enables attributes).
 * @param {uri} shaderProgram -- shaderProgram
 * @param {gl} gl
 * @param {obj} mesh
 */
function bindTexture(gl, shaderProgram, obj) {

    shadersAndBuffersMesh(gl, shaderProgram, obj);

    gl.activeTexture(gl.TEXTURE0);

    let textureLocation = gl.getUniformLocation(shaderProgram, "textureImg");

    gl.bindTexture(gl.TEXTURE_2D, obj.textImgBuffer);

    gl.uniform1i(textureLocation, 0);


}








