const champs = require("./champs.json");
const fs = require("fs");
const { default: axios } = require("axios");
const cheerio = require("cheerio");

let f_champs = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  for (id in champs.data) {
    console.log(id);
    const url_1 = `https://leagueoflegends.fandom.com/wiki/${champs.data[id].name}`;
    const url_2 = `https://leagueoflegends.fandom.com/wiki/${champs.data[id].name}/LoL`;
    try {
      const { data: result_one } = await axios.get(url_1);
      await delay(5);
      const { data: result_two } = await axios.get(url_2);
      await delay(5);
      const scraped_one = await scrape_one(result_one);
      const scraped_two = await scrape_two(result_two);
      f_champs.push({
        name: champs.data[id].name,
        gender: scraped_one.gender,
        positions: scraped_two.positions, // https://leagueoflegends.fandom.com/wiki/Akali/LoL -> Position(s)
        species: scraped_one.species,
        resource: scraped_two.resource,
        rangeType: scraped_two.range_type, // https://leagueoflegends.fandom.com/wiki/Akali/LoL -> Range Type
        regions: scraped_one.regions, // https://leagueoflegends.fandom.com/wiki/champ_name -> Regions
        releaseYear: scraped_two.releaseYear, // https://leagueoflegends.fandom.com/wiki/Akali/LoL -> Release date
      });
    } catch (e) {
      console.error("failed for", id);
    }
  }
  fs.writeFileSync(`dump/champs.json`, JSON.stringify(f_champs, null, 2));
}

main();

async function scrape_one(data) {
  const $ = cheerio.load(data);
  const content = $(
    ".portable-infobox.pi-background.pi-border-color.pi-theme-client.pi-layout-stacked"
  ).html();
  return clear(content);
}

async function scrape_two(data) {
  const $ = cheerio.load(data);
  const content = $(
    ".portable-infobox.pi-background.pi-border-color.pi-theme-client.pi-layout-default.type-lol-champion"
  ).html();
  return clear_two(content);
}

function clear(content) {
  const $ = cheerio.load(content);
  const pronouns = $("div[data-source='pronoun'] > div").html();
  const species = $("div[data-source='species'] > div a").html();
  const regions = $(
    "div[data-source='region'] > div span[style='white-space:normal;'] > a"
  ).html();

  return {
    gender: getGender(pronouns),
    species,
    regions,
  };
}

function clear_two(content) {
  const $ = cheerio.load(content);
  const releaseYear = $("div[data-source='release'] > div > a").html();
  const position = $("div[data-source='position'] > div").html();
  const resource = $(
    "div[data-source='resource'] > div > span > a:nth-child(2)"
  ).html();
  const range_type = $(
    "div[data-source='rangetype'] > div > span > a:nth-child(2)"
  ).html();

  return {
    releaseYear: getYear(releaseYear),
    resource,
    range_type,
    positions: getPosition(position),
  };
}

function getGender(txt) {
  const first = txt.split("/")[0];
  if (first == "He") return "Male";
  return "Female";
}

function getYear(txt) {
  return txt.substr(0, 4);
}

function getPosition(html) {
  const pos = [...html.matchAll(new RegExp("data-tip=", "gi"))].map(
    (a) => a.index
  );
  const positions = pos.map((p) =>
    html.substring(p + 10, html.indexOf('"', p + 10))
  );

  return positions;
}
// console.log(f_champs);
