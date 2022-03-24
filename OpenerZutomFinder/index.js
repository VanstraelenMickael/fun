const { default: axios } = require("axios");
const cheerio = require("cheerio");

const FIRSTLETTER = "M"; // Ex : "B"
const WANTED_LETTERS = {
  E: [],
  A: [],
  I: [],
  U: [],
  O: [],
  // R: [],
  // S: [],
  // T: [],
  // V: [],
  // L: [],
};
const SECONDARY_LETTERS = {
  // R: [],
  // S: [],
  // T: [],
  // V: [],
  // L: [],
};
// Ex : {"B" : [], "E" : []}
const LENGTH = 7; // Ex : 6

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const URL = `https://www.listesdemots.net/d/${FIRSTLETTER.toLowerCase()}/1/motsdebutant${FIRSTLETTER.toLowerCase()}.htm`;

async function process() {
  console.log(URL);
  let data = await getWords(URL);
  console.log("Got the data");
  let total_pages = await get_pages(data);

  let words = [];

  for (i = 1; i <= total_pages; i++) {
    if (i == 1) {
      urlComp = `https://www.listesdemots.net/d/${FIRSTLETTER.toLowerCase()}/1/motsdebutant${FIRSTLETTER.toLowerCase()}.htm`;
    } else {
      urlComp = `https://www.listesdemots.net/d/${FIRSTLETTER.toLowerCase()}/1/motsdebutant${FIRSTLETTER.toLowerCase()}page${i}.htm`;
    }
    let axiosData = await axios.get(urlComp);
    let datas = axiosData.data;
    let dots = i % 3 == 1 ? "." : i % 3 == 2 ? ".." : "...";
    console.log(`Progression${dots} - [${i} / ${total_pages}]`);
    // await delay(200);
    let scraped = await scrape(datas);
    words = words.concat(filterByLength(LENGTH, scraped));
  }

  words = filterByWantedLetters(WANTED_LETTERS, words);
  console.log(words);
}

async function getWords(url) {
  console.log("Fetching words...");
  let { data } = await axios.get(url);
  return data;
}

async function get_pages(data) {
  const $ = cheerio.load(data);
  const links = $("p .f2");

  return Number(links.last().html());
}

async function scrape(data) {
  const $ = cheerio.load(data);
  const content = $(".mot").html();
  return clear(content);
}

function clear(string) {
  do {
    string = string.replace("<b>", "");
    string = string.replace("</b>", "");
  } while (string.indexOf("<b>") != -1 && string.indexOf("</b>") != -1);
  string = string.split(" ");
  return string;
}

function filterByLength(LENGTH, array) {
  let filtered = [];
  for (word of array) {
    if (word.length == LENGTH) filtered.push(word);
  }
  return filtered;
}

function filterByWantedLetters(upl, array) {
  // Vérifie la présence des lettres désirées dans chacun des mots et retourne tous les mots possédants les lettres désirées
  let filtered = [];
  for (word of array) {
    let isValid = 0;
    let uplLenght = 0;
    for (letter in upl) {
      if (word.indexOf(letter) != -1) isValid++;
      uplLenght++;
    }
    if (isValid == uplLenght) filtered.push(word);
  }
  return filtered;
}

process();
