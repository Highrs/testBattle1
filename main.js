'use strict';

const templato = require('./craftTemplates.json');
const craft = require('./craft.js');
const shuffle = require('lodash/shuffle');
const onml = require('onml');
const getSvg = require('./get-svg.js');
const draw = require('./draw.js');

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const hitCalc = (evasion, wep_acc) => {
  let hit = false;
  const hitChance = (((evasion / wep_acc) / 2) * 10);
  if (getRandInt(1, 10) > hitChance) {
    hit = true;
  }
  return hit;
};

const attack = (att, def) => {
  if (hitCalc(def.getEvasion(), att.getWeaponAccuracy())) {
    console.log(att.getClass() + '-class "' + att.getName() + '" fires on ' + def.getClass() + '-class "' + def.getName() + '" and hits for ' + att.getWeaponDamage() + ' damage.');
    def.damageCraft(att.getWeaponDamage());
  } else {
    console.log(att.getClass() + '-class "' + att.getName() + '" fires on ' + def.getClass() + '-class "' + def.getName() + '" and misses.');
  }
};

function getRandomInt(min, max) { //Thanks stock
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const listOfPossibleCraft = ['arrow', 'fat', 'giant'];

let redCraft = [];
let blueCraft = [];

const teamRandomizer = (colorCraft) => {
  for (let i = getRandomInt(1, 6); i > 0; i--) {
    colorCraft.push(listOfPossibleCraft[0,
      (getRandomInt(0, listOfPossibleCraft.length))]);
  }
  return colorCraft;
}

redCraft = teamRandomizer(redCraft);
blueCraft = teamRandomizer(blueCraft);

redCraft = redCraft.map((klass, idx) => craft('RED' + idx, templato[klass]));
blueCraft = blueCraft.map((klass, idx) => craft('BLUE' + idx, templato[klass]));

let redCount = redCraft.length;
let blueCount = blueCraft.length;

let turnCount = 1;

const turn = () => {
  console.log('Turn ' + turnCount);
  const disorder = shuffle(redCraft.concat(blueCraft));
  // console.log(disorder.map((e) => e.getName()));
  let redRay = ['g', {}];
  let blueRay = ['g', {}];

  for (let i = 0; i < disorder.length; i++) {
    if (disorder[i].isDed()) {
      continue;
    }
    let attCol;
    let attCraft;
    let defCraft;
    if (redCraft.some((c) => (disorder[i] === c))) {
      attCraft = redCraft;
      defCraft = blueCraft;
      attCol = 'red';
    } else if (blueCraft.some((c) => (disorder[i] === c))) {
      attCraft = blueCraft;
      defCraft = redCraft;
      attCol = 'blue';
    } else {
      console.log('ERROR at attacker detection!');
    }

    shuffle(defCraft).some((e) => {
      if (e.isDed()) {return false;}
      let attIdx = attCraft.findIndex((ae) => disorder[i] === ae);
      let defIdx = defCraft.findIndex((de) => e === de);
      attack (disorder[i], e);
      if (attCol === 'red') {
        redRay.push(draw.redLine(attIdx, defIdx));
      } else {
        blueRay.push(draw.blueLine(attIdx, defIdx));
      }
      if (e.isDed()) {
        console.log(e.getName() + ' has been destroyed');
        if (attCol === 'red') {
          blueCount--;
        } else {
          redCount--;
        }
      }
      if (attCol === 'red') {
        redCraft = attCraft;
        blueCraft = defCraft;
      } else {
        blueCraft = attCraft;
        redCraft = defCraft;
      }
      return true;
    });
  }
  if (redCount === 0) {console.log('Blue won!');}
  if (blueCount === 0) {console.log('Red won!');}
  turnCount++;

  let screenW = screen.width*(2/3);
  let screenH = screen.height*(2/3);

  return getSvg({w:screenW, h:screenH}).concat(
    [draw.frame(screenW, screenH)],
    redCraft.map((c, i) => draw.redCraft(c, i)),
    blueCraft.map((c, i) =>draw.blueCraft(c, i)),
    [redRay], [blueRay]
  );
}

async function delay(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {
  const content = document.getElementById('content');
  while (redCount > 0 && blueCount > 0) {
    const ml = turn();
    try {
      const html = onml.stringify(ml);
      content.innerHTML = html;
    } catch (err) {
      console.error(ml);
    }
    for (let node of document.querySelectorAll('.redCraftBox, .blueCraftBox')) {
      node.addEventListener('click', () => {
        console.log(node.id);
      });
    }
    await delay(1000);
  }
  console.log('Red craft: ' + redCount);
  console.log('Blue craft: ' + blueCount);
};

window.onload = main;
