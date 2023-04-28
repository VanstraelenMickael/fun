import champs from "./champs.json" assert { type: "json" };
import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

let f_champs = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
  let index = 0;
  for (let id in champs.data) {
    console.log(`[${index}/${Object.keys(champs.data).length}] - ${id}`);
    index++;
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
      // console.log(f_champs);
    } catch (e) {
      console.error("failed for", id);
    }
  }
  console.log(f_champs);
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
  const species = $("div[data-source='species'] div").find("a");
  let species_final = [];
  for (let i = 0; i < species.length; i++) {
    if (species.eq(i).parent().parent().html().indexOf("Unknown") != -1)
      species_final.push("Unknown");
    else if (species[i].parent.name != "s" && species[i].parent.name != "sup") {
      species_final.push(species[i].children[0].data);
    }
  }
  // console.log(species_final);

  const regions = $(
    "div[data-source='region'] > div span[style='white-space:normal;']"
  ).find("a");
  let regions_final = [];
  for (let i = 0; i < regions.length; i++) {
    if (regions[i].parent.parent.parent.name != "s") {
      regions_final.push(regions[i].children[0].data);
    }
  }

  return {
    gender: getGender(pronouns),
    species: species_final,
    regions: regions_final,
  };
}

function clear_two(content) {
  const $ = cheerio.load(content);
  const releaseYear = $("div[data-source='release'] > div > a").html();
  const position = $("div[data-source='position'] > div").html();
  const resource = $(
    "div[data-source='resource'] > div > span > a:nth-child(2)"
  ).html();
  const range_type = [
    $("div[data-source='rangetype'] > div > span > a:nth-child(2)").html(),
  ];

  return {
    releaseYear: getYear(releaseYear),
    resource,
    range_type,
    positions: getPosition(position),
  };
}

function getGender(txt) {
  const first = txt.split("/")[0];
  if (first == "He" || first == "It") return "Male";
  if (first == "She") return "Female";
  if (first == "They") return "Other";
  return "Other";
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
