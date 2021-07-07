/* eslint-disable jest/no-export, jest/no-disabled-tests */
/**
 * Internal dependencies
 */
 const {
	merchant,
} = require( '@woocommerce/e2e-utils' );

/**
 * External dependencies
 */
 const {
	it,
	describe,
	beforeAll,
} = require( '@jest/globals' );

import { 
	dismissAllNotices,
	takeScreenshot,
	setupViewport,
} from '../utils';

const config = require( 'config' );

const pages = config.get('screenshotUrls');

const runUrlsScreenshotter = () => {
	let index = 0;

	describe( 'Screenshot multiple URLs', () => {
		describe.each( pages )(
			'screenshotting %s',
			( p ) => {
				beforeAll( async () => {

					await setupViewport();

					let isMerchantUrl = p.url.startsWith( 'wp-admin/' );
	
					if ( isMerchantUrl ) {
						await merchant.login();
						await dismissAllNotices();
					}
				} );
	
				it( `should screenshot ${ page.name } `, async () => {
					await page.goto( config.get( 'url' ) + p.url, {
						waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
					});
					await takeScreenshot( { fileName: `screenshot-${ p.name }` });
					index += 1;
				} );
			}
		);
	} );
}

runUrlsScreenshotter();
