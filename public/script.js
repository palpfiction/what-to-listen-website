document.getElementById("form").onsubmit = function(event) {
  if (event) event.preventDefault();

  document.getElementById("form").style.display = "none";
  document.getElementById("description").style.display = "none";
  let spinner = document.getElementById("spinner");
  spinner.style.display = "";

  const user = document.getElementById("account").value;
  const times = document.getElementById("minPlays").value;
  const period = document.getElementById("period").value;

  console.log(
    `llamando api con parámetros user=${user}; minPlays=${times}; period=${period}`
  );

  fetch(
    `https://what-to-listen.glitch.me/get-album?user=${encodeURIComponent(
      user
    )}&times=${times}&period=${period}`
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      spinner.style.display = "none";

      if (response.error) {
        const error = document.getElementById("error2");
        error.append(accountErrorSpan());
        error.append(backButton());
      } else {
        const album = response.album;

        if (!album) {
          const error = document.getElementById("error2");
          error.append(albumErrorSpan());
          error.append(backButton());
          return;
        }

        let result = document.getElementById("album");

        let text = document.createElement("span");
        text.className = "album-title";
        text.textContent = `${album.artist.name} - ${album.name}`;
        result.append(text);

        let img = document.createElement("img");
        img.className = "cover";
        img.src = album.image[album.image.length - 1]["#text"];
        result.append(img);

        let plays = document.createElement("span");
        plays.textContent = `plays: ${album.playcount}`;
        plays.className = "playcount";
        result.append(plays);

        result.append(tryAgainButton());
        result.append(backButton());
      }
    });
};

function cleanAlbum() {
  const album = document.getElementById("album");
  while (album.firstChild) {
    album.removeChild(album.firstChild);
  }
}

function cleanElement(id) {
  const element = document.getElementById(id);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function backButton() {
  const back = document.createElement("button");
  back.textContent = "↩ back";
  back.id = "back";
  back.className = "back";
  back.onclick = function() {
    document.getElementById("form").style.display = "";
    document.getElementById("description").style.display = "";
    document.getElementById("error").style.display = "none";
    document.getElementById("no-album").style.display = "none";
    hideElement("try-again");
    cleanAlbum();
    cleanElement("error2");
  };

  return back;
}

function tryAgainButton() {
  const tryAgain = document.createElement("button");
  tryAgain.textContent = "↻ try again!";
  tryAgain.id = "try-again";
  tryAgain.className = "try-again";
  tryAgain.onclick = function() {
    cleanAlbum();
    document.getElementById("form").onsubmit();
  };

  return tryAgain;
}

function accountErrorSpan() {
  const text = document.createElement("span");
  text.textContent = "well that didn't work... is your account ok?";
  return text;
}

function albumErrorSpan() {
  const text = document.createElement("span");
  text.textContent = "i couldn't find an album with that number of plays...";
  return text;
}

function hideElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = "none";
  }
}

function showElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.style.display = "";
  }
}
