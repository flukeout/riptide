var chordNames = ["G","Am","C", "Fmaj7", "Em"];

var playing = false;

var line = "";

var bar = 1;
var beat = 1;
var interval = 320;
var beatcount = 4;
var countin = 8; //8 usually

$(window).on("scroll",function(){
  if(scrolling == false) {
    pause();
  }
})

$(document).on("keypress",function(e){
  if(e.keyCode == 32) {
    if(playing) {
      pause();
    } else {
      start();
    }
    return false;
  }
})


$(document).ready(function(){

  var jam = $("pre").html();

  $(".ui").on("click","a",function(){
    if(playing) {
      pause();
    } else {
      start();
    }
    return false;
  })

  for(var i = 0; i < jam.length; i++) {
    line = line + jam.charAt(i);
    if(jam.charCodeAt(i) == 10) {
      addLine(line);
      line = "";
    }
  }

  $(".chords").on("click",function(){
    pause();
    $(".chords.current").removeClass('current');
    $(".chord.current").removeClass('current');
    $(this).addClass("current");
    bar = $(this).closest(".chords").find(".chord:first-child()").attr("bar");
    beat = 1;
  });

  setInterval(function(){
    if(playing) {
      tick();
    }
  }, 320);  // 102bpm   60,000 / 102 = 588 (/2)
  //294
  // 102 BPM

});


var stick = true;

function pause() {
  playing = false;
  $(".ui a").addClass("paused");
  countin = 8; // was 8
}

function start() {
  playing = true;
  $(".ui a").removeClass("paused");
}

var chordCount = 1;

function addLine(line) {

  var lineLength = 0;
  var words = [];

  var word = "";
  var spaces = "";
  var currentType = "blank";
  var lineData = []; 

  for(var i = 0; i < line.length; i++) {
    var prevCharCode = line.charCodeAt(i-1) || false;
    var thisCharCode = line.charCodeAt(i);
    
    if((thisCharCode != 32 && prevCharCode == 32) || thisCharCode == 10 || (thisCharCode == 32 && prevCharCode != 32)) {
      if(word.length > 0) {
        words.push(word);
        
        if(chordNames.indexOf(word) > -1) {
          lineData.push({
            chord: word,
            position: i
          })
        }
      }

      word = "";
    }
    word = word + line.charAt(i);
  }
  
  console.log(lineData);
  
  var type = "chords";

  var line = $("<pre/>");

  for(i = 0; i < words.length; i++) {
    var thisword = words[i];
    thisword = thisword.replace(".","").trim();
    if(chordNames.indexOf(thisword) < 0 && thisword.length > 0) {
      type = "lyrics";
    }
  }
  
  
  if(words.length == 0){
    type = "break"
  }
  

  if(type == "chords") {

    for(i = 0; i < words.length; i++) {

      var thisword = words[i];
      var beatCount = 4;
      var spaces = "";

      
      var nextword = words[i+1] || "";
      var spacecount = 0;      
      for(j = 0; j < nextword.length; j++) {
        if(nextword.charCodeAt(j) == 32) {
          spacecount++;
        }
      }
      
      var allspaces = true;

      for(j = 0; j < thisword.length; j++) {
        if(thisword.charCodeAt(j) == 32) {
          spaces = spaces + thisword.charAt(j);
          spacecount++;
        } else {
          allspaces = false;
        }
      }
      
      
      if(!allspaces) {
        var chordEl = $("<span><span class='chord'>" + thisword.trim().replace("."," ") + "</span></span>");
        chordEl.find(".chord").attr("bar",chordCount).attr("beats", beatCount);

        chordCount++;
        chordEl.find(".chord").append("<span class='ball'/>");
        
        // if(spacecount > 4) {

          // New - progress
          chordEl.find(".chord").append("<span class='length'><span class='dot'/><span class='progress'/></span>");
          
          chordEl.find(".length").css("width",(spacecount * 14) - 15);
          chordEl.find(".length").css("right",-1 * spacecount * 14 + 6);
          chordEl.find(".progress").css("transition","width linear ." + interval + "s");

          // Old..
          // chordEl.find(".chord").append("<span class='dots'><span class='dot'/></span>");

          // chordEl.find(".dots").css("left", spacecount/2 * 14 + 15 );
          // for(var j = 0; j < beatCount; j++) {
          //   chordEl.find(".dots").append("<span class='dot'/>")
          // }
          // -- add dots
        // }

        line.html(line.html() + chordEl.html());  
      } 

      line.html(line.html() + "<span class='spaces'>" + spaces + "</span>");  
    }
    
  } else if (type=="lyrics") {

    for(i = 0; i < words.length; i++) {
      var thisword = words[i];
      line.html(line.html() + thisword);
    }
    
  } else if (type == "break"){
    line.html("<hr/>");
  }

  
  
  
  $(".result").append(line);
  line.addClass(type);
  
}



function tick(){


  if(countin > 0) {
    if(countin % 2 == 0) {
      playSound("stick");
    }
    countin--;
    return;
  } 
    
  var barEl = $(".chord").eq(bar - 1);

  // $(".current").removeClass("current");
  
  $(".chords").removeClass("current");
  $(".chord").removeClass("current");


  barEl.addClass("current");

  
  beatEl = barEl.find(".dot");
  
  if(beat == 3) {
    beatEl.addClass("current");
    beatEl.addClass("popa");
  }

  beatcount = barEl.attr("beats");

  progressEl = barEl.find(".progress");

  var percent = beat/beatcount * 100;

  progressEl.css("width", percent + "%");

  barEl.closest(".chords").addClass("current");


  if(beat == 1 || beat == 3) {
    $(barEl).closest(".chords").addClass("hit");
    $(".metronome").addClass("hit");
    $(".chord.current").addClass("pop");

  } else {
    $(".pop").removeClass("pop");
    $(".hit").removeClass("hit");
  }
  beat++;

  if(beat > beatcount) {
    bar++;
    beat = 1;
  }

  scroll();
}



// Scrolls the page if needed

var scrolling = false;

function scroll() {
  var currentEl = $(".chord.current")[0];
  var viewportOffset = currentEl.getBoundingClientRect();
  var top = viewportOffset.top;

  var currentScroll = window.pageYOffset;
  
  // When it gets low on the page, or is above the viewable part of the screen
  if((top < 0 || top > (window.innerHeight - 220)) && scrolling == false) {
    scrolling = true;
    $('html, body').animate({
      scrollTop: currentScroll + top - 10
     }, 500, function(){
       setTimeout(function(){
       scrolling = false;
      },50);
     });
  }

}

