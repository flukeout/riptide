

var soundContext = new AudioContext();
var soundEnabled = true;

var url = window.location;
var path = url.pathname;
path = ".";

var sounds = {
  "stick" : {
    buffer : null,
    url : path + "/sounds/stick.mp3",
    volume : 1
  }

};

for(var key in sounds) {
  loadSound(key);
}

var soundsLoaded = 0;

function loadSound(name){

  var url = sounds[name].url;

  var buffer = sounds[name].buffer;

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    soundContext.decodeAudioData(request.response, function(newBuffer) {
      sounds[name].buffer = newBuffer;
      soundsLoaded++;
      if(soundsLoaded == Object.keys(sounds).length) {
        // allSoundsLoaded();
        console.log("all sounds loaded");
      }
    });
  }
  request.send();
}

function playSound(name, vol){
  if(!soundEnabled) {
    return;
  }

  var buffer = sounds[name].buffer;
  var soundVolume = sounds[name].volume || 1;

  if(buffer){
    var source = soundContext.createBufferSource(); // creates a sound source
    source.buffer = buffer;                         // tell the source which sound to play
    
    var volume = soundContext.createGain();
    volume.gain.value = vol || soundVolume;
    
    
  
    
    volume.connect(soundContext.destination)
    
    source.connect(volume);       // connect the source to the context's destination (the speakers)
    source.start(0);
  }
}

