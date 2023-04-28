import champs from "./dump/champs.json" assert { type: "json" };

export function getField(field) {
  return champs
    .map((c) => c[field])
    .flat(Infinity)
    .filter((v, i, arr) => arr.indexOf(v) == i)
    .reduce((acc, curr) => {
      acc[curr] = "undefined";
      return acc;
    }, {});
}
