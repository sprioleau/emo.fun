import cheerio from "cheerio";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const getMeta = async (url) => {
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
			title: $("title").text() ?? null,
			description: $("meta[name=description]").attr("content") ?? null,
			og: {
				type: $("meta[property=og:type]").attr("content") ?? null,
				url: $("meta[property=og:url]").attr("content") ?? null,
				title: $("meta[property=og:title]").attr("content") ?? null,
				description: $("meta[property=og:description]").attr("content") ?? null,
				image: $("meta[property=og:image]").attr("content") ?? null,
			},
			twitter: {
				card: $("meta[name=twitter:card]").attr("content") ?? null,
				title: $("meta[name=twitter:title]").attr("content") ?? null,
				description: $("meta[name=twitter:description]").attr("content") ?? null,
				image: $("meta[name=twitter:image]").attr("content") ?? null,
			},
		};

		if (page) await page.close();
		if (browser) await browser.close();

		// console.log("meta:", meta);
		return {
			meta,
			error: null,
		};
	} catch (error) {
		console.error(error);

		if (page) await page.close();
		if (browser) await browser.close();

		return {
			meta: null,
			error: error.message,
		};
	}
};

export default getMeta;
