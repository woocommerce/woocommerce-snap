const { test, expect } = require('@playwright/test');
const config = require('../config.json');

for (const url of config.shopperUrls) {
    test(`screenshotting page at ${url}`, async ({ page, browserName }) => {
        const pageVisited = /[^/]*$/.exec(url)[0];
        await page.goto(url);
        await page.screenshot({ path: `screenshots/shopper/${browserName}/${pageVisited}-page-screenshot.png`, fullPage: true });
    });
}

for (const url of config.merchantUrls) {
    test(`screenshotting page at ${url}`, async ({ page, browserName }) => {
        // First, we need to log in.
        await page.goto( `/wp-admin`, { waitUntil: 'networkidle' } );
        await page
            .locator( 'input[name="log"]' )
            .fill( 'admin' );
        await page
            .locator( 'input[name="pwd"]' )
            .fill( 'password' );
        await page.locator( 'text=Log In' ).click();
        await page.waitForLoadState( 'networkidle' );
        await page.goto( `/wp-admin` );
        await page.waitForLoadState( 'domcontentloaded' );

        await expect( page.locator( 'div.wrap > h1' ) ).toHaveText(
            'Dashboard'
        );

        // Now, let's get the page we're visiting for the URL, visit the page, and get a full page screenshot.
        const pageVisited = /[^/]*$/.exec(url)[0];
        await page.goto(url);
        await page.screenshot({ path: `screenshots/merchant/${browserName}/${pageVisited}-page-screenshot.png`, fullPage: config.fullPageScreenshot });
    });
}
