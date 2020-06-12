/**
 * @function makeModel - Constructs 3D model as an array
 * @param {uri} obj -- final 3d model
 * @param {img} img -- the image to put onto the 3D Model
 * @param {objMaterials} objMaterials - Materials extracted from JSON
 * @param {objAttrib} objAttrib - Attributes extracted from JSON
 * @param {gl} gl
 */
function makeModel(obj, img, objMaterials, objAttrib, gl){

    for (i = 0; i < objAttrib.length; i++) {
        let model = new Object();
        makeMesh(model, objAttrib[i], objMaterials[i], img, gl);
        obj.push(model);
    }

    return obj;

}

/**
 * @function loadExternalJson - Loads a 3D Model (in JSON Format)
 * @param {uri} url -- the uri for the 3D Model to load. File should be a JSON format
 * @param {img} img -- the image to put onto the 3D Model
 * @param {gl} gl
 */
function loadExternalJSON(url, img, gl) {

    let modelObj = [];

    fetch(url)
        .then((resp) => {
            // if the fetch does not result in an network error
            if (resp.ok)
                return resp.json(); // return response as JSON
            throw new Error(`Could not get ${url}`);
        })
        .then(function (ModelInJson) {

        
            let objMaterials = [];
            let objAttrib = [];


            // get a reference to JSON mesh model for debug or other purposes 
            obj = ModelInJson;
            objMaterials = createMaterialsArray(ModelInJson, objMaterials);
            objAttrib = createModelAttributeArray(ModelInJson, objAttrib);

            modelObj = makeModel(modelObj, img, objMaterials, objAttrib, gl);

           
        })
        .catch(function (error) {
            // error retrieving resource put up alerts...
            alert(error);
            console.log(error);
        });


        return modelObj;


}

/**
 * @function createModelAttributeArray - Extracts the Attributes from JSON and returns them
 * attributes include {vertices, normals, indices, and texture coordinates}
 * 
 * @param {JSON} obj2 3D Model in JSON Format
 */
function createModelAttributeArray(obj2, arr) {
    // obj.mesh[x] is an array of attributes
    // vertices, normals, texture coord, indices

    // get number of meshes
    let numMeshIndexs = obj2.meshes.length;
    let idx = 0;
    for (idx = 0; idx < numMeshIndexs; idx++) {
        let modelObj = {};

        modelObj.vertices = obj2.meshes[idx].vertices;
        
        modelObj.normals = obj2.meshes[idx].normals;

        // now get index array data from faces, [[x,y,z], [x,y,z], ...]
        // to [x,y,z,x,y,z,...]. use array concat to transform
        modelObj.indexs = [].concat(...obj2.meshes[idx].faces);

        //which material index to use for this set of indices?
        modelObj.matIndex = obj2.meshes[idx].materialindex;


        if (obj2.meshes[idx].texturecoords !== undefined)
            modelObj.textureCoords = obj2.meshes[idx].texturecoords[0];
        else
            console.log(`texture coords for ${idx} does not exist`);


        // push onto array
        arr.push(modelObj);
    }

    return arr;
}

/**
 * @function createMaterialsArray - Extracts the Materials from JSON and returns them
 * attributes include {ambient, diffuse, shininess, specular and possible textures}
 * @param {JSON} obj2 3D Model in JSON Format
 * 
 */
function createMaterialsArray(obj2, arr){
    // length of the materials array
    // loop through array extracting material properties 
    // needed for rendering
    let itr = obj2.materials.length;
    let idx = 0;

    // each iteration creates a new group or set of attributes for one draw call
    for (idx = 0; idx < itr; idx++) {
        let met = {};
        // shading 
        met.shadingm = obj2.materials[idx].properties[1].value;
        met.ambient = obj2.materials[idx].properties[2].value;
        met.diffuse = obj2.materials[idx].properties[3].value;
        met.specular = obj2.materials[idx].properties[4].value;
        met.shininess = obj2.materials[idx].properties[5].value;

        // object containing all the illumination comp needed to 
        // illuminate faces using material properties for index idx
        arr.push(met);
    }

    return arr;
}
