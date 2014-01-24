// speed of the ball

var speed = 5.0;
var radius = 0.1;

 
function Start(){

    transform.localScale = Vector3.one * radius * 2;

    var hit : RaycastHit;

    if(Physics.Linecast(transform.position, transform.position - Vector3.up * 500, hit)){
        transform.position = hit.point + Vector3.up * radius;
    }

}


function Update () {

    // base movement off of the camera, not the object.
    // reset the camera's X to zero, so that it is always looking horizontally.
    var x = Camera.main.transform.localEulerAngles.x;
    Camera.main.transform.localEulerAngles.x = 0;

    

    // now collect the movement stuff This is generic direction and rotation.
    var direction = Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"));
    var rotation = Vector3(Input.GetAxis("Vertical"),0,-Input.GetAxis("Horizontal"));

    

    // prevent the ball from moving faster diagnally
    if(direction.magnitude > 1.0) direction.Normalize();
    if(rotation.magnitude > 1.0) rotation.Normalize();

    

    

    // reorientate the movement stuff to align to the camera.
    direction = Camera.main.transform.TransformDirection(direction);
    rotation = Camera.main.transform.TransformDirection(rotation);

    

    // multiply the direction by the speed and deltaTime
    direction *= Time.deltaTime * speed;
   // multiply the rotation by the speed, deltaTime and (60 / radius)...
    rotation *= Time.deltaTime * speed *  60 / radius;

    

    // now update the position by the direction
    transform.Translate(direction, Space.World);
    // and rotate by the rotation
    transform.Rotate(rotation, Space.World);

    

    // return the camera's x rotation.
    Camera.main.transform.localEulerAngles.x = x;

}