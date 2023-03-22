const videoID = "LOxkNJx0kRc";
const startTime = 0;
const lyrics = `[00:20.00]First line of lyrics
[00:30.00]Second line of lyrics
[00:40.00]Third line of lyrics`;

let player;
let currentLine = 0;
let lastLineTime = -1;

const playerReadyCheck = setInterval(() => {
  if (typeof YT !== "undefined" && YT.loaded) {
    clearInterval(playerReadyCheck);
    onYouTubeIframeAPIReady();
  }
}, 100);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: videoID,
    startSeconds: startTime,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

function onPlayerError(event) {
  const errorCode = event.data;
  if ([2, 100, 101, 150].includes(errorCode)) {
    console.error(`YouTube video error. Error code: ${errorCode}`);
    document.getElementById("player").innerHTML = "There was an error loading the YouTube video.";
  }
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    setInterval(() => {
      const currentTime = player.getCurrentTime();
      const currentLineText = lyricLines[currentLine];
      const matches = currentLineText.match(/\[(\d+):(\d+\.\d+)\]/);
      if (matches) {
        const lineTime = parseInt(matches[1]) * 60 + parseFloat(matches[2]);
        if (currentTime >= lineTime) {
          if (lastLineTime === -1 || currentTime >= lastLineTime + 1) {
            lyricsDiv.childNodes[currentLine].classList.remove("current");
            currentLine++;
            lyricsDiv.childNodes[currentLine].classList.add("current");
            lastLineTime = currentTime;
          }
        }
      }
    }, 100);
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
}

const lyricsDiv = document.getElementById("lyrics");
const lyricLines = lyrics.split("\n");

for (let i = 0; i < lyricLines.length; i++) {
  const line = lyricLines[i];
  const lineDiv = document.createElement("div");
  lineDiv.textContent = line.replace(/\[\
