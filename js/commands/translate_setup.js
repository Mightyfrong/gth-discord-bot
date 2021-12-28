import { logger } from '../utils.js'

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer');

//start headless browser, go to gth page
logger("Starting GTH...");
export const browser = await puppeteer.launch({
  headless: true,
  //executablePath: '/usr/bin/chromium-browser', NEEDED FOR RUNNING ON RASPI
  args: ['--no-sandbox', '--disabled-setupid-sandbox'],
  ignoreDefaultArgs: ['--disable-extensions']
});
export const page = await browser.newPage();
await page.setViewport({
width: 1920,
height: 1080,
});
await page.goto('https://mightyfrong.github.io/gallifreyan-translation-helper/');
logger("GTH ready!");

//aliases for supported languages
export const langsDict = {
  'hello': 'hello',

  'shermans': 'shermans',
  "sherman's": 'shermans',
  'sherman': 'shermans',

  'doctors-cot': 'doctors-cot',
  'cot': 'doctors-cot',

  'tardis-console': 'tardis-console',
  'tardisconsole': 'tardis-console',
  'tc': 'tardis-console',

  'flux': 'flux',

  'clockwork': 'clockwork',
  'cw': 'clockwork',

  'gc-gallifreyan': 'gc-gallifreyan',
  'gc': 'gc-gallifreyan',

  'cbettenbenders': 'cbettenbenders',
  "cbettenbender's": 'cbettenbenders',
  'cbettenbender': 'cbettenbenders',
  'cb': 'cbettenbenders',

  'cc-gallifreyan': 'cc-gallifreyan',
  'cc': 'cc-gallifreyan',

  'dotscript': 'dotscript',
  'dot': 'dotscript',

  'artbyboredom': 'artbyboredom',
  'artbyboredoms': 'artbyboredom',
  "artbyboredom's": 'artbyboredom',
  'art': 'artbyboredom',
  'abb': 'artbyboredom',

  'darkifaeries': 'darkifaeries',
  "darkifaerie's": 'darkifaeries',
  'darkifaerie': 'darkifaeries',
  'dark': 'darkifaeries',
  'df': 'darkifaeries',

  'evas': 'evas',
  "eva's": 'evas',
  'eva': 'evas',

  'bpjmarriots': 'bpjmarriots',
  "bpjmarriot's": 'bpjmarriots',
  'bpjmarriot': 'bpjmarriots',
  'bpjm': 'bpjmarriots',

  'oddisms': 'oddisms',
  "oddism's": 'oddisms',
  'oddism': 'oddisms',
  'odd': 'oddisms'
};
