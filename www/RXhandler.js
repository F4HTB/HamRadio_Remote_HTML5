var firstRX=true;
var muteRX=false;
var volumeRX=1;
var audioRX=document.createElement('audio');
	audioRX.addEventListener("loadeddata", onplayRX);
	audioRX.addEventListener("ended", onendedRX);
	audioRX.addEventListener("pause", onendedRX);
	audioRX.addEventListener("onerror", onendedRX);
	audioRX.volume=0.5;
	audioRX.preload="none";
	
var ctx = "";
var sourceNode = "";
var analyser = "";

function startRX(){
	document.getElementById("indcwsRX").innerHTML='<img src="img/critsgrey.png">wsRX';
	if(!firstRX) return;
	firstRX=false;
	audioRX.src="/audio?"+(Math.floor(Math.random() * Math.floor(10000)));
	audioRX.play();
	ctx = new AudioContext();
	sourceNode = ctx.createMediaElementSource(audioRX);
	analyser = ctx.createAnalyser();
	sourceNode.connect(analyser);
	analyser.connect(ctx.destination);
}

function onplayRX(){
	document.getElementById("indcwsRX").innerHTML='<img src="img/critsgreen.png">wsRX';
	drawBF();
}

function onendedRX(){
	document.getElementById("indcwsRX").innerHTML='<img src="img/critsred.png">wsRX';
}

function stopRX(){
	firstRX=true;
	audioRX.pause();
	audioRX.currentTime = 0;
}

function toggleaudioRX(){
	muteRX=!muteRX;
	if(muteRX){volumeRX=audioRX.volume;audioRX.volume=0;}
	else{audioRX.volume=volumeRX;}
}




function drawRXFFT(){
var arrayFFT = new Float32Array(analyser.frequencyBinCount);
analyser.getFloatFrequencyData(arrayFFT);
canvasBFFFT = document.getElementById("canBFFFT");
ctxFFFT = canvasBFFFT.getContext("2d");
ctxFFFT.clearRect(0, 0, canvasBFFFT.width, canvasBFFFT.height);
ctxFFFT.fillStyle = 'rgb(0, 0, 0)';
ctxFFFT.fillRect(0, 0, canvasBFFFT.width, canvasBFFFT.height);
var largeurBarre = (canvasBFFFT.width / analyser.frequencyBinCount);
  var hauteurBarre;
  var x = 0;
  for(var i = 0; i < analyser.frequencyBinCount; i++) {
    hauteurBarre = (arrayFFT[i] + 140)*2;
    ctxFFFT.fillStyle = 'rgb(' + Math.floor(hauteurBarre+100) + ',50,50)';
    ctxFFFT.fillRect(x, canvasBFFFT.height-hauteurBarre/2, largeurBarre, hauteurBarre/2);
    x += largeurBarre + 1;
  }
}

function drawRXSPC(){
var arraySPC = new Float32Array(analyser.fftSize);
analyser.getFloatTimeDomainData(arraySPC);
canvasBFspc = document.getElementById("canBFSPC");
ctxFwf = canvasBFspc.getContext("2d");
ctxFwf.clearRect(0, 0, canvasBFspc.width, canvasBFspc.height);
ctxFwf.fillStyle = 'rgb(0, 0, 0)';
ctxFwf.fillRect(0, 0, canvasBFspc.width, canvasBFspc.height);
ctxFwf.lineWidth = 2;
ctxFwf.strokeStyle = 'rgb(255, 255, 0)';
ctxFwf.beginPath();
var largeurTranche = canvasBFspc.width * 1.0 / analyser.fftSize;
  var x = 0;

  for(var i = 0; i < analyser.fftSize; i++) {
    var v = arraySPC[i] * 200.0;
    var y = canvasBFspc.height/2 + v;

    if(i === 0) {
      ctxFwf.moveTo(x, y);
    } else {
      ctxFwf.lineTo(x, y);
    }
    x += largeurTranche;
  }

  ctxFwf.lineTo(canvasBFspc.width, canvasBFspc.height/2);
  ctxFwf.stroke();
}


function drawBF(){
	drawRXSPC();
	drawRXFFT();
	setTimeout(function(){ drawBF(); }, 200);
}














