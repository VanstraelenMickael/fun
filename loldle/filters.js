export function filterChar(champs, datas, char) {
  const data_keys = Object.keys(datas);
  const theOne = [];
  const toKeep = [];
  const toRemove = [];
  data_keys.forEach((k) => {
    if (datas[k] == "green") theOne.push(k);
    if (datas[k] == "red") toRemove.push(k);
  });
  if (theOne.length == 0) {
    data_keys.forEach((k) => {
      if (datas[k] == "orange") toKeep.push(k);
    });
  }

  return champs
    .filter((c) => {
      if (theOne.length > 0) {
        if (typeof c[char] == "object") {
          return c[char].every((val, idx) => val === theOne[idx]);
        } else {
          return c[char] == theOne;
        }
      } else {
        return toKeep.length > 0 ? hasChar(c[char], toKeep) : true;
      }
    })
    .filter((c) => {
      if (!toRemove.length > 0) return true;
      if (typeof c[char] == "object") {
        let result = undefined;
        toRemove.forEach((tr) => {
          result =
            result == undefined || result == true
              ? c[char].indexOf(tr) == -1
                ? true
                : false
              : result;
        });
        return result;
      } else {
        return true;
      }
    });
}

function hasChar(champ_char, wanted_char) {
  let result = false;
  wanted_char.forEach((wc) => {
    if (champ_char.indexOf(wc) != -1) result = true;
    if (
      typeof champ_char == "object" &&
      champ_char.every((val, idx) => val === wanted_char[idx])
    ) {
      result = false;
    } else if (champ_char == wanted_char) result = false;
  });
  return result;
}

export function setReleaseDate(years, year, direction) {
  for (let y in years) {
    years[year] = "red";
    if (direction == "up") {
      if (y > year) years[y] = "orange";
    } else {
      if (y < year) years[y] = "orange";
    }
  }
  return years;
}
