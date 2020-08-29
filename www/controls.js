var poweron = false;
var txallow = false;
var wshCTRX = "";
var canvasRXsmeter = "";
var ctxRXsmeter = "";
var canvasTXsmeter = "";
var ctxTXsmeter = "";
var indicsTX = ["","","",""];
	
function powertogle()
{
	if(event.srcElement.src.replace(/^.*[\\\/]/, '')=="poweroff.png"){
		event.srcElement.src="img/poweron.png";
		
		document.getElementById("ombre-body").style.display = "block";
		document.getElementById("pop-upspinner").style.display = "block";
		check_connected();
		
		startRX();
		startFFT();
		initTX();
		poweron = true;
		lightinitcontrols();
		initCTRX();
		
		canvasRXsmeter = document.getElementById("canRXsmeter");
		ctxRXsmeter = canvasRXsmeter.getContext("2d");
		initRXSmeter();
		
		canvasTXsmeter = document.getElementById("canTXsmeter");
		ctxTXsmeter = canvasTXsmeter.getContext("2d");
		initTXSmeter();
		
		checklatency();
	}
	else{
		event.srcElement.src="img/poweroff.png";
		stopFFT();
		stopRX();
		killTX();
		poweron = false;
		lightinitcontrols();
		wshCTRX.close();
		initRXSmeter();
		document.getElementById("div-smeterdigitRX").innerHTML="S9+40dB";
		showfreq("000000000");
	}
}


function check_connected() {
	setTimeout(function () {
		if ((wshCTRX.readyState === WebSocket.OPEN) && (wshTX.readyState === WebSocket.OPEN) && (wshFFT.readyState === WebSocket.OPEN) && (!audioRX.paused)){document.getElementById("ombre-body").style.display = "none";document.getElementById("pop-upspinner").style.display = "none";}
		else{check_connected();}
	}, 1000);
}

function lightinitcontrols()
{
	set_css_li_in_ul(document.getElementById("div-mode_menu").getElementsByTagName("li"));
	set_css_li_in_ul(document.getElementById("div-TxPOwer").getElementsByTagName("li"));
	set_css_li_in_ul(document.getElementById("div-AGCset").getElementsByTagName("li"));
	set_css_li_in_ul(document.getElementById("div-NBset").getElementsByTagName("li"));
}

function button_pressed(item)
{
	if(!item){item=event.srcElement;}
	item.classList.remove('button_unpressed');
	item.classList.add('button_pressed');
	button_light(item);
}

function button_unpressed(item)
{
	if(!item){item=event.srcElement;}
	item.classList.remove('button_green');
	item.classList.remove('button_pressed');
	item.classList.add('button_unpressed');
}

function button_light(item,color="G")
{
	if(!item){item=event.srcElement;}
	if(color=="G"){
		if(poweron){item.classList.add('button_green');}
		else{item.classList.remove('button_green');}
	}
	else if(color=="R"){
		if(poweron){item.classList.add('button_red');}
		else{item.classList.remove('button_red');}
	}
	else if(color=="Z"){
		item.classList.remove('button_red');
	}
}

function set_css_li_in_ul(items, tag=true)
{
	for (var i = 0; i < items.length; ++i) {
		if(items[i].hasAttribute('lichecked') && tag){
			button_pressed(items[i]);
		}else{
			button_unpressed(items[i]);
		}
	}
}

function get_actualmode()
{
	var items = document.getElementById("div-mode_menu").getElementsByTagName("li");
	var mode = ""
	for (var i = 0; i < items.length; ++i) {
		if(items[i].hasAttribute('lichecked') ){
			mode = items[i].innerHTML;
		}
	}
	return mode
}

function togle_li()
{
	var items = event.srcElement.parentNode.getElementsByTagName("li");
	for (var i = 0; i < items.length; ++i) {
		items[i].removeAttribute('lichecked');	
	}
	event.srcElement.setAttribute('lichecked',"");	
	set_css_li_in_ul(items);
}

function setAttr(div,mode){
	var items = document.getElementById(div).getElementsByTagName("li");
	for (var i = 0; i < items.length; ++i) {
		items[i].removeAttribute('lichecked');	
		if(items[i].innerHTML==mode){items[i].setAttribute('lichecked',"")}
		if(items[i].getAttribute('v')==mode){items[i].setAttribute('lichecked',"")}
	}
	set_css_li_in_ul(items);
}


function rotatefreq(){
	if (wshCTRX.readyState === WebSocket.OPEN) {
		var item = document.getElementById(event.srcElement.getAttribute('digit'));
		//item.innerHTML = parseInt(item.innerHTML) + parseInt(event.srcElement.getAttribute('v'));
		actufreq=parseInt(
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
		freq=actufreq+parseInt(event.srcElement.getAttribute('v'));
		if(freq<0){freq=actufreq;}
		
		showfreq(freq);
		sendTRXfred();
	}
}


function showfreq(freq){
	freq=freq.toString();
	while (freq.length < 9){freq="0"+freq;}
	document.getElementById("cmhz").innerHTML=freq.substring(0, 1);
	document.getElementById("dmhz").innerHTML=freq.substring(1, 2);
	document.getElementById("umhz").innerHTML=freq.substring(2, 3);
	document.getElementById("ckhz").innerHTML=freq.substring(3, 4);
	document.getElementById("dkhz").innerHTML=freq.substring(4, 5);
	document.getElementById("ukhz").innerHTML=freq.substring(5, 6);
	document.getElementById("chz").innerHTML=freq.substring(6, 7);
	document.getElementById("dhz").innerHTML=freq.substring(7, 8);
	document.getElementById("uhz").innerHTML=freq.substring(8, 9);
}

function scfreq(){
	if (wshCTRX.readyState === WebSocket.OPEN) {
		if(poweron == true){
			item=event.srcElement;
			freq=parseInt(item.getAttribute('frq'));
			showfreq(item.getAttribute('frq'));
		}
		sendTRXfred();
	}
}

function sendTRXmode(){
	if (wshCTRX.readyState === WebSocket.OPEN) {
		wshCTRX.send("SMODE:"+event.srcElement.innerHTML);
	}
}

function sendTRXfred(){
	
	freq=(
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
	if (wshCTRX.readyState === WebSocket.OPEN) {wshCTRX.send("SFREQ:"+freq);}
	audioRX.currentTime = 0;
}

function initRXSmeter(){
	ctxRXsmeter.fillStyle = "black"; 
	ctxRXsmeter.fillRect(0, 0, 250, 50);
	document.getElementById("div-smeterdigitRX").innerHTML="S0";
}

function initTXSmeter(){
	ctxTXsmeter.fillStyle = "black"; 
	ctxTXsmeter.fillRect(0, 0, 250, 40);
	document.getElementById("div-smeterdigitTX").innerHTML='<p id="TXPWR">PWR:000w</p><p id="TXSWR">SWR:000~</p><p id="TXALC">ALC:000%</p><p id="TXMOD">MOD:000%</p>';
	indicsTX = [document.getElementById("TXPWR"), document.getElementById("TXSWR"), document.getElementById("TXALC"), document.getElementById("TXMOD")];
}

function drawRXSmeter(spoint) {
	imgObjSPRX = new ImageData(canvasRXsmeter.width, 1);
	let canvaswidth = canvasRXsmeter.width * 4;
	const maxs = spoint*80;
	for (let px = 0; px < canvaswidth; px += 4) {
		if((px<(maxs)) && ((px % 80)!==0)){
		imgObjSPRX.data[px] = 0;   // red
		imgObjSPRX.data[px+1] = 215; // green
		imgObjSPRX.data[px+2] = 233; // blue
		imgObjSPRX.data[px+3] = 255; // alpha
		}
	}
	for(let Line = 0; Line < canvasRXsmeter.height; Line++){
		ctxRXsmeter.putImageData(imgObjSPRX, 0, Line);
	}
	
	var above_nine="";
	var res = "S9";
	if(spoint >= 9){
		above_nine = spoint - 9;
	}
	else{res = "S" + spoint;}
	
	if(above_nine > 0){
		res += "+" + (10 * above_nine)+"dB";
	}
	document.getElementById("div-smeterdigitRX").innerHTML=res;
}

var colorTXmeter=[[255,0,0,200],[0,255,0,200],[0,0,255,100],[255,255,0,200]];

function drawTXSmeter(spoints) { //pwr,swr,alc,mod

	let canvaswidth = canvasTXsmeter.width * 4;
	for (let a = 0; a < 4; a++) {
		let imgObjSPTX = new ImageData(canvasTXsmeter.width, 1);
		var maxs = spoints[a]*10;
	if(maxs<20){maxs=20;}
		for (let px = 0; px < canvaswidth; px += 4) {
			if((px<(maxs))){
			imgObjSPTX.data[px] = colorTXmeter[a][0];   // red
			imgObjSPTX.data[px+1] = colorTXmeter[a][1]; // green
			imgObjSPTX.data[px+2] = colorTXmeter[a][2]; // blue
			imgObjSPTX.data[px+3] = colorTXmeter[a][3]; // alpha
			}
		}
		let posinit = 10 * a;
		let posend =  (10 *  (a+1)) -2;
		for(let Line = posinit; Line < posend; Line++){
			ctxTXsmeter.putImageData(imgObjSPTX, 0, Line);
		}
	}
	indicsTX[0].innerHTML="PWR:"+(spoints[0]/20)+"w";
	indicsTX[1].innerHTML="SWR:"+spoints[1]+"~";
	indicsTX[2].innerHTML="ALC:"+spoints[2]+"%";
	indicsTX[3].innerHTML="MOD:"+spoints[3]+"%"
}

var startTime;
function checklatency() {
	setTimeout(function () {
		startTime = Date.now();
		if (wshCTRX.readyState === WebSocket.OPEN) {wshCTRX.send("PING0");}
		if(poweron == true){checklatency();}
	}, 5000);
}

function showlatency(){
	latency = Date.now() - startTime;
	document.getElementById("div-latencymeter").innerHTML="latency:"+latency+"ms";
}

function appendwshCTRXCrtol( msg ){
	//console.log(msg.data);
	words = String(msg.data).split(':');
	if(words[0] == "RSMET"){drawRXSmeter(words[1]);}
	else if(words[0] == "TXMET"){drawTXSmeter(words[1].split("/"));}
	else if(words[0] == "PONG1"){showlatency();}
	else if(words[0] == "RFREQ"){showfreq(words[1]);}
	else if(words[0] == "TXALW"){txallow = words[1] | 0;if(txallow){button_light(document.getElementById("record"),"Z");}else{button_light(document.getElementById("record"),"R");}}
	else if(words[0] == "RMODE"){setAttr("div-mode_menu",words[1]);}
	else if(words[0] == "ROPTI"){
		if(words[1].indexOf("AGC_") !== -1)(setAttr("div-AGCset",words[1].replace("AGC_","")));
		else if(words[1].indexOf("NB_") !== -1)(setAttr("div-NBset",words[1].replace("NB_","")));
		else if(words[1].indexOf("TXPowerL") !== -1)(setAttr("div-TxPOwer",words[1].replace("TXPowerL","")));
		}
	
}

function initCTRX(){
	document.getElementById("indcwsCtrl").innerHTML='<img src="img/critsgrey.png">wsCtrl';
	wshCTRX = new WebSocket( 'wss://' + window.location.href.split( '/' )[2] + '/wsTRXC' );
	wshCTRX.onopen = appendwshCTRXOpen;
	wshCTRX.onmessage = appendwshCTRXCrtol;
	wshCTRX.onerror = appendwshCTRXError;
	wshCTRX.onclose = appendwshCTRXclose;
}

function appendwshCTRXclose(){
	document.getElementById("indcwsCtrl").innerHTML='<img src="img/critsred.png">wsCtrl';
}

function appendwshCTRXOpen(){
	document.getElementById("indcwsCtrl").innerHTML='<img src="img/critsgreen.png">wsCtrl';
}

function appendwshCTRXError(err){
    wshCTRX.close();
	document.getElementById("indcwsCtrl").innerHTML='<img src="img/critsred.png">wsCtrl';
	initCTRX();
}

function sendTXpower(){
	if (wshCTRX.readyState === WebSocket.OPEN) {wshCTRX.send("SOPTI:TXPowerL"+event.srcElement.getAttribute('v'));}
}

function sendAGC(){
	if (wshCTRX.readyState === WebSocket.OPEN) {wshCTRX.send("SOPTI:AGC_"+event.srcElement.getAttribute('v'));}
}

function sendNB(){
	if (wshCTRX.readyState === WebSocket.OPEN) {wshCTRX.send("SOPTI:NB_"+event.srcElement.getAttribute('v'));}
}

function sendctrlTX(en){
	if (wshCTRX.readyState === WebSocket.OPEN) {wshCTRX.send("000TX:"+(en | 0));}
	if(!(en | 0)){initTXSmeter()};
}















