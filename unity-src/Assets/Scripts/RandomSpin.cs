using UnityEngine;
using System.Collections;

public class RandomSpin : MonoBehaviour {
	public float baseSpeed = 0;
	public float maxRandom = 3.0f;
	
	float startingXspin,startingZspin,startingYspin;
	
	// Use this for initialization
	void Start () {
		startingXspin = baseSpeed;
		startingYspin = baseSpeed;
		startingZspin = baseSpeed;
	}
	
	// Update is called once per frame
	void Update () {
		startingXspin += Random.Range(-maxRandom, maxRandom);
		startingYspin += Random.Range(-maxRandom, maxRandom);
		startingZspin += Random.Range(-maxRandom, maxRandom);
			
		//if(float.IsNaN(Time.deltaTime * startingXspin))//idk why this throws something
			this.transform.Rotate(Time.deltaTime * startingXspin,
					Time.deltaTime * startingYspin,Time.deltaTime * startingZspin);

	}
}
