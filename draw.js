'use strict';

const tspan = require('tspan');

const recL = 165;
const recH = 75;
const recSpacing = 15;
const recMargin = 40;
const lineSpacing = 10;
const lineMargin = 10;

let screenW = screen.width*(2/3);
// let screenH = screen.height*(2/3);

exports.redLine = (attIdx, defIdx) => {
  return ['line',
  {
      x1: (recMargin + recL + lineMargin),
      y1: (((attIdx) * (recH + recSpacing) + recMargin + (recH/2)) + (lineSpacing/2)),
      x2: (screenW - recMargin - recL - lineMargin),
      y2: (((defIdx) * (recH + recSpacing)) + recMargin + (recH/2) + (lineSpacing/2)),
      class: 'redRay'
  }
  ];
}
exports.blueLine = (attIdx, defIdx) => {
  return ['line',
  {
      x1: (screenW - recMargin - recL - lineMargin),
      y1: (((attIdx) * (recH + recSpacing)) + recMargin + (recH/2) - (lineSpacing/2)),
      x2: (recMargin + recL + lineMargin),
      y2: (((defIdx) * (recH + recSpacing) + recMargin + (recH/2)) - (lineSpacing/2)),
      class: 'blueRay'
  }
  ];
}
exports.redCraft = (c, i) => {
  return ['g',
    {transform: 'translate(' + recMargin + ', ' + ((i) * (recH + recSpacing) + recMargin) + ')',
      class: 'redCraftBox', id: 'redCraftBox' + i},
    // ['title', (c.getHull() + ' ' + c.getArmor())],
    ['rect', { width: recL, height: recH, class: 'red' + (c.isDed()? ' ded': '') + ' boundingBox'}],
    ['g', craftData(c)]
  ];
}
exports.blueCraft = (c, i) => {
  return ['g',
    {transform: 'translate(' + (screenW - recMargin - recL) + ', ' + ((i) * (recH + recSpacing) + recMargin) + ')',
      class: 'blueCraftBox', id: 'blueCraftBox' + i},
    // ['title', (c.getHull() + ' ' + c.getArmor())],
    ['rect', { width: recL, height: recH, class: 'blue' + (c.isDed()? ' ded': '') + ' boundingBox'}],
    ['g', craftData(c)]
  ];
}
exports.frame = (w, h) => {
  return ['g',
    {transform: 'translate(15, 15)'},
    ['rect', {width: (w-30), height: (h-30), class: 'frame'}]
  ];
}

const craftData = (c) => {

  let bar = ['g', {}];
  for (let i = 0; i < c.getHullMax(); i++) {
    if (i < c.getHull()) {
      bar.push(['g', {transform: 'translate(' + (10 + (10*i)) + ', 55)'}, ['rect', { width: 10, height: 10, class: 'healthSquareFull'}]]);
    } else {
      bar.push(['g', {transform: 'translate(' + (10 + (10*i)) + ', 55)'}, ['rect', { width: 10, height: 10, class: 'healthSquareEmpty'}]]);
    }
  }
  for (let i = 0; i < c.getArmorMax(); i++) {
    if (i < c.getArmor()) {
      bar.push(['g', {transform: 'translate(' + (20 + (10*c.getHullMax()) + ((10*i))) + ', 55)'}, ['rect', { width: 10, height: 10, class: 'healthSquareFull'}]]);
    } else {
      bar.push(['g', {transform: 'translate(' + (20 + (10*c.getHullMax()) + ((10*i))) + ', 55)'}, ['rect', { width: 10, height: 10, class: 'healthSquareEmpty'}]]);
    }
  }


  // console.log(bar);
  return ['g',
    ['g',
      {transform: 'translate(10, 10)'},
      ClassIcon(c.getClass())
    ],
    ['g',
      ['text', {x:50, y:20, class: 'textLabel'}, c.getName()],
      ['text', {x:50, y:40, class: 'textLabel'}]
        .concat(tspan.parse(c.getClass() + '<sup>-Class</sup>'))
    ],
    bar
  ]
}

const ClassIcon = (n) => {
  if (n === 'Arrow') {return ['path', { d: 'M 15,0 L 30, 30 L 15, 25 L 0, 30 Z', class: 'frame' }];}
  if (n === 'Fat') {return ['path', { d: 'M 15,0 L 30, 25 L 15, 30 L 0, 25 Z', class: 'frame' }];}
}
