      // Set the video ID
      var videoID = "Put_Your_ID_Here";
      var startTime = 0;

      // PUT THE LYRICS HERE
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
            var matches = currentLineText.match(/\[(\d+):(\d+\.\d+)\](.*)/);
            if (matches && matches.length == 4) {
              var lineTime = parseFloat(matches[1]) * 60 + parseFloat(matches[2]);
              var lineText = matches[3];
              if (lineTime > lastLineTime && currentTime >= lineTime) {
                lyricsDiv.scrollTop = lyricsDiv.scrollHeight;
                lyricsDiv.innerHTML += "<br/><strong>" + lineText + "</strong>";
                currentLine++;
                lastLineTime = lineTime;
              }
            }
          }, 100);
        }
      }