using UnityEngine;
using System.Collections;
using UIVA;

public class KinectMovePlayer : MonoBehaviour {
	public Transform player;//for testing
	public GUIStyle style = new GUIStyle();
 
	
	private	UIVA_Client uiva;
	
	private float highHands = .6f; //threshold
	private float lowHands = -.3f;
	
	private Vector2 startingPos = new Vector2(0.0f,1.5f);//in real life (x,z)
	private float moveAwayThreshold = .25f;
		
	private double[] lhPositions;
	private double[] rhPositions;
	private double[] headPositions;
	private double[] quaternions;
	
	
	
	private int hands;
	private Vector3 original;
	private Vector2 playerPos;
	
	// Use this for initialization
	void Start () {
		uiva = new UIVA_Client("localhost");
		original = transform.position;
		playerPos = new Vector2(0,0);
		
		lhPositions = new double[3];
		rhPositions = new double[3];
		headPositions = new double[3];
		quaternions = new double[4];
		
		if(!player) player = transform; // only if attached to something other than the player
      
		style.fontSize = 22;
		style.normal.textColor = Color.white;

	}
	
	// Update is called once per frame
	void Update () {
		GetDeviceData();
		
		
		//check high/low hands
		if(rhPositions[1] > highHands && lhPositions[1] > highHands){
			triggerHighhands();
		}else if(rhPositions[1] < lowHands && lhPositions[1] < lowHands){
			triggerLowhands();
		}else
			hands = 0;
		
		//for moving x should be around 0.0
		// z should be around 1.5
		
		//move more than .25 to move
		if(headPositions[0] < startingPos.x - moveAwayThreshold)
			changePos(-1,0);
		else if(headPositions[0] > startingPos.x + moveAwayThreshold)
			changePos(1,0);
		
		else if(headPositions[2] < startingPos.y - moveAwayThreshold)
			changePos(0,-1);
		else if(headPositions[2] > startingPos.y + moveAwayThreshold)
			changePos(0,1);
		else 
			changePos(0,0);
		
		
		
		//for test
		//player.position = original; 
		
		//player.Translate(playerPos[0] * .01f,playerPos[1]*.01f,0);
	}
	
	void changePos(int x, int y){
		playerPos.x = x;
		playerPos.y = y;
	}
	
	public Vector2 getPos(){
		return playerPos;
	}
	
	public void triggerHighhands(){
		hands = -1;
	}
	public void triggerLowhands(){
		hands = 1;
	}
	
	public int getHands(){
		return hands;
	}
	
	
	
	void GetDeviceData(){	
		uiva.GetKinectJointData(1, ref headPositions, ref quaternions);
		uiva.GetKinectJointData(8, ref lhPositions, ref quaternions);
		uiva.GetKinectJointData(14, ref rhPositions, ref quaternions);
      

	}
	
	void OnGUI(){
      GUI.Label(new Rect(0,0,300,100),"Left "+lhPositions[0].ToString("F2") + " " + lhPositions[1].ToString("F2") + " " + lhPositions[2].ToString("F2"),style);
      GUI.Label(new Rect(0,30,300,100),"Right "+rhPositions[0].ToString("F2") + " " + rhPositions[1].ToString("F2") + " " + lhPositions[2].ToString("F2"),style);
      GUI.Label(new Rect(0,60,300,100),"Head "+headPositions[0].ToString("F2") + " " + headPositions[1].ToString("F2") + " " + lhPositions[2].ToString("F2"),style);
		GUI.Label(new Rect(0,90,300,100), getPos().ToString()+" "+ hands, style );
   }
}
