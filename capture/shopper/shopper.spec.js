/* eslint-disable jest/no-export, jest/no-disabled-tests */
/**
 * Internal dependencies
 */
 const {
	createSimpleProduct,
	shopper,
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
	screenshotDOMElement,
	takeScreenshot,
	setupViewport,
} from '../utils';

const config = require( 'config' );

let simplePostIdValue;
const simpleProductName = config.get( 'products.simple.name' );

const runScreenshotterShopper = () => {
	describe('Screenshot shopper pages', () => {
		beforeAll(async () => {
			await setupViewport();

			simplePostIdValue = await createSimpleProduct( simpleProductName);
		});

		it('can screenshot adding product to cart', async () => {
			await shopper.goToProduct(simplePostIdValue);
			await expect(page).toFill('div.quantity input.qty', '5');
			await shopper.addToCart();
			await takeScreenshot( { fileName: 'shopper-cart' } );
		});

		it('can screenshot checkout', async () => {
			await shopper.goToCheckout();
			await takeScreenshot({ fileName: 'shopper-checkout' });

			// Screenshot focusing on the billing section
			await screenshotDOMElement( {
				fileName: 'shopper-checkout-billing',
				selector: '.woocommerce-billing-fields',
				padding: 10,
			} );
		});
	});
}

runScreenshotterShopper();
