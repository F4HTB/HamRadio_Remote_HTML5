function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var callsign=getCookie("callsign");
  if (callsign != "") {
    alert("Welcome again " + callsign);
  } else {
     callsign = prompt("Please enter your Call Sign:","");
     if (callsign != "" && callsign != null) {
       setCookie("callsign", callsign, 180);
     }
  } 
	get_freqfromcokkies();
}

function get_freqfromcokkies(){
	var freqs=getCookie("freqs").replace("//", '/').split("/").sort();
	var x = document.getElementById("selectpersonalfrequency");
	var length = x.options.length;
	for (i = length-1; i >= 0; i--) {
	  x.options[i] = null;
	}
	
	for (i in freqs) {
		var option = document.createElement("option");
		if(freqs[i]!=""){
			freq=freqs[i].split(",")[0]
			mode=freqs[i].split(",")[1]
			option.text = parseInt(freq)+" in "+mode;
			option.value = freqs[i];
			x.add(option); 
		}
	}

}

function save_freqtocokkies(){
	var freq=(
	document.getElementById("cmhz").innerHTML+
	document.getElementById("dmhz").innerHTML+
	document.getElementById("umhz").innerHTML+
	document.getElementById("ckhz").innerHTML+
	document.getElementById("dkhz").innerHTML+
	document.getElementById("ukhz").innerHTML+
	document.getElementById("chz").innerHTML+
	document.getElementById("dhz").innerHTML+
	document.getElementById("uhz").innerHTML
	);
	var mode=get_actualmode();
	var freqs=getCookie("freqs").replace("//", '/')+freq.toString()+","+mode+"/";
	setCookie("freqs", freqs, 180);
	get_freqfromcokkies();
}

function delete_freqfromcokkies(){
	var e = document.getElementById("selectpersonalfrequency");
	var freq = e.options[e.selectedIndex].value;
	var freqs=getCookie("freqs").replace(freq+"/", '').replace("//", '/');
	setCookie("freqs", freqs, 180);
	get_freqfromcokkies();
}

function recall_freqfromcokkies(){
	var e = document.getElementById("selectpersonalfrequency");
	var freq = e.options[e.selectedIndex].value.split(",")[0];
	var mode = e.options[e.selectedIndex].value.split(",")[1];
	if (wshCTRX.readyState === WebSocket.OPEN) {wshCTRX.send("SFREQ:"+freq);wshCTRX.send("SMODE:"+mode);}
}









