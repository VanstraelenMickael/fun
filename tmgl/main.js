class Joueur {
  constructor(nom, pays, team, champion, gold, silver, bronze, aucune) {
    this.nom = nom;
    this.pays = pays;
    this.team = team;
    this.champion = champion;
    this.gold = gold;
    this.silver = silver;
    this.bronze = bronze;
    this.aucune = aucune;
  }
}

let affi = new Joueur("Affi", "sw", "BDS", 0, 0, 2, 1, 0);
let aurel = new Joueur("Aurel", "fr", "GP", 1, 1, 1, 0, 0);
let binkss = new Joueur("Binkss", "fr", "Izi", 0, 0, 2, 1, 0);
let bren = new Joueur("Bren", "fr", "KC", 1, 1, 1, 0, 0);
let carljr = new Joueur("CarlJr", "can", "SLY", 0, 3, 0, 0, 0);
let granady = new Joueur("Granady", "ger", "AA", 0, 3, 0, 0, 0);
let gwen = new Joueur("Gwen", "fr", "GW", 0, 0, 1, 2, 0);
let kappa = new Joueur("Kappa", "prout", "SN", 1, 0, 0, 1, 1);
let massa = new Joueur("Massa", "ger", "BIG", 1, 0, 0, 2, 0);
let mime = new Joueur("Mime", "pol", "ORG", 1, 1, 1, 0, 0);
let mudda = new Joueur("Mudda", "aus", "EDL", 1, 1, 1, 0, 0);
let otaaaq = new Joueur("Otaaq", "fr", "LLE", 0, 0, 1, 1, 1);
let pac = new Joueur("PAC", "eng", "NMN", 0, 0, 1, 0, 2);
let papou = new Joueur("Papou", "fr", "GO", 0, 2, 0, 1, 0);
let scrapie = new Joueur("Scrapie", "be", "SPT", 0, 0, 1, 2, 0);
let spam = new Joueur("Spam", "ned", "ALL", 0, 0, 0, 1, 2);

let joueurs = [
  massa,
  bren,
  papou,
  granady,
  mime,
  carljr,
  aurel,
  affi,
  mudda,
  binkss,
  gwen,
  scrapie,
  spam,
  kappa,
  pac,
  otaaaq,
];

function rank(tab) {
  let rankeds = [];
  do {
    let { top, index } = findTopOne(tab);
    rankeds.push(top);
    tab.splice(index, 1);
  } while (tab.length > 0);
  return rankeds;
}

function findTopOne(tab) {
  let top = tab[0];
  let index = 0;
  for (let i = 0; i < tab.length; i++) {
    let joueur = tab[i];
    if (joueur.champion > top.champion) {
      top = joueur;
      index = i;
    } else if (joueur.champion == top.champion) {
      if (joueur.gold > top.gold) {
        top = joueur;
        index = i;
      } else if (joueur.gold == top.gold) {
        if (joueur.silver > top.silver) {
          top = joueur;
          index = i;
        } else if (joueur.silver == top.silver) {
          if (joueur.bronze > top.bronze) {
            top = joueur;
            index = i;
          } else if (joueur.bronze == top.bronze) {
            if (joueur.aucune > top.aucune) {
              top = joueur;
              index = i;
            }
          }
        }
      }
    }
  }
  return { top, index };
}

function setTable(rankeds) {
  let tbody = document.querySelector("tbody");
  for (let i = 0; i < rankeds.length; i++) {
    let tr = document.createElement("tr");
    let pos = document.createElement("th");
    pos.setAttribute("scope", "row");
    pos.textContent = i + 1;
    tr.append(pos);
    for (let key in rankeds[i]) {
      if (key != "aucune") {
        let td = document.createElement("td");
        td.textContent = rankeds[i][key];
        tr.append(td);
      }
    }
    tbody.append(tr);
  }
}

setTable(rank(joueurs));
