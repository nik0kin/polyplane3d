#pragma strict


private static var WIDTH : int = 41;
public static var DISTANCE_BTWN_PLANES : int = 25;
private static var CAMERA_DISTANCE_CHANGE : int = 10;
private static var PLANE_TRANPARENT : float = .05;

public static var CENTER_OFFSET_X : float = 1.0;//for centering player/stairs in maze
public static var CENTER_OFFSET_Y : float = 1.0;//really is Z

private static var OPEN : char = '0'[0];
private static var WALL : char = '1'[0];
private static var ENTER : char = '2'[0];
private static var EXIT : char = '3'[0];
private static var TREASURE : char = '4'[0];

public static var MOVE_CD : float = .085f;
public static var PORTAL_CD : float = .25f;

var currentLevel : int = 0;
var cameraLevel : int = 0;

var player : Vector2 = Vector2(0,0);
var playerS : PlayerScript;

public var width : int = WIDTH;
var levels : char[,,];//[this.level,x,y]
public var planes : Transform[];
var planeToCopy : Transform;
var maxDepth : int;
var stairGroups : Transform[];


var wallMaterial : Material;

var gameMan : GameMan;

//movement varsTime.fixedTime
private var moveCD : Cooldown;
private var portalCD : Cooldown;


function Start () {
    cameraBaseY = Camera.main.transform.position.y;
    
    //init movement cooldowns
	moveCD = gameObject.AddComponent("Cooldown") as Cooldown;
	moveCD.init(MOVE_CD,true);
	portalCD = gameObject.AddComponent("Cooldown") as Cooldown;
	portalCD.init(PORTAL_CD,true);
}

function setPlayer(p : PlayerScript){ 
	playerS = p; 
    playerS.modelToSpot(player);
   
}

function Update () {
	//for debugging to change planes
	if(Input.GetButtonUp ("DebugNextPlane")){
		if(currentLevel < maxDepth-1){
			currentLevel++;
			changePlaneCamera(currentLevel, false);
		}
		
	}
	if(Input.GetButtonUp ("DebugBackPlane")){
		if(currentLevel > 0){
			currentLevel--;
			changePlaneCamera(currentLevel, false);
		}
	}
	
	//reset moveCD if you let go
	if(Input.GetButtonUp("Up") || Input.GetButtonUp("Down") || 
            Input.GetButtonUp("Left") || Input.GetButtonUp("Right")){
//        moveCD.reset();
    } 
    
    //turn stair planes renderer to false(work around)
    for(var p : Transform in stairGroups){
    	p.renderer.enabled = false;
    }
    
	//update player was here
    
    if(cameraMovingTowardsPlane != -1)
        updateCamera(cameraMovingTowardsPlane);
        
    changeRenderQueue();
}


//usually called by PlayerScript
//returns if win
public function movePlayer(direction : DirectionEnum, portalTry : boolean, levelView : int) : boolean {
	var nextX : int;
	var nextY : int;
        
    if(portalTry)
    	portalTry = portalCD.use();

    //view other level
    if(levelView != 0 && currentLevel+levelView >= 0 && currentLevel+levelView < maxDepth){
    	print("View "+levelView);
    	
    	changePlaneCamera(currentLevel+levelView,true);	
    	holdingCamera = true;
	}else if(holdingCamera){//reset it back
		changePlaneCamera(currentLevel,false);
		holdingCamera = false;
	}
            
    switch(direction){
        case DirectionEnum.north:
            nextX = 0;
            nextY = -1;
            break;
        case DirectionEnum.south:
            nextX = 0;
            nextY = 1;
            break;
        case DirectionEnum.east:
            nextX = 1;
            nextY = 0;
            break;
        case DirectionEnum.west:
            nextX = - 1;
            nextY = 0;
            break;
        case DirectionEnum.na:
        	//we must be trying to portal;
        	break;
        default:
            return false;
    }
    
    //making an array, of points to check while we're meeting
    var a = new Array();
            
    a.Push(new Vector2(player.x +nextX*2,player.y +nextY*2));
    a.Push(new Vector2(player.x +nextX*2+1,player.y +nextY*2));
    a.Push(new Vector2(player.x +nextX*2,player.y +nextY*2+1));
    a.Push(new Vector2(player.x +nextX*2+1,player.y +nextY*2+1));
    
    switch(direction){
        case DirectionEnum.north:
        case DirectionEnum.south:
            a.Push(new Vector2(player.x +nextX*2-1 ,player.y +nextY*2));
            a.Push(new Vector2(player.x +nextX*2-1,player.y +nextY*2+1));
        
            a.Push(new Vector2(player.x +nextX*2 + 2,player.y +nextY*2));
            a.Push(new Vector2(player.x +nextX*2 + 2,player.y +nextY*2+1));
            break;
        case DirectionEnum.east:
        case DirectionEnum.west:
            a.Push(new Vector2(player.x +nextX*2 ,player.y +nextY*2 - 1));
            a.Push(new Vector2(player.x +nextX*2 + 1,player.y +nextY*2 - 1));
        
            a.Push(new Vector2(player.x +nextX*2,player.y +nextY*2 + 2));
            a.Push(new Vector2(player.x +nextX*2 + 1,player.y +nextY*2 + 2));
            break;
    }
    
	//cant move player out of bounds
    if(player.x+ nextX < 0 || player.x +nextX+1 > WIDTH-1
            || player.y +nextY < 0 || player.y +nextY+1 > WIDTH-1)
        return false;
    //cant move player into wall
    //check corners + reg spots
    var allGood = true;
    for(var p : Vector2 in a){
        if(this.levels[currentLevel,p.x,p.y] == WALL){
            allGood = false;
            break;
        }
    }
    if(!allGood) return false;
        
    //entering stairs going down
    if(portalTry && this.levels[currentLevel,player.x +nextX,player.y +nextY] >= 'A'[0] &&
            this.levels[currentLevel,player.x +nextX,player.y +nextY] <= 'Z'[0]){
        currentLevel++;
        changePlaneCamera(currentLevel, false);
        playerS.transitionModelPlanes(false);
        direction = DirectionEnum.na;
    }
    //entering stairs going up
    else if(portalTry && this.levels[currentLevel,player.x +nextX,player.y +nextY] >= 'a'[0] &&
            this.levels[currentLevel,player.x +nextX,player.y +nextY] <= 'z'[0]){
        currentLevel--;
        changePlaneCamera(currentLevel, false);
        playerS.transitionModelPlanes(true);
        direction = DirectionEnum.na;
    }
    //entered the exit spot
    else if(this.levels[currentLevel,player.x+nextX,player.y + nextY] == EXIT){
        //return true;//beat level
    	if(treasureFound >= treasureTotal)
    		gameMan.beatLevel();
        
    }
    //otherwise move there?
    if(moveCD.use()){
        player.x = player.x + nextX;
        player.y = player.y + nextY;
        playerS.updatePlayerModel(player);
    }
    
    //if we find a treasure
    if(treasureTotal > 0 && this.levels[currentLevel,player.x,player.y] == TREASURE ){
    	this.levels[currentLevel,player.x,player.y] = OPEN;
    	Destroy(treasures[currentLevel,player.x,player.y].gameObject);
    	treasureFound++;
    }
    
//    this.facing = direction;
   
    return false;
}

var cameraBaseY : float;
var cameraMovingTowardsPlane : int; //which plane 
var cameraSpeed : float = 15.0f;
var holdingCamera : boolean = false;

function updateCamera(plane : int){
    var destination : float = cameraBaseY - (CAMERA_DISTANCE_CHANGE)*(plane);
    var delta : float = destination - Camera.main.transform.position.y;
      
    //var speedUpVar : float = Mathf.Abs(delta/(CAMERA_DISTANCE_CHANGE));
    var translation : float =  Time.deltaTime * cameraSpeed;// / speedUpVar;

     if(delta > 0){
         Camera.main.transform.Translate (0, translation, 0);
     }else if(delta < 0){
         Camera.main.transform.Translate (0, -translation, 0);
     }
     
     if(Mathf.Abs(delta) < 1 ){
         //we're here
         cameraLevel = cameraMovingTowardsPlane;
         cameraMovingTowardsPlane = -1;
     }
     //print(" d:"+destination + " p:" + Camera.main.transform.position.y + " t:" + delta + " ");
}

function changePlaneCamera(depth:int,hold : boolean){
	var p = planes[depth];
	
	transparentAllPlanes();
	
	//turn walls and planes back unalphed
	var transforms :  Component[] = p.GetComponentsInChildren(Transform) as Component[];
	for(var child : Component in transforms){
		if(child.transform.renderer && ( child.GetComponent("ParticleSystem")== null) )
child.renderer.enabled = true;
//			child.transform.renderer.material.color.a = 1.0; 
	}
	//turn a set of stairs on
	var sg : Transform = stairGroups[depth];
	for(var t : Component in sg.GetComponentsInChildren(Transform)){
		if(t.renderer)
			t.renderer.enabled = true;
	}

	
	//if we are moving already, switch the current camera
	if(cameraMovingTowardsPlane != -1){
		cameraLevel = cameraMovingTowardsPlane;
	}
	//set a course to it
	if(!hold)
		cameraMovingTowardsPlane = depth;
	
	
	print("camera to plane "+depth);
}
//and disable all stairs
function transparentAllPlanes(){
	//this makes all the children transparent including wallls
	var transforms :  Component[] = this.GetComponentsInChildren(Transform) as Component[];
	for(var t : Component in transforms){
		if(t.transform.renderer != null && t.renderer.material != null && ( t.GetComponent("ParticleSystem")== null) ){
			try{
t.renderer.enabled = false;
				var c : Color = t.renderer.material.GetColor("_Color");
//				t.renderer.material.SetColor("_Color",Color(c.r,c.g,c.b, PLANE_TRANPARENT));
			}catch(err){} 
			//print(t.renderer.material.color.a);
		}
	}
	
	//stairs disable
	for(var i : int = 0; i < maxDepth; i++){
		var sg : Transform = stairGroups[i];
		for(var t : Component in sg.GetComponentsInChildren(Transform)){
			if((t as Transform).renderer)
				(t as Transform).renderer.enabled = false;
		}
	}
}

//TODO condense walls into less cubes
// this creates other planes from the base plane, below it
function drawOnToPlanes(mainPlane : Transform){
    maxDepth = levels.GetLength(0);
    planes = new Transform[maxDepth];
    planes[0] = mainPlane;
    stairGroups = new Transform[maxDepth];
    planeToCopy = Instantiate (mainPlane, Vector3(0, 0, 0), Quaternion.identity);
    mainPlane.transform.parent = this.transform;

    //drawing basic array
    for(var depth = 0; depth < maxDepth ; depth++){    
        //if this isnt the first plane, lets make a plane
        if(depth != 0){
            var newPlane : Transform  = Instantiate (planeToCopy, Vector3(0, -DISTANCE_BTWN_PLANES*depth, 0), Quaternion.identity);
            newPlane.parent = this.transform;
            newPlane.name = "Plane_"+depth;
            planes[depth] = newPlane;
        }
        //making set of stairs
        stairGroups[depth] = Instantiate (planeToCopy, Vector3(0, -DISTANCE_BTWN_PLANES*depth, 0), Quaternion.identity);
        stairGroups[depth].name = "Stairs_"+depth;
        stairGroups[depth].renderer.enabled = false;
        
        for(var y=0;y<WIDTH;y++){
            for(var x=0;x<WIDTH;x++){
                //will have ifs later?
                var block = levels[depth,x,y];
    
                if(block == WALL){
                	createWallBlock(planes[depth] ,x,y);
                }else if(block == ENTER){
                    createGate(stairGroups[depth], startPrefab,x,y);
                }else if(block == EXIT){
                    createGate(stairGroups[depth], endPrefab,x,y);
                }else if(block >= 'A'[0] && block <= 'Z'[0]){//going down
                //portals
					createStairs(stairGroups[depth], stairsDownPrefab,x,y,true);
                }else if(block >= 'a'[0] && block <= 'z'[0]){//going up
                	createStairs(stairGroups[depth], stairsUpPrefab,x,y,true);
                }else if(block == TREASURE){
                	createTreasure(stairGroups[depth], treasurePrefab,x,y,depth);
                }
    
            }
        }
    }
	Destroy(planeToCopy.gameObject);
	changePlaneCamera(0, false);
}

//being used for stairs
function createStairs(stairGroup : Transform, prefab : Transform, x : int, y : int, scale : boolean){
	if(!prefab) return;
	
	var stairs : Transform = Instantiate (prefab, Vector3(0, 0.0, 0), Quaternion.identity);
	stairs.transform.parent = stairGroup;
	
	//intial stuff
    stairs.transform.localScale = Vector3((1.0/WIDTH)*10 ,1.0,(1.0/WIDTH)*10);
	
	var xP : float = ((x + CENTER_OFFSET_X)/WIDTH)*10.0;
    var zP : float = ((y + CENTER_OFFSET_Y)/WIDTH)*10.0;
	//figure out x and z
	stairs.transform.localPosition.x = -5 + xP;
	stairs.transform.localPosition.z = 5 - zP;
	stairs.transform.localPosition.y = 1.2;
	
	if(scale){
		stairs.transform.localScale.x = .05f;
		stairs.transform.localScale.z = .05f;
	}
}

function createGate(stairGroup : Transform, prefab : Transform, x : int, y : int){
	if(!prefab) return;
	
	var gates : Transform = Instantiate (prefab, Vector3(0, 0.0, 0), Quaternion.identity);
	gates.transform.parent = stairGroup;
	
	//intial stuff
	
    gates.transform.localScale = Vector3(.06,.2,.04);//Vector3((1.0/WIDTH)*2 ,(1.0/WIDTH)*7,(1.0/WIDTH)*2);
	
	var xP : float = ((x + CENTER_OFFSET_X)/WIDTH)*10.0;
    var zP : float = ((y + CENTER_OFFSET_Y)/WIDTH)*10.0;
	//figure out x and z
	gates.transform.localPosition.x = -5 + xP;
	gates.transform.localPosition.z = 5 - zP;
	gates.transform.localPosition.y = 5.25;
}

private var treasures : Transform[,,];

function createTreasure(stairGroup : Transform, prefab : Transform, x : int, y : int, level : int){
	if(!prefab) return;
	
	var treasure : Transform = Instantiate (prefab, Vector3(0, 0.0, 0), Quaternion.identity);
	treasure.transform.parent = stairGroup;
	
	//intial stuff
	
    treasure.transform.localScale = Vector3(.5,.5,.5);//Vector3((1.0/WIDTH)*2 ,(1.0/WIDTH)*7,(1.0/WIDTH)*2);
	
	var xP : float = ((x + CENTER_OFFSET_X)/WIDTH)*10.0;
    var zP : float = ((y + CENTER_OFFSET_Y)/WIDTH)*10.0;
	//figure out x and z
	treasure.transform.localPosition.x = -5 + xP;
	treasure.transform.localPosition.z = 5 - zP;
	treasure.transform.localPosition.y = 5.25;
	
	treasures[level,x,y] = treasure;
}

//helper function for drawnToPlane()
function createWallBlock(plane : Transform, x : int,y : int){
	var cube : GameObject  = GameObject.CreatePrimitive(PrimitiveType.Cube);
	cube.transform.parent = plane;
	
	// Create a material with transparent diffuse shader
    //var material = new Material(Shader.Find ("Diffuse"));//(Shader.Find ("TransparentSingleColorShader"));
    var material = Resources.Load("wall", typeof(Material)) as Material;
    //material.color = Color.green;
    // assign the material to the renderer
    cube.renderer.material = material;
	
	//intial stuff
    cube.transform.localPosition = Vector3.up * 1.5;
    cube.transform.localScale = Vector3((1.0/WIDTH)*10 ,2.0,(1.0/WIDTH)*10);
   
    var xP : float = ((x + 0.5)/WIDTH)*10.0;
    var zP : float = ((y + 0.5)/WIDTH)*10.0;
	//figure out x and z
	cube.transform.localPosition.x = -5 + xP;
	cube.transform.localPosition.z = 5 - zP;
}

var startingBaseQueue = 3001;

function changeRenderQueue(){
	var baseQueue = startingBaseQueue;
	for(var t : Transform in stairGroups[currentLevel]){
		if(t.renderer)
			t.renderer.material.renderQueue	= baseQueue++;
	}
	//print(baseQueue);
}

public var treasureFound : int;
public var treasureTotal : int;

function addTreasure(){

}

// STATIC STATIC STATIC STATIC STATIC STATIC //

static function getLevel(num,treasure : boolean) : GameObject{
    var go : GameObject = new GameObject("Field1");
	go.AddComponent ("Field");
    
    var f : Field = go.GetComponent("Field") as Field;
   // try{
        var i : int = 0;
        var levelString : String = Levels.getLevelString(num);
        //alert(lines);
        var lines : String[] = levelString.Split("\n"[0]);

        var levels = parseInt(lines[i++]);
        
        var tt : int;
        if(treasure){
        	tt = 0;
        	f.treasureTotal = levels * 5;
        	f.treasures =  new Transform[levels,WIDTH,WIDTH];	
    	}
        
        f.levels = new char[levels,WIDTH,WIDTH];//= new char[levels,TOTALX,TOTALY];
        for(var l=0;l<levels;l++){
            //f.levels[l] = new Array(41);
            for(var y=0;y<WIDTH;y++){//this could mess up if changed to x?
               // f.levels[l,y] = new Array(41);
                for(var x=0;x<WIDTH;x++){
                    f.levels[l,x,y] = WALL;//= new Array(41);
                }
            }
        }
		//the new style
		for(l = 0;l<levels;l++){
			i++;//takes the dash
			var ny = 0;
			for(y=0;y<17;y++){
				var s = lines[i++];
				var nx = 0;
				//if y is even it is a wall line
				
				//or(n=0;n<((y % 2 === 1)? 4: 1);n++){
				for(x=0;x<17;x++){
					if(x % 2 == 1 && y % 2 == 1){//non wall
						var c = s[x];
						var a = (c != OPEN && c != WALL) ? OPEN : c; 
						
						if(c == OPEN && treasure && tt < f.treasureTotal){
							var r = Random.RandomRange(1,10);
							if(r > 8){
								c = TREASURE;
								tt++;
							}
						}
						
						//OK HAVE 16 OF THESE STATEMENTS BRAH
						f.levels[l,nx,ny] = a;
						f.levels[l,nx,ny+1] = a;
						f.levels[l,nx,ny+2] = a;
						f.levels[l,nx++,ny+3] = a;
						
						f.levels[l,nx,ny] = a;
						f.levels[l,nx,ny+1] = c;//different
						f.levels[l,nx,ny+2] = a;
						f.levels[l,nx++,ny+3] = a;
						
						f.levels[l,nx,ny] = a;
						f.levels[l,nx,ny+1] = a;
						f.levels[l,nx,ny+2] = a;
						f.levels[l,nx++,ny+3] = a;
						
						f.levels[l,nx,ny] = a;
						f.levels[l,nx,ny+1] = a;
						f.levels[l,nx,ny+2] = a;
						f.levels[l,nx++,ny+3] = a;
						
						if(s[x] == ENTER){//player starting place
							f.player.x = nx-3;
                            f.player.y = ny+1;
						}
						
					}else{
						if(x % 2 == 0 && y % 2 == 0){
							f.levels[l,nx++,ny] = s[x];
						}else if(x % 2 == 0){
							//4 vertical
							f.levels[l,nx,ny] = s[x];
							f.levels[l,nx,ny+1] = s[x];
							f.levels[l,nx,ny+2] = s[x];
							f.levels[l,nx++,ny+3] = s[x];
						}else if(y % 2 == 0){
							//4 horitzonatal
							f.levels[l,nx++,ny] = s[x];
							f.levels[l,nx++,ny] = s[x];
							f.levels[l,nx++,ny] = s[x];
							f.levels[l,nx++,ny] = s[x];
						}
						
					}
					
				}
				nx = 0;
				if(y % 2 == 1)
					ny += 4;
				else
					ny++;
				
			}
		}
		f.treasureTotal = tt;
        
 //   } catch (e) {
//        alert("end of levels;");
//        return null;
 //   }
    
    return go;
}

private static var stairsUpPrefab : Transform;
private static var stairsDownPrefab : Transform;
private static var startPrefab : Transform;
private static var endPrefab : Transform;
private static var treasurePrefab : Transform;

static function setPrefabs(up : Transform, down : Transform, start : Transform, end : Transform, treasure : Transform) : void {
	if(up) stairsUpPrefab = up;
	if(down) stairsDownPrefab = down;	
	if(start) startPrefab = start;
	if(end) endPrefab = end;
	if(treasure) treasurePrefab = treasure;
}


private static var currentField : Field;
static function getInstance() : Field {
    return currentField;
}