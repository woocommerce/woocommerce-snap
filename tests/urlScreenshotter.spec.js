const { test, expect } = require('@playwright/test');
const config = require('../config.json');

// TODO: add in the site URL and just have them define pages like "Settings", "Shop", etc and we can build the ULRs or they can create them manually

for (const url of config.shopperUrls) {
    test(`screenshotting page at ${url}`, async ({ page, browserName }) => {
        const pageVisited = /[^/]*$/.exec(url)[0];
        await page.goto(url);
        await page.screenshot({ path: `screenshots/shopper/${browserName}/${pageVisited}-page-screenshot.png`, fullPage: true });
    });
}

for (const url of config.merchantUrls) {
    test(`screenshotting page at ${url}`, async ({ page, browserName }) => {
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

        const pageVisited = /[^/]*$/.exec(url)[0];
        await page.goto(url);
        await page.screenshot({ path: `screenshots/merchant/${browserName}/${pageVisited}-page-screenshot.png`, fullPage: true });
    });
}
