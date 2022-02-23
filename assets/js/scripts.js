let audioPlaying = false;
let audio = null;

function playAudio(url) {
  if (audioPlaying) {
    if (audio) {
      audio.pause();
    }
    audioPlaying = false;
  } else {
    if (!audio) {
      audio = new Audio(url);
      audio.volume = 0.2;
    }
    audioPlaying = true;
    audio.play();
  }
}

window.onload = async () => {
  const res = await fetch("https://now-playing.zane.workers.dev/spotify", {
    method: "GET",
  });

  if (res.status != 200) return;

  const data = await res.json();

  const np = document.getElementById("now-playing");
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
