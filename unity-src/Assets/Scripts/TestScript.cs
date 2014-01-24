using UnityEngine;
using System.Collections;

public class TestScript : MonoBehaviour {
	private Cooldown cd;
		
	// Use this for initialization
	void Start () {
		cd = (Cooldown) gameObject.AddComponent("Cooldown");
		cd.init(10,true);
	}
	
	// Update is called once per frame
	void Update () {
		print(cd.getTimeLeft());
		if(cd.use())
			print ("NOW NOW NOW");
	}
}
