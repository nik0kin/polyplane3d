using UnityEngine;
using System.Collections;

public class Cooldown : MonoBehaviour {
    private double onCD;//when the ability goes on cd
    private float totalCD;//total cooldown in seconds
    private double percentCDreduc;
    private bool startOffCD;
	
	// Use this for initialization
	void Start () {
		
	}
	public void init(float cdLength, bool startOffCD){
		totalCD = cdLength;//cd length in seconds
		this.startOffCD = startOffCD;	
	}
	
	// Update is called once per frame
	void Update () {
		
	}

   
    //returns a boolean with if its ready or not
    public bool ready() {
        return Time.fixedTime >= onCD + getCooldownLength();
    }
    public bool use() {
        if (onCD == 0 && !startOffCD)
            onCD = Time.fixedTime;

        if (Time.fixedTime >= onCD + getCooldownLength()) {
            onCD = Time.fixedTime;
            return true;
        }
        return false;
    }
    public double getTimeLeft() {
        if (totalCD == -10000) return -10000;
        if ((onCD + totalCD) - Time.fixedTime > 0)
            return (onCD + getCooldownLength()) - Time.fixedTime;
        return 0;
    }
   /* public double getFormattedTimeLeft(double theGameTime, int keep) {
        return Mathf.Round(getTimeLeft(theGameTime),keep);
    }  */
    public void reset() {
        onCD = -getCooldownLength();//why does this work?
    }
    public void addSeconds(float seconds) {
        onCD = onCD + seconds ;
    }
    //returns if it just put it back on cooldown
    public bool pushback(float amt) {
        bool offCd = use();
        //then add stuff both times
        addSeconds(amt);
        return offCd;
    }
    public double getCooldownLength() {
        return totalCD - totalCD*percentCDreduc;
    }
    public void setCDReduc(double percent) {
        percentCDreduc = percent;
    }
    
}


