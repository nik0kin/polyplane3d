#pragma strict

var mainPlane : Transform;
var playerModel : Transform;

var currentLevel : int;//level number
var currentField : Field;
var player : PlayerScript;
var camera2 : Camera;

public var stairsUpPrefab : Transform;
public var stairsDownPrefab : Transform;
public var startPrefab : Transform;
public var endPrefab : Transform;
public var treasurePrefab : Transform;

var treasureStart : float;

private var style : GUIStyle = new GUIStyle();

function Start () {
	Field.setPrefabs(stairsUpPrefab,stairsDownPrefab,startPrefab,endPrefab,treasurePrefab);
   if(PlayerPrefs.GetInt("level") == 0)
      startLevel( 3);
   else      
      startLevel( PlayerPrefs.GetInt("level"));
		
		
	style.fontSize = 32;
	style.normal.textColor = Color.white;
}


function Update () {	

	
}

//called by menu or this
function startLevel(levelNumber : int){
	currentLevel = levelNumber;

	var t : boolean = false;

	//add treasure hunt
	if(PlayerPrefs.GetInt("treasure") > 0){
		t = true;
		treasureStart = Time.fixedTime;
	}

	currentField = Field.getLevel(levelNumber,t).GetComponent("Field") as Field;
	currentField.gameMan = this;
	
	
	if(mainPlane != null){
		currentField.drawOnToPlanes(mainPlane);
		player = (Instantiate (playerModel, Vector3(0, 0, 0), Quaternion.identity) as Transform).GetComponent("PlayerScript") as PlayerScript;
	    if(PlayerPrefs.GetInt("kinect") > 0){
			player.gameObject.AddComponent("KinectMovePlayer");
		}
		player.init(currentField,mainPlane);
		player.camera2 = camera2;
		
		
		currentField.setPlayer(player);
	}
}

//called by field
function beatLevel(){
	print("beat level: "+currentLevel);

	if(PlayerPrefs.GetInt("treasure") > 0){
		if(PlayerPrefs.GetInt("treasure_"+currentLevel,9999) > Mathf.RoundToInt(Time.fixedTime-treasureStart) )
			PlayerPrefs.SetInt("treasure_"+currentLevel,Mathf.RoundToInt(Time.fixedTime-treasureStart));
		print("time: " +Mathf.RoundToInt(Time.fixedTime-treasureStart));
	}


	//Destroy(currentField);
	Application.LoadLevel("menu");
	/*var children = new List<GameObject>();
	foreach (Transform child in transform) children.Add(child.gameObject);
	children.ForEach(child => Destroy(child));*/
}

	function OnGUI(){
		if(currentField.treasureTotal > 0)
			GUI.Label(new Rect(500,0,300,100),"Treasure: "+currentField.treasureFound+"/"+currentField.treasureTotal+"  Time: "+(Time.fixedTime-treasureStart),style);
  	}