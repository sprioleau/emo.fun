import cheerio from "cheerio";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler({ query }, res) {
	const { url } = query;

	let browser = null;
	let page = null;

	try {
		browser = await puppeteer.launch({
			executablePath: await chromium.executablePath,
			args: chromium.args,
			headless: true,
		});

		page = await browser.newPage();
		await page.goto(url, { waitUntil: "networkidle2" });
		await page.waitForTimeout(1000);

		const html = await page.content();
		const $ = cheerio.load(html);

		const meta = {
			title: $("title").text(),
			description: $("meta[name=description]").attr("content"),
			og: {
				type: $("meta[property=og:type]").attr("content"),
				url: $("meta[property=og:url]").attr("content"),
				title: $("meta[property=og:title]").attr("content"),
				description: $("meta[property=og:description]").attr("content"),
				image: $("meta[property=og:image]").attr("content"),
			},
			twitter: {
				card: $("meta[name=twitter:card]").attr("content"),
				title: $("meta[name=twitter:title]").attr("content"),
				description: $("meta[name=twitter:description]").attr("content"),
				image: $("meta[name=twitter:image]").attr("content"),
			},
		};

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(200).json({
			meta,
			error: null,
		});
	} catch (error) {
		console.error(error);

		if (page) await page.close();
		if (browser) await browser.close();

		res.status(500).json({
			meta: null,
			error: error.message,
		});
	}
}
