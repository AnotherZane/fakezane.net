function changeTitle() {
    var newtitle = "Bad Choice...";

    var title = $(document).prop('title'); 
    if (title.indexOf(newtitle) == -1) { 
        if (newtitle.charAt(title.length -1) == 'd') 
        {
            setTimeout($(document).prop('title', title + " C"), 500);
            setTimeout(changeTitle, 1000);
        }
        else
        {
            $(document).prop('title', title + newtitle.charAt(title.length));
            setTimeout(changeTitle, 500);
        }
    }
}

var egg = new Egg("up,up,down,down,left,right,left,right,b,a", function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'assets/audio/sayonara.mp3');
    audioElement.setAttribute('loop', 'loop');
    audioElement.addEventListener("canplay",function(){
        audioElement.play();
    });
    $("body").append(audioElement);
    $("#background").css("background-image","url('')");

    var title = "<div><h1>Bad Choice...</h1></div>";
    $("#title").hide();
    $("#subtitle").hide();
    $("#main").prepend(title);
    $("#links").hide();

    document.title = 'B';
    setTimeout(changeTitle, 500);
}).listen();
  