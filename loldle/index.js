import champs from "./dump/champs.json" assert { type: "json" };
import { getField } from "./start.js";
import { filterChar, setReleaseDate } from "./filters.js";

// Defines clues

let genders = getField("gender");
let positions = getField("positions");
let species = getField("species");
let resources = getField("resource");
let rangeTypes = getField("rangeType");
let regions = getField("regions");
let releaseYear = getField("releaseYear");

genders.Male = "green";
positions.Middle = "orange";
species.Human = "orange";
species.Magicborn = "orange";
resources.Flow = "red";
rangeTypes.Melee = "red";
regions.Ionia = "red";
setReleaseDate(releaseYear, 2013, "down");

// Filters

const champs_filtered_genders = filterChar(champs, genders, "gender");
const champs_filtered_positions = filterChar(
  champs_filtered_genders,
  positions,
  "positions"
);
const champs_filtered_species = filterChar(
  champs_filtered_positions,
  species,
  "species"
);
const champs_filtered_resources = filterChar(
  champs_filtered_species,
  resources,
  "resource"
);
const champs_filtered_rangeTypes = filterChar(
  champs_filtered_resources,
  rangeTypes,
  "rangeType"
);
const champs_filtered_regions = filterChar(
  champs_filtered_rangeTypes,
  regions,
  "regions"
);
const champs_filtered_releaseYear = filterChar(
  champs_filtered_regions,
  releaseYear,
  "releaseYear"
);

console.log("Champions remaining : ", champs_filtered_releaseYear.length);
console.log(champs_filtered_releaseYear);
