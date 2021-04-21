const permLevel = 2;
import { permUser } from '../utils.js';
import { logger } from '../utils.js'

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

import { langsDict, browser, page } from './translate_setup.js'

export async function translate (msg, tokens) {
    if (await permUser(msg, permLevel)) {
      let lang = langsDict[tokens.shift().toLowerCase()];
      logger(lang);
      if (!lang) {
        msg.channel.send('Unknown language');
        return;
      }
      await langSelect(lang);
      await input(tokens.join(' ').toLowerCase());
      output()
      .then(img => {
        msg.channel.send({
          files: [{
            attachment: img,
            name: 'file.png'
          }]
        });
        page.reload();
      })
      .catch(err => {
        logger('[ERROR]' + err);
        page.reload();
        msg.channel.send('Something went wrong. Please try again.');
      });
    }
}

async function langSelect (lang) {
  return new Promise(async function (resolve) {
    await page.click("my-select");
    await page.waitForTimeout(200);
    await page.click(`label[for=${lang}]`);
    await page.waitForTimeout(200);
    await page.click("img")
    await page.waitForTimeout(200);
    resolve(true);
  });
}

async function reset () {
  return new Promise(async function (resolve) {
    await page.focus('#text');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    resolve(true);
  });
}

async function input(text) {
  return new Promise(async function (resolve) {
    await reset();
    await page.type("#text", text, {delay: 1});
    await page.click("#renderbutton");
    resolve(true);
  });
}

async function output() {
  return new Promise(async function (resolve, reject) {
    const src = await page.$eval('#output-img', el => el.getAttribute("src"));
    if (!src) {
      reject('No image');
      return;
    }
    logger(src);
    let buffer = await browser.newPage();
    await buffer.goto(src);
    let svg = await buffer.content();
    await buffer.close();
    let img = await sharp(Buffer.from(svg))
    resolve(img);
  });
}
