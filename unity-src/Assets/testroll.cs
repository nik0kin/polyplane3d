using UnityEngine;
using System.Collections;

public class testroll : MonoBehaviour {

	Transform cheat;
	float forwardSpeed = 10.0f;

 

	void Start(){
	
		cheat = transform;
	
	}
	
	
	
	void FixedUpdate(){
	
		float hor = Input.GetAxis("Horizontal");
		float ver = Input.GetAxis("Vertical");
		
		Vector3 dir = new Vector3(hor, 0, ver);
		Vector3 rot = new Vector3(ver, 0, hor);

		
		cheat.position = transform.position;
		
		cheat.rotation = Camera.main.transform.rotation;
		
		Vector3 lookAt = cheat.position + cheat.forward;
		
		lookAt.y = transform.position.y;
		
		cheat.transform.LookAt(lookAt);
		
		
		
		rigidbody.AddTorque(cheat.TransformDirection(rot) * forwardSpeed * 0.5f);
		rigidbody.AddForce(cheat.TransformDirection(dir) * forwardSpeed * 0.5f);
	
	}
}
