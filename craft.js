'use strict';
// craft generator
module.exports = (name, template) => {
  const propo = Object.assign(
    {},
    {
      name: name,
    },
    template
  );

  return {
    getPrint: () => {
      console.log(propo);
    },
    damageHull: (damage) => {
      if (propo.hull > damage) {
        propo.hull -= damage;
      } else {
        propo.hull = 0;
      }
    },
    damageCraft: (damage) => {
      if (propo.armor === 0) {
        if (propo.hull > damage) {
          propo.hull -= damage;
        } else {
          propo.hull = 0;
        }
        return;
      }

      if (propo.armor > damage) {
        propo.armor -= 1;
        return;
      }

      // propo.armor < damage
      if (propo.hull > (damage - propo.armor)) {
        propo.hull -= (damage - propo.armor);
      } else {
        propo.hull = 0;
      }
      propo.armor -= 1;
    },
    isDed: () => propo.hull <= 0,
    getName: () => propo.name,
    getClass: () => propo.class,
    getHullMax: () => propo.hullMax,
    getHull: () => propo.hull,
    getArmorMax: () => propo.armorMax,
    getArmor: () => propo.armor,
    getEvasion: () => propo.evasion,
    getWeaponDamage: () => propo.wep_dam,
    getWeaponAccuracy: () => propo.wep_acc
  };
};


// console.log(corvo['hull']);



// const input = fs.readFileSync(template + '.txt', 'utf8').split(/\r?\n/);
// const corvo = {};
// for (let i = 0; i < input[i].length; i++) {
//   const [stat, val] = input[i].split(': ');
//   console.log(stat + ': ' + val);
//   corvo[stat.toUpperCase()] = val;
// }
