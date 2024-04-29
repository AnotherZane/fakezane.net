const updateSpotifyStatus = async (data) => {
  const np = document.getElementById("now-playing");

  np.innerHTML = `
  <div id="darken">
    <a target="__blank" href="https://open.spotify.com/track/${data.track_id}">
      <img src="${data.album_art_url}" alt="${data.album}" />
    </a>
  </div>
  <div>
    <p>I'm listening to:</p>
    <p><a target="__blank" href="https://open.spotify.com/track/${data.track_id}">${data.song}</a></p>
    <p><a target="__blank" href="https://open.spotify.com/search/${data.artist}">${data.artist}</a></p>
  </div>
  `;
};

const updateYTMusicStatus = async (name, artist, img) => {
  const np = document.getElementById("now-playing");

  np.innerHTML = `
  <div id="darken">
    <a target="__blank" href="https://music.youtube.com/search?q=${name}+${artist}">  
      <img src="${img}" alt="${artist}" /></div>
    </a>
  <div>
    <p>I'm listening to:</p>
    <p><a target="__blank" href="https://music.youtube.com/search?q=${name}+${artist}">${name}</a></p>
    <p><a target="__blank" href="https://music.youtube.com/search?q=${artist}">${artist}</a></p>
  </div>`;
};

const handlePresenceUpdate = (data) => {
  let dat;
  if (data.t == "INIT_STATE") dat = data.d["608143610415939638"];
  else dat = data.d;

  if (dat.spotify) {
    updateSpotifyStatus(dat.spotify);
    return;
  }

  const ytMusic = dat.activities.filter(
    (x) => x.application_id == "1177081335727267940"
  );

  if (ytMusic.length > 0) {
    const img = ytMusic[0].assets.large_image.replace(
      "mp:",
      "https://media.discordapp.net/"
    );
    updateYTMusicStatus(ytMusic[0].details, ytMusic[0].state, img);
    return;
  }

  const np = document.getElementById("now-playing");
  np.innerHTML = "";
};

let hbInterval;
let ws;

const sendWsMessage = (op, d) => {
  ws.send(JSON.stringify({ op, d }));
};

const handleWsMessage = (data) => {
  switch (data.op) {
    case 0: {
      handlePresenceUpdate(data);
      break;
    }
    case 1: {
      sendWsMessage(2, { subscribe_to_ids: ["608143610415939638"] });

      if (hbInterval) clearInterval(hbInterval);

      hbInterval = setInterval(() => {
        sendWsMessage(3, {});
      }, data.d.heartbeat_interval);
      break;
    }
    default: {
      console.log("Lanyard sent unknown:", data);
    }
  }
};

window.onload = async () => {
  ws = new WebSocket("wss://api.lanyard.rest/socket");
  ws.onopen = () => console.log("Connected to Lanyard");
  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    handleWsMessage(data);
  });
  ws.onclose = () => {
    console.log("Disconnected from Lanyard");
    clearInterval(hbInterval);
    setTimeout(() => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");
    }, 3000);
  };
};
