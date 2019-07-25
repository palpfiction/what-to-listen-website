const axios = require("axios");
const { API_KEY } = process.env;
const API_ROOT = "http://ws.audioscrobbler.com/2.0/";
const PERIOD_VALUES = [
  "overall",
  "7day",
  "1month",
  "3month",
  "6month",
  "12month"
];

function getURL(user, period) {
  return `${API_ROOT}?method=user.gettopalbums
              &user=${user}&period=${period}
              &api_key=${API_KEY}&format=json`;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function getAlbum(user, period, minPlayCount) {
  console.log(`getAlbum::${user}::${period}::${minPlayCount}`);
  try {
  const response = await axios.get(`${getURL(user, period)}&limit=1`);
  if (!response)
    return {
      status: "error",
    }
  const total = response.data.topalbums["@attr"].totalPages;
  return getRandomAlbum(user, period, total, minPlayCount); 
  } catch (error) {
    return {
      status: "error",
      error: error.msg
    }
  }
};

 async function getRandomAlbum(user, period, total, minPlayCount) {
  console.log(`getRandomAlbum::${user}::${period}::${total}::${minPlayCount}`);
  if (total === 1) {
    return {
      status: "notFound"
    };
  }
  
  const albumIndex = getRandomNumber(1, total);
   try {
  const response = await axios.get(`${getURL(user, period)}&limit=1&page=${albumIndex}`);
  if (!response)
    return {
      status: "error",
    }
  const album = response.data.topalbums.album[0];
  if (parseInt(album.playcount) >= minPlayCount) {
      return {
        status: "found",
        result: album
      };
  }
      
  return getRandomAlbum(user, period, albumIndex, minPlayCount);
     
   } catch (error) {
    return {
      status: "error",
      error: error.msg
    }
  }
  
  };

module.exports = getAlbum;