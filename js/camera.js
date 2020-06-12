/**
 * 
 * Creates a virtual camera, allows user to navigate through a scene using arrow keys.
 * 
 */
class Camera{

	positionVector; //origin (X)

	upVector; // (Y)

	viewDirectionVector; // (Z)

    cameraMatrix;

	delta = 0.25;

	constructor(){

		this.cameraMatrix = glMatrix.mat4.create()

		this.viewDirectionVector = glMatrix.vec3.fromValues(0.0, 0.0, -0.1) //N axis

		this.upVector = glMatrix.vec3.fromValues(0.0,1.0,0.0) //V axis

        this.positionVector = glMatrix.vec3.fromValues(0.0,0.0,0.0) //U axis
        
        
	}

	moveForward(){

		let deltaForward = glMatrix.vec3.create();

		glMatrix.vec3.scale(deltaForward, this.viewDirectionVector, this.delta + 0.3);

		glMatrix.vec3.add(this.positionVector, this.positionVector, deltaForward);

		this.updateCameraMatrix();

	}

	moveBackward(){

		let deltaBackward = glMatrix.vec3.create();

		glMatrix.vec3.scale(deltaBackward, this.viewDirectionVector, this.delta + 0.3);

		glMatrix.vec3.sub(this.positionVector, this.positionVector, deltaBackward);

		this.updateCameraMatrix();

	}

	moveUp(){

		let deltaUp = glMatrix.vec3.create();

		glMatrix.vec3.scale(deltaUp, this.upVector, this.delta);

		glMatrix.vec3.add(this.positionVector, this.positionVector, deltaUp);

		this.updateCameraMatrix();


	}

	moveDown(){

		let deltaDown = glMatrix.vec3.create();

		glMatrix.vec3.scale(deltaDown, this.upVector, this.delta);

		glMatrix.vec3.sub(this.positionVector, this.positionVector, deltaDown);

		this.updateCameraMatrix();


	}

	strafeRight(){

		let newAxis = glMatrix.vec3.create();

		glMatrix.vec3.cross(newAxis, this.viewDirectionVector, this.upVector);

		glMatrix.vec3.scale(newAxis, newAxis, this.delta);

		glMatrix.vec3.add(this.positionVector, this.positionVector, newAxis);

		this.updateCameraMatrix();

	}

	strafeLeft(){

		let newAxis = glMatrix.vec3.create();

		glMatrix.vec3.cross(newAxis, this.viewDirectionVector, this.upVector);

		glMatrix.vec3.scale(newAxis, newAxis, this.delta);

		glMatrix.vec3.sub(this.positionVector, this.positionVector, newAxis);

		this.updateCameraMatrix();


    }

    rotateLeft() {

        let x = this.viewDirectionVector[0];
        let z = this.viewDirectionVector[2];


        this.viewDirectionVector[0] = x * Math.cos(0.10) + z * Math.sin(0.10);

        this.viewDirectionVector[2] = z * Math.cos(0.10) - x * Math.sin(0.10);

        console.log(this.viewDirectionVector[0]);
        console.log(this.viewDirectionVector[2]);

        
		this.updateCameraMatrix();


    }
    
    rotateRight(){

        let x = this.viewDirectionVector[0];
        let z = this.viewDirectionVector[2];


        this.viewDirectionVector[0] = x * Math.cos(0.10) - z * Math.sin(0.10);

        this.viewDirectionVector[2] = z * Math.cos(0.10) + x * Math.sin(0.10);

        console.log(this.viewDirectionVector[0]);
        console.log(this.viewDirectionVector[2]);

        
		this.updateCameraMatrix();

	}

	updateCameraMatrix(){

		let deltaMove = glMatrix.vec3.create();

		glMatrix.vec3.add(deltaMove, this.positionVector, this.viewDirectionVector);

                            //Out               /Eye                //Center    //Up
		glMatrix.mat4.lookAt(this.cameraMatrix, this.positionVector, deltaMove, this.upVector);


	}
}


document.addEventListener("keydown",ProcessKeyPressedEvent,false);
/***@param{e} event that was fired**/

function ProcessKeyPressedEvent(e){

    /**Process Camera Movement Keyw*/
    if (e.code==="KeyW"){

        console.log("^^^^--Forward");
        camera.moveForward();

    }
    if(e.code==="KeyS"){

        console.log("vvvvv--Backward");
        camera.moveBackward();

    }
    if(e.code==="KeyA"){

        console.log("<<<--Strafe Left");
        camera.strafeLeft();

    }

    if(e.code==="KeyD"){

        console.log("Strafe Right-->>>");
        camera.strafeRight();

    }

    if(e.code==="KeyI"){

        console.log("Move Up");
        camera.moveUp();

    }

    if(e.code==="KeyK"){

        console.log("Move Down");
        camera.moveDown();

    }

    if(e.code==="KeyL"){


        console.log("Rotate Right");
        camera.rotateRight();

    }

    if(e.code==="KeyJ"){

        console.log("Rotate Left");
        camera.rotateLeft();

    }

    console.log(e)
}
