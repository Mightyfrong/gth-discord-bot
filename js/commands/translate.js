const permLevel = 2;
import { permUser } from '../utils.js';
import { logger } from '../utils.js'

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

import { langsDict, browser, page } from './translate_setup.js'

//translation of user text
export async function translate(msg, tokens) {
	if (await permUser(msg, permLevel)) {
		if (tokens[0]) {
			quickTranslate(msg, tokens);
		}
		else {
			slowTranslate(msg);
		}
	}
}

//translate {language} [text]
async function quickTranslate(msg, [langToken, ...inputTokens]) {
	let fg = '#F2B90D';
	let bg = '#050F2E';
	let lang = langsDict[langToken.toLowerCase()];
	logger("lang: " + lang);
	if (!lang) {
		msg.channel.send('Unknown language');
		return;
	}
	if (lang === 'hello') {
		fetch('http://modestas.ruksnaitis.com/gallifreyan/hello.php')
			.then(res => res.text())
			.then(svg => sharp(Buffer.from(svg)))
			.then(img => {
				msg.channel.send({
					files: [{
						attachment: img,
						name: 'hello.png'
					}]
				});
			});
	} else {
		await langSelect(lang);
		await setColor(fg, bg);
		await input(inputTokens.join(' ').toLowerCase());
		output()
			.then(out => {
				msg.channel.send({
					files: [{
						attachment: out[0],
						name: 'file.png'
					}]
				});
				if (out[1]) {
					msg.channel.send(out[1]);
				}
				page.reload();
			})
			.catch(err => {
				logger('[ERROR]' + err);
				page.reload();
				msg.channel.send('Something went wrong. Please try again.');
			});
	}
}

//TO DO: interactive menu
async function slowTranslate(msg) {
	msg.channel.send('Translation assistant not supported yet. Please use "translate {language} [text]"');
}

//select language from dropdown on virtual webpage
async function langSelect(lang) {
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

//clear text input field on virtual webpage
async function reset() {
	return new Promise(async function (resolve) {
		await page.focus('#text');
		await page.keyboard.down('Control');
		await page.keyboard.press('A');
		await page.keyboard.up('Control');
		await page.keyboard.press('Backspace');
		resolve(true);
	});
}

//input text and click render on virtual webpage
async function input(text) {
	return new Promise(async function (resolve) {
		await reset();
		await page.type("#text", text, { delay: 1 });
		await page.click("#renderbutton");
		resolve(true);
	});
}

//get blob url, create new page, copy and return svg data
async function output() {
	return new Promise(async function (resolve, reject) {
		let src = await page.$eval('#output-img', el => el.getAttribute("src"));
		let unsupChars = await page.$eval('#output', el => el.innerHTML);
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
		resolve([img, unsupChars]);
	});
}

//set both forground and background color on virtual webpage
async function setColor(fg, bg) {
	return new Promise(async function (resolve) {
		if (fg) await page.$eval('#foregroundcolor', (el, fg) => { el.setAttribute('value', fg) }, fg);
		if (bg) await page.$eval('#backgroundcolor', (el, bg) => { el.setAttribute('value', bg) }, bg);
		resolve(true);
	});
}
