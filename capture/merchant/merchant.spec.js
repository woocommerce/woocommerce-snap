/* eslint-disable jest/no-export, jest/no-disabled-tests */
/**
 * Internal dependencies
 */
 const {
	merchant,
	clickTab,
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
	screenshotDOMElement,
	setupViewport,
} from '../utils';

const runScreenshotterMerchant = () => {
	describe('Screenshot merchant pages', () => {
		beforeAll(async () => {
			await setupViewport();

			await merchant.login();
			await dismissAllNotices();;
		});

		it('can create new coupon', async () => {
			await merchant.openNewCoupon();

			await takeScreenshot( { fileName: 'merchant-coupon-new' } );

			// Fill in coupon code and description
			await expect(page).toFill('#title', 'code-' + new Date().getTime().toString());
			await expect(page).toFill('#woocommerce-coupon-description', 'test coupon');

			// Set general coupon data
			await clickTab('General');
			await expect(page).toSelect('#discount_type', 'Fixed cart discount');
			await expect(page).toFill('#coupon_amount', '100');

			await takeScreenshot( { fileName: 'merchant-coupon-completed' } );

			// Screenshot focusing on the coupon details section
			await screenshotDOMElement( {
				fileName: 'merchant-coupon-data',
				selector: '#general_coupon_data',
			} );
		});
	});
}

runScreenshotterMerchant();
