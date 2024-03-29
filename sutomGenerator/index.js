const { default: axios } = require("axios");
const cheerio = require("cheerio");
const { filter } = require("domutils");

const FIRSTLETTER = "C"; // Ex : "B"
const NEXTLETTERS = {}; // Ex : { 2 : "B", 6: "U"}
const WRONG_LETTERS = ["O", "U", "P", "E", "R", "L", "A"]; // Ex : ["A","E"]
const KNOWN_WRONG_POSITION_LETTERS = { I: [3, 5], M: [3, 4], T: [6] }; // Ex : {"B" : ["2","3"], "E" : ["2","4"]}
const LENGTH = 6; // Ex : 6

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

  words = filterByNonPresentLetters(WRONG_LETTERS, words);
  words = filterByPresentLetters(KNOWN_WRONG_POSITION_LETTERS, words);
  words = filterByPositionnedLetters(NEXTLETTERS, words);
  words = filterByKnownWrongPosition(KNOWN_WRONG_POSITION_LETTERS, words);
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

function filterByNonPresentLetters(npl, array) {
  let filtered = [];
  for (word of array) {
    let isValid = true;
    for (letter of npl) {
      if (word.indexOf(letter) != -1) isValid = false;
    }
    if (isValid) filtered.push(word);
  }
  return filtered;
}

function filterByPresentLetters(upl, array) {
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

function filterByPositionnedLetters(NEXTLETTERS, array) {
  let filtered = [];
  for (word of array) {
    let nlLength = 0;
    let isValid = 0;
    for (pos in NEXTLETTERS) {
      nlLength++;
      // Get the letter at the pos
      let letterInTheWordAtThePos = word.substring(pos - 1, pos);
      if (NEXTLETTERS[pos] === letterInTheWordAtThePos) isValid++;
    }
    if (isValid == nlLength) filtered.push(word);
  }
  return filtered;
}

function filterByKnownWrongPosition(KNOWN_WRONG_POSITION_LETTERS, array) {
  let filtered = [];
  for (word of array) {
    let isValid = true;
    for (letter in KNOWN_WRONG_POSITION_LETTERS) {
      for (position of KNOWN_WRONG_POSITION_LETTERS[letter]) {
        let letterInPosition = word.substring(position - 1, position);
        if (letterInPosition == letter) isValid = false;
      }
    }
    if (isValid) filtered.push(word);
  }
  return filtered;
}

process();
