const videoID = "LOxkNJx0kRc";
const startTime = 0;
const lyrics = `[00:20.00]First line of lyrics
[00:30.00]Second line of lyrics
[00:40.00]Third line of lyrics`;

let player, currentLine = 0, lastLineTime = -1;
const lyricsDiv = document.getElementById("lyrics");

const onPlayerStateChange = event => {
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
};

const onPlayerReady = event => event.target.playVideo();

const onPlayerError = event => {
  const errorCode = event.data;
  if ([2, 100, 101, 150].includes(errorCode)) {
    console.error(`YouTube video error. Error code: ${errorCode}`);
    document.getElementById("player").innerHTML = "There was an error loading the YouTube video.";
  }
};

const copyLyrics = () => {
  const lyricsText = lyricsDiv.innerText;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(lyricsText).then(() => {
      alert("Lyrics copied to clipboard!");
    }).catch(() => {
      copyFallback(lyricsText);
    });
  }
};

document.getElementById("copyButton").addEventListener("click", copyLyrics);

const lyricLines = lyrics.split("\n");
lyricLines.forEach(line => {
  const lineDiv = document.createElement("div");
  lineDiv.innerText = line.replace(/\[\d\d:\d\d\.\d+\]/, "");
  lyricsDiv.appendChild(lineDiv);
});

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
