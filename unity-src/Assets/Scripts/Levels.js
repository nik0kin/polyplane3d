#pragma strict



static function getLevelString(num) : String{
    //alert("getting "+num);
    
    //uppercase is going down a level, 2 enter, 3 exit
    var s : String;
    switch(num){
    	case 1:
	s = "2\n" +
    "-\n" +
    "11111111111111111\n" +
    "10000000F00000001\n" +
    "11111111111111111\n" +
    "120A0B00C00D0E031\n" +
    "11111111111111111\n" +
    "100000I0000010001\n" +
    "10111111111010101\n" +
    "10100000000010101\n" +
    "10101111111110101\n" +
	"10101000J00000101\n" +
	"10101111111111101\n" +
	"101L1000000000101\n" +
	"10101111111110101\n" +
	"101000000K00001H1\n" +
	"10111111111111111\n" +
	"1000000000000G001\n" +
	"11111111111111111\n" +
    "-\n" +
    "11111111111111111\n" +
    "10100001f10000001\n" +
    "10101111010111101\n" +
    "101a1b01c10d1e101\n" +
    "10101101011010101\n" +
    "101001i1011010101\n" +
    "10110111010010101\n" +
    "10110001010110101\n" +
    "10111111010110101\n" +
    "10100001j10010101\n" +
    "10110101011010101\n" +
    "101l0101001010101\n" +
    "10111101111010101\n" +
    "101000000k10101h1\n" +
    "10111111111010101\n" +
    "1000000000001g101\n" +
    "11111111111111111\n";
    break;
    
      case 2:
    s = "3\n" +
    "-\n" +
    "11111111111111111\n" +
    "1A000000000000101\n" +
    "10111111111110101\n" +
    "101C000D100010101\n" +
    "10111111101010101\n" +
    "1010000000101B001\n" +
    "10101111101011111\n" +
    "10101000101000021\n" +
    "10101110101111111\n" +
    "101000101E10001F1\n" +
    "10111010111010101\n" +
    "10001010000010101\n" +
    "11111111111010101\n" +
    "100G0000001010101\n" +
    "10111111101010101\n" +
    "10000000100000001\n" +
    "11111111111111111\n" +
    "-\n" +
    "11111111111111111\n" +
    "1a0H0000000000001\n" +
    "10111111111011101\n" +
    "101c100d000010101\n" +
    "10101111111010111\n" +
    "1010000000101b001\n" +
    "10111011101111101\n" +
    "10001010001000001\n" +
    "11101010111011111\n" +
    "1I101J1K1e101L1f1\n" +
    "10101111101010101\n" +
    "1010000M1010101N1\n" +
    "10111111101010111\n" +
    "101g0000101O10001\n" +
    "10111110101111101\n" +
    "10000000100000001\n" +
    "11111111111111111\n" +
    "-\n" +
    "11111111111111111\n" +
    "100h1000001000001\n" +
    "10101011111010101\n" +
    "10101000001010101\n" +
    "10101111101010101\n" +
    "10100000001010101\n" +
    "10111111101010101\n" +
    "10100010101010101\n" +
    "11101010101011101\n" +
    "1i101j0k10101l001\n" +
    "10101111101011111\n" +
    "1010000m1010101n1\n" +
    "10111111101010101\n" +
    "10000010101o00101\n" +
    "11111010101111101\n" +
    "13000010000000001\n" +
    "11111111111111111\n";
    break;
    
		case 3:
		    s = //"z\n"+ //z = new style
		        "3\n"+
		        "-\n"+
		        "11111111111111111\n" +
		        "120000000A101B101\n" + //first in
		        "11111111111010101\n" +
		        "10100000100010001\n" + //second in
		        "10101010101011101\n" +
		        "10101010101000001\n" + //3rd in
		        "10101010101011101\n" +
		        "10001010001010001\n" + //4th
		        "10111011101110111\n" +
		        "101C101D101E101F1\n" +
		        "10101010111010101\n" +
		        "1010101000001G101\n" +
		        "10101010111010101\n" +
		        "101010101H1010101\n" + //7
		        "10101111101111101\n" +
		        "1I100000000000001\n" + //8
		        "11111111111111111\n" +
		        "-\n" +
				"11111111111111111\n" +
				"100010000a001b101\n" +
				"10101011111010101\n" +
				"101010100010100J1\n" +
				"10101010111011111\n" +
				"10101010101000001\n" +
				"10101010101111101\n" +
				"1K101L101M100N101\n" +
				"10101110101000101\n" +
				"101c101d101e001f1\n" +
				"10111010101111111\n" +
				"1000000010001g101\n" +
				"11111111111010101\n" +
				"10001O000h1P101Q1\n" +
				"10101111111110101\n" +
				"1i1R1000000000001\n" +
				"11111111111111111\n" +
				"\n" +
				"11111111111111111\n" +
				"10001000000000001\n" +//1
				"11101011111011111\n" +
				"101000100000000j1\n" +
				"10111011111111111\n" +
				"10001000000000001\n" +//3
				"11101110111011101\n" +
				"1k101l101m101n101\n" +//4
				"10101010101010101\n" +
				"10101010101010101\n" +//5
				"10101010101010101\n" +
				"10101010101010101\n" +
				"10101010101110111\n" +
				"10001o10101p000q1\n" +//7
				"11111110101111111\n" +
				"100r0000100000031\n" +
				"11111111111111111\n";
    }
    return s;
}