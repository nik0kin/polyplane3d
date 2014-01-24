using UnityEngine;
using System.Collections;

public class MainMenu : MonoBehaviour {
	public static int BUTTONS_Y = 294;
	public static Vector2 BUTTON_SZ = new Vector2(206,132);
   
	
	public GUISkin newSkin;
	public Texture2D logoTexture;
	
	public Texture2D opcButtonText1;//base ones
	public Texture2D opcButtonText2;
	public Texture2D opcButtonText3;
	
	public Texture2D buttonText1;//hover
	public Texture2D buttonText2;
	public Texture2D buttonText3;
	
	public Texture2D hoverText1;//hover text
	public Texture2D hoverText2;
	public Texture2D hoverText3;
	
	public Texture2D toggleText;
	
	bool bool1 = false;
	bool bool2 = false;
	bool bool3 = false;
	
	string lastTooltip = "";
	
	bool kinectToggle = false;
	bool treasureHuntToggle = false;
	
	int state = 0;
	
	void theFirstMenu() {
	    //layout start
	    GUI.BeginGroup (new Rect (Screen.width / 2 - 1280/2, Screen.height / 2 - 720/2, 1280, 720));
	    
	    //the menu background box
	    //GUI.Box(new Rect(0, 0, 300, 200), "");
	    
	    //logo picture
	    GUI.Label(new Rect(474, 185, logoTexture.width, logoTexture.height), logoTexture);
	    
	    ///////main menu buttons
	    //levels button
	    if(GUI.Button (new Rect (330, BUTTONS_Y, BUTTON_SZ.x, BUTTON_SZ.y), new GUIContent (opcButtonText1, "Button1"),GUI.skin.label) ){
			state = 1;
		}
		if(bool1){
			GUI.Label(new Rect(330, BUTTONS_Y, BUTTON_SZ.x, BUTTON_SZ.y), buttonText1);
			GUI.Label(new Rect(355, BUTTONS_Y + 110, BUTTON_SZ.x, BUTTON_SZ.y), hoverText1);
		}
		//settings
		if(GUI.Button(new Rect(550, BUTTONS_Y, BUTTON_SZ.x, BUTTON_SZ.y), new GUIContent (opcButtonText2, "Button2"),GUI.skin.label) ) {
			
	    }
		if(bool2){
			GUI.Label(new Rect(550, BUTTONS_Y, BUTTON_SZ.x, BUTTON_SZ.y), buttonText2);
			GUI.Label(new Rect(580, BUTTONS_Y + 110, BUTTON_SZ.x, BUTTON_SZ.y), hoverText2);
		}
	    //quit button
	    if(GUI.Button(new Rect(770, BUTTONS_Y, BUTTON_SZ.x, BUTTON_SZ.y), new GUIContent (opcButtonText3, "Button3"),GUI.skin.label)) {
	    	Application.Quit();
	    }
		if(bool3){
			GUI.Label(new Rect(770, BUTTONS_Y, BUTTON_SZ.x, BUTTON_SZ.y), buttonText3);
			GUI.Label(new Rect(798, BUTTONS_Y + 110, BUTTON_SZ.x, BUTTON_SZ.y), hoverText3);
		}
	    
		kinectToggle = GUI.Toggle(new Rect(600,BUTTONS_Y + 200,BUTTON_SZ.x,BUTTONS_Y),kinectToggle,toggleText);
		
		
		//layout end
		GUI.EndGroup(); 

		
		if (Event.current.type == EventType.Repaint && GUI.tooltip != lastTooltip) {        
		    if (lastTooltip != "") {
		        SendMessage (lastTooltip + "out", SendMessageOptions.DontRequireReceiver);      
		    } 
		 
		    if (GUI.tooltip != "") {
		       SendMessage (GUI.tooltip + "over", SendMessageOptions.DontRequireReceiver);
		    }
		 
		    lastTooltip = GUI.tooltip; 
		}
	}
	private GUIStyle style = new GUIStyle();
	
	//the level select menu
	void theSecondMenu(){
		int[] levels = {1,2,3};//Levels.getEnabledLevels();
		style.normal.textColor = Color.white;
		GUI.BeginGroup (new Rect (Screen.width / 2 - 1280/2, Screen.height / 2 - 720/2, 1280, 720));
		
		int i=0;
		foreach(int l in levels){
			string s;
			if(treasureHuntToggle){
				int t = PlayerPrefs.GetInt("treasure_"+l, 999);
				s = "Level "+l+" Time: "+t+" seconds";
			}else
				s = "Level "+l;
			
			if(GUI.Button (new Rect (330, 300 + i, 100, 30),s,style)){
				PlayerPrefs.SetInt("level", l);
				gotoLevel();
			}
			i += 30;
		}
		
		if(GUI.Button (new Rect (230, 400, 100, 30),"BACK",style)){
			state = 0;
		}
		
		
		treasureHuntToggle = GUI.Toggle(new Rect(600,BUTTONS_Y + 200,BUTTON_SZ.x,BUTTONS_Y),treasureHuntToggle,"Tresure Hunt");
		
		GUI.EndGroup(); 
	}
	
	
	void gotoLevel(){
		PlayerPrefs.SetInt("treasure", treasureHuntToggle ? 1 : 0);
		PlayerPrefs.SetInt("kinect", kinectToggle ? 1 : 0);
		Application.LoadLevel("scene1");
	}
	
	void OnGUI () {
	    //load GUI skin
	    GUI.skin = newSkin;
	    
	    if(state == 0)
	    	theFirstMenu();
		else if(state == 1)
			theSecondMenu();
	}
	
	void Button1over () {bool1 = true;}
	void Button1out () {bool1 = false;}
	void Button2over () {bool2 = true;}
	void Button2out () {bool2 = false;}
	void Button3over () {bool3 = true;}
	void Button3out () {bool3 = false;}
}
