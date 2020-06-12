/**
 * @function initShaders - Sends vertCode and fragCode to main
 */
function initShaders() {

    Promise.all([vertexResource, fragResource])
        .then(function(resources){

                myMain(resources);

        })

}

//Fetches vertex code
var vertexResource = fetch('./textResource/v2.glsl')
    .then(function (response) {
        return response.text();
        })
    .catch(function (error) {
        // error retrieving resource put up alerts...
        alert(error);
        console.log(error);
});

//Fetches fragment code
var fragResource = fetch('./textResource/f2.glsl')
    .then(function (response) {
        return response.text();
        })
    .catch(function (error) {
        // error retrieving resource put up alerts...
        alert(error);
        console.log(error);
});








    