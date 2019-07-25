
document.getElementById("form").onsubmit = function (event) {
  event.preventDefault();
  
  let button = document.getElementById("button");
  let spinner = document.getElementById("spinner")
  button.style.display = "none";
  spinner.style.display = "";
  
  const user = document.getElementById("account").value;
  const times = document.getElementById("minPlays").value;
  
  console.log("llamando api...")
  
  fetch(`https://what-to-listen.glitch.me/get-album?user=${user}&times=${times}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    spinner.style.display = "none";
    document.getElementById("form").style.display = "none";
    
    if (response.error) {
      document.getElementById("error").style.display = "";
      document.getElementById("try-again").style.display = ""
    } else {
    
    const album = response.album;
    
    if (!album) {
      document.getElementById("no-album").style.display = "";
      document.getElementById("try-again").style.display = ""
    }
    
    let result = document.getElementById("album");
      
    let text = document.createElement("span");
    text.className= "album-title";
    text.textContent = `${album.name} - ${album.artist.name}`;
    result.append(text);

    let img = document.createElement("img");
    img.className = "cover";
    img.src = album.image[album.image.length - 1]['#text'];
    result.append(img);
      
    let plays = document.createElement("span");
    plays.textContent = `plays: ${album.playcount}`;
    result.append(plays);
    
      
    document.getElementById("try-again").style.display = "";
    }
  });
}

document.getElementById("try-again").onclick = function() {
  document.getElementById("form").style.display = "";
  document.getElementById("button").style.display = "";
  document.getElementById("error").style.display = "none";
  document.getElementById("no-album").style.display = "none";
  document.getElementById("try-again").style.display = "none";
  
  const album = document.getElementById("album");
  
  while (album.firstChild) {
    album.removeChild(album.firstChild);
  }
}
