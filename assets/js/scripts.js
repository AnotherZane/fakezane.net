let audioPlaying = false;
let audio = null;
let refreshedCount = 0;

function playAudio(url) {
  if (audioPlaying) {
    if (audio) {
      audio.pause();
    }
    audioPlaying = false;
  } else {
    if (!audio || audio.src != url) {
      audio = new Audio(url);
      audio.volume = 0.2;
    }
    audioPlaying = true;
    audio.play();
  }
}

const fetchSpotifyStatus = async () => {
  const res = await fetch("https://now-playing.zane.workers.dev/spotify", {
    method: "GET",
  });

  if (res.status != 200) return;

  const data = await res.json();

  const np = document.getElementById("now-playing");

  if (audioPlaying) {
    audio.pause();
    audioPlaying = false;
    playAudio(data.preview_url);
  }

  np.innerHTML =
    '<div id="darken"><img src="' +
    data.album.images[0].url +
    '" alt="" onclick="playAudio(\'' +
    data.preview_url +
    "')\"></div>" +
    "<div><p>I'm listening to:</p><p>" +
    '<a href="' +
    data.external_urls.spotify +
    '">' +
    data.name +
    "</a></p><p>" +
    data.artists
      .map(
        (x) =>
          '<a class="art" href="' +
          x.external_urls.spotify +
          '">' +
          x.name +
          "</a>"
      )
      .join(", ") +
    "</p></div>";
};

window.onload = async () => {
  await fetchSpotifyStatus();
  const interval = setInterval(async () => {
    await fetchSpotifyStatus();
    refreshedCount++;
    if (refreshedCount > 10) clearInterval(interval);
  }, 30000);
};
