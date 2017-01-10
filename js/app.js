
var chordNames = ["G","Am","C"];

var playing = false;

$(document).ready(function(){
  
  var jam = $("pre").html();
  
  var line = "";
  
  $(".ui").on("click","a",function(){
    if(playing) {
      playing = false;
      $(this).addClass("paused");
    } else {
      playing = true;
      $(this).removeClass("paused");
    }
    
  })
  
  for(var i = 0; i < jam.length; i++) {
  
    line = line + jam.charAt(i);
    
    if(jam.charCodeAt(i) == 10) {
      addLine(line);
      line = "";
    }

  }

  setInterval(function(){
    if(playing) {
      tick();
    }

  }, 306); //306

  
});

var line = 1;
var bar = 1;
var beat = 1;


function addLine(line) {

  var lineLength = 0;
  var words = [];

  var word = "";
  var spaces = "";
  var currentType = "blank";

  for(var i = 0; i < line.length; i++) {

    var prevCharCode = line.charCodeAt(i-1) || false;
    var thisCharCode = line.charCodeAt(i);

    var nextCharCode = line.charCodeAt(i+1) || false;

    if((thisCharCode != 32 && prevCharCode == 32) || thisCharCode == 10) {
        words.push(word);
        word = "";
    }

    word = word + line.charAt(i);
  }
  
  var type = "chords";

  var line = $("<pre/>");
  
  for(i = 0; i < words.length; i++) {
    var thisword = words[i];
    if(chordNames.indexOf(thisword.trim()) < 0) {
      type = "lyrics";
    }
  }

  if(type == "chords") {
    for(i = 0; i < words.length; i++) {
      var thisword = words[i];
      
      var spaces = "";
      var spacecount = 0;
      for(j = 0; j < thisword.length; j++) {
        if(thisword.charCodeAt(j) == 32) {
          spaces = spaces + thisword.charAt(j);
          spacecount++;
        }
      }
      
      
      var chordEl = $("<span><span class='chord'>" + thisword.trim() + "</span></span>");



      if(spacecount > 4) {
        chordEl.find(".chord").append("<span class='dots'><span class='dot'/><span class='dot'/><span class='dot'/><span class='dot'/></dots>");
        
      }


      line.html(line.html() + chordEl.html() + "<span class='spaces'>" + spaces + "</span>");
    }
    
  } else {
    for(i = 0; i < words.length; i++) {
      var thisword = words[i];
      line.html(line.html() + thisword);
    }

  }

  
  $(".result").append(line);
  line.addClass(type);
  
}





function tick(){

  // var lineEl = $(".result .chords").eq(line - 1);

  var barEl = $(".chord").eq(bar - 1);

  $(".current").removeClass("current");

  barEl.addClass("current");

  beatEl = barEl.find(".dot").eq(beat - 1);
  beatEl.addClass("current");
  
  beat++;
  
  if(beat > 4) {
    bar++;
    beat = 1;
  }

  scroll();
}

var scrolling = false;

function scroll() {
  var currentEl = $(".chord.current")[0];
  
  var viewportOffset = currentEl.getBoundingClientRect();
  var top = viewportOffset.top;

  var currentScroll = window.pageYOffset;
  
  if(top > 400 && scrolling == false) {

    scrolling = true;
    
    $('html, body').animate({
      scrollTop: currentScroll + 400
     }, 1000, function(){
       scrolling = false;
     });

  }
}

