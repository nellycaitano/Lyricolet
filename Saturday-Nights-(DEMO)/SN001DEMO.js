var videoID = "aT3s4v2poMY";
var startTime = 0;
var lyrics = `[00:20.00]First line of lyrics
[00:30.00]Second line of lyrics
[00:40.00]Third line of lyrics`;

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: videoID,
    startSeconds: startTime,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

var lyricsDiv = document.getElementById("lyrics");
var lyricLines = lyrics.split("\n");
var currentLine = 0;
var lastLineTime = -1;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    setInterval(function() {
      var currentTime = player.getCurrentTime();
      var currentLineText = lyricLines[currentLine];
      var matches = currentLineText.match(/\[(\d+):(\d+\.\d+)\]/);
      if (matches) {
        var lineTime = parseInt(matches[1]) * 60 + parseFloat(matches[2]);
        if (currentTime >= lineTime) {
          if (lastLineTime == -1 || currentTime >= lastLineTime + 1) {
            lyricsDiv.innerHTML = currentLineText.replace(matches[0], "");
            lastLineTime = currentTime;
            currentLine++;
          }
        }
      }
    }, 100);
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
}
