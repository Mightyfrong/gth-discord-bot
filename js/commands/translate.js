import fetch from 'node-fetch';
import sharp from 'sharp';
import { logger, permUser } from '../utils.js';
import { langsDict, browser, page } from './translate_setup.js';

const permLevel = 2;

//translation of user text
export async function translate(msg, [langToken, ...inputTokens]) {
	if (await permUser(msg, permLevel)) {
		if (langToken) {
			const lang = langsDict[langToken.toLowerCase()];
			logger("lang: " + lang);

			if (lang)
				quickTranslate(msg, lang, inputTokens.join(' '));
			else
				msg.channel.send('Unknown language');
		}
		else {
			slowTranslate(msg);
		}
	}
}

//translate {language} [text]
async function quickTranslate(msg, lang, textToTranslate) {
	function sendPng(img) {
		msg.channel.send({
			files: [{
				attachment: img,
				name: 'file.png'
			}]
		});
	}

	let fg = '#F2B90D';
	let bg = '#050F2E';
	if (lang === 'hello') {
		fetch('http://localhost:9000/v1/gth/translate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({'input': textToTranslate})
		})
			.then(res => res.text())
			.then(svg => {
				sendPng(sharp(Buffer.from(svg)))
			});
	} else {
		await langSelect(lang);
		await setColor(fg, bg);
		await input(textToTranslate.toLowerCase());
		output()
			.then(([img, unsupChars]) => {
				sendPng(img);
				if (unsupChars) {
					msg.channel.send(unsupChars);
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
		let img = sharp(Buffer.from(svg));
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
