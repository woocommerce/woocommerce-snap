const config = require( 'config' );

// Get specific viewport data
export const viewWidth = config.has( 'viewport.width' ) ? config.get( 'viewport.width' ) : 1280;
export const viewHeight= config.has( 'viewport.height' ) ? config.get( 'viewport.height' ) : 720;

// Get device data if provided
export const puppeteer = require( 'puppeteer' );
export const useDevice = config.get( 'deviceViewport.enabled' );
export const device = puppeteer.devices[ config.get('deviceViewport.device' ) ];

/**
 * Take a screenshot with optional selector to focus on.
 */
export const takeScreenshot = async ( { fileName } ) => {
	await page.screenshot({
		path: `./screenshots/${ fileName }.png`,
		fullPage: config.get( 'fullPageScreenshot' ),
		type: 'png',
	});
}


/**
 * Set up the browser viewport, including device viewport if enabled
 */
export const setupViewport = async () => {
	await page.setViewport({ width: viewWidth, height: viewHeight })

	if ( useDevice ) {
		await page.emulate( device );
	}
}

// Modified from https://gist.github.com/malyw/b4e8284e42fdaeceab9a67a9b0263743
/**
 * Takes a screenshot of a DOM element on the page, with optional padding.
 *
 * @param {!{name:string, selector:string, padding:(number|undefined)}=} opts
 * @return {!Promise<!Buffer>} Promise resolves when the screenshot is saved.
 */
export const screenshotDOMElement = async ( opts = {} ) => {
	const padding = 'padding' in opts ? opts.padding : 0;
	const path = 'fileName' in opts ? `./screenshots/${ opts.fileName }.png` : './screenshots/screenshot.png';
	const selector = opts.selector;

	if ( ! selector ) {
		throw Error( 'Please provide a selector.' );
	}

	// selector is passed through evaluate into the page context via pageSelector.
	const rect = await page.evaluate( ( pageSelector ) => {
		const element = document.querySelector( pageSelector );
		if ( ! element ) {
			return null;
		}
		const { x, y, width, height } = element.getBoundingClientRect();
		return { left: x, top: y, width, height, id: element.id };
	}, selector );

	if ( ! rect ) {
		throw Error( `Could not find element that matches selector: ${ selector }.` );
	}

	return await page.screenshot( {
		path,
		clip: {
			x: rect.left - padding,
			y: rect.top - padding,
			width: rect.width + ( padding * 2 ),
			height: rect.height + ( padding * 2 ),
		},
	} );
}

/** 
 * Takes a screenshot with optional DOM element and returnsa base64 encoded image.
 */
export const screenshotBuffer = async ( { url, selector = false } )  => {
	await setupViewport();
  
	await page.goto(url, {
		waitUntil: [ 'load', 'networkidle0', 'domcontentloaded' ],
	});

	let buffer;

	if ( selector ) {
		await page.waitForSelector( selector );
		const element = await page.$( selector );
		buffer = await element.screenshot({
			type: 'png',
		});
	} else {
		buffer = await page.screenshot({
			fullPage: config.get( 'fullPageScreenshot' ),
			type: 'png',
		});
	}
	return buffer;
};
