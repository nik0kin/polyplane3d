#pragma strict

private var ROLL_VAR : float = 20; //degrees, but idk

private var myField : Field;

private var playerPlane : Transform;

//new roll way vars (maybe we'll delete
var speed = 10.0;
private var radius = 0.02;
var camera2 : Camera;

var kinectControls : KinectMovePlayer;

function Start () {
	//intial stuff
    transform.localScale = Vector3((1.0/myField.width)*10 ,1.0,(1.0/myField.width)*10);
	
//	updatePlayerModel();
	//transform.localPosition.y = 5;
	
	
	var scale : float = radius * 2;//.05;
	transform.localScale.x = scale;
	transform.localScale.y = scale * 3;
	transform.localScale.z = scale;
	
	//transform.localScale = Vector3.one * radius * 2;

    var hit : RaycastHit;

    if(Physics.Linecast(transform.position, transform.position - Vector3.up * 100, hit)){
        transform.position = hit.point + Vector3.up * radius;
    }
}

function init(f : Field, planeToCopy : Transform){
	myField = f;
	
	//creating player plane, will be invisible
	playerPlane = GameObject.CreatePrimitive(PrimitiveType.Plane).transform;
	playerPlane.localScale = planeToCopy.localScale;
	playerPlane.name = "Player Plane";
	playerPlane.renderer.enabled = false;
	playerPlane.transform.localScale.y = 3.0;
	//playerPlane.transform.position.y = 10.0;
	transform.parent = playerPlane;
	transform.localPosition.y = 3.0;
	
	playerPlane.localPosition.y = 6.0;
	
	var k : Component = GetComponent("KinectMovePlayer");
	
	if(k)
		kinectControls =  k as KinectMovePlayer;
}

function Update () {
	if(!myField) return;

	//handle player shit
    var d : DirectionEnum = DirectionEnum.na;
    var p : boolean;
    //if pressing up
    if(Input.GetButton ("Up")){
        d = DirectionEnum.north;
    }
    //down
    if(Input.GetButton ("Down")){
        d = DirectionEnum.south;
    }
    //left 
    if(Input.GetButton ("Left")){
        d = DirectionEnum.west;
    }
    //right
    if(Input.GetButton ("Right")){
        d = DirectionEnum.east;
    }
    
    //kinect overrides if enabled
    if(kinectControls){
    	var v : Vector2 = kinectControls.getPos();
    	
    	if(v.x < 0) d = DirectionEnum.west;
    	else if(v.x > 0) d = DirectionEnum.east;
    	
    	if(v.y < 0) d = DirectionEnum.north;
    	else if(v.y < 0) d = DirectionEnum.south;
    	
    }
    	
    	
	
    
    //reset moveCD if you let go
   /* if(Input.GetButtonUp("Up") || Input.GetButtonUp("Down") || 
            Input.GetButtonUp("Left") || Input.GetButtonUp("Right")){
        field.moveCD.reset(Time.fixedTime * 1000);
    } */
    
    if(Input.GetButtonUp ("Portal") || (kinectControls && kinectControls.getHands())){
    	p = true;
   	}
    
    //view other levels
    var h = 0;
    if(Input.GetButton("CheckUp"))
    	h = -1;
	else if(Input.GetButton("CheckDown"))
		h = 1;
    
    if(kinectControls && !kinectControls.getHands())
    	h = kinectControls.getHands();
    

    //if(d != DirectionEnum.na || h != 0 || p && !isAnimating){
    	//move player
    	if(myField.movePlayer(d,p,h)){
    		//win
    		//print("WIN");
    	}
    //}
    
    doAnimationUpdate();
}

private var isAnimating : boolean = false;
private var animationTimeLeft : float;
private var totalTranslation : Vector2 = new Vector2(0,0);

//update it to match its coords, called from Field
public function updatePlayerModel(coord : Vector2){
	var xP : float = ((coord.x + Field.CENTER_OFFSET_X)/myField.width)*10.0;//conversion from field coords
    var zP : float = ((coord.y + Field.CENTER_OFFSET_Y)/myField.width)*10.0;
	//figure out x and z
	var rollToPos : Vector2 = Vector2(-5 + xP,5 - zP);
	
	rollToAnimate(rollToPos.x,rollToPos.y);
	print(coord.x +" " + coord.y);
}

public function modelToSpot(coord : Vector2){
	var xP : float = ((coord.x + Field.CENTER_OFFSET_X)/myField.width)*10.0;//conversion from field coords
    var zP : float = ((coord.y + Field.CENTER_OFFSET_Y)/myField.width)*10.0;
    
	transform.localPosition.x = -5 + xP;
	transform.localPosition.z = 5 - zP;
	print(coord.x +" " + coord.y);
}
//coords in real coords
public function rollToAnimate(newX : float, newZ : float){
	var oldPos : Vector2 = Vector2(transform.localPosition.x,transform.localPosition.z); 
	
	totalTranslation.x = newX - oldPos.x;
	totalTranslation.y = newZ - oldPos.y;
	
	animationTimeLeft = Field.MOVE_CD;
	isAnimating = true;
	
	/*print("old: "+ oldPos.x + " " + oldPos.y);
	print("new: "+ newX + " " + newZ);
	print("T "+totalTranslation.x + " " + totalTranslation.y);*/
}

//http://docs.unity3d.com/Documentation/ScriptReference/Transform.Rotate.html
public function doAnimationUpdate(){
	if(!isAnimating) return;
	var absX : float = Mathf.Abs(totalTranslation.x);
	var absY : float = Mathf.Abs(totalTranslation.y);
	
	var rotationAmtX = (totalTranslation.x < 0 ? 1 : -1) *  ROLL_VAR *((0.0f+Time.deltaTime)/Field.MOVE_CD);
	var rotationAmtY = (totalTranslation.y < 0 ? 1 : -1) *  ROLL_VAR *((0.0f+Time.deltaTime)/Field.MOVE_CD);
	
	if(absX > 0){ // doing x
		transform.localPosition.x += totalTranslation.x * ((0.0f+Time.deltaTime)/Field.MOVE_CD);
//		transform.Rotate(transform.forward,rotationAmtX);
	} 
	if(absY > 0){ // doing z
		transform.localPosition.z += totalTranslation.y * ((0.0f+Time.deltaTime)/Field.MOVE_CD);
//		transform.Rotate(transform.right,rotationAmtY);
	}
	//print("%("+((0.0f+Time.deltaTime)/Field.MOVE_CD)+ ")animatinTime: "+animationTimeLeft+" ("+totalTranslation.x * ((0.0f+Time.deltaTime)/Field.MOVE_CD)+","+totalTranslation.y * ((0.0f+Time.deltaTime)/Field.MOVE_CD)+")");
	
	
	/*
	//new anim stuff
	// base movement off of the camera, not the object.
    // reset the camera's X to zero, so that it is always looking horizontally.
    var x = camera2.transform.localEulerAngles.x;
    camera2.transform.localEulerAngles.x = 0;

    // now collect the movement stuff This is generic direction and rotation.
    var direction = Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"));
    var rotation = Vector3(Input.GetAxis("Vertical"),0,-Input.GetAxis("Horizontal"));

    // prevent the ball from moving faster diagnally
    if(direction.magnitude > 1.0) direction.Normalize();
    if(rotation.magnitude > 1.0) rotation.Normalize();

    // reorientate the movement stuff to align to the camera.
    direction = camera2.transform.TransformDirection(direction);
    rotation = camera2.transform.TransformDirection(rotation);  

    // multiply the direction by the speed and deltaTime
    direction *= totalTranslation.x * ((0.0f+Time.deltaTime)/Field.MOVE_CD);//*= Time.deltaTime * speed;
   // multiply the rotation by the speed, deltaTime and (60 / radius)...
    rotation *= Time.deltaTime * speed *  60 / radius;

    // now update the position by the direction
    transform.Translate(direction, Space.World);
    // and rotate by the rotation
    transform.Rotate(rotation, Space.World);

    // return the camera's x rotation.
    camera2.transform.localEulerAngles.x = x;
    */
    //end new anim stuff
	
	
	animationTimeLeft -= Time.deltaTime;
	
	if(animationTimeLeft <= 0)
		isAnimating = false;
}
//this function will have the transitons ?
public function transitionModelPlanes(up : boolean){
	if(!up){
		playerPlane.transform.Translate(0.0,-Field.DISTANCE_BTWN_PLANES,0.0);
	}else{
		playerPlane.transform.Translate(0.0,Field.DISTANCE_BTWN_PLANES,0.0);
	}
}