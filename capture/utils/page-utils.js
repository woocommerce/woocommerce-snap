const config = require( 'config' );
const baseUrl = config.get( 'url' );

const WC_ADMIN_BASE_URL = baseUrl + 'wp-admin/';
const DASHBOARD_PAGE = WC_ADMIN_BASE_URL + 'index.php';

/**
 * Dismiss all WooCommerce notices from the dashboard
 */
export const dismissAllNotices = async () => {
	await page.goto( DASHBOARD_PAGE, {
		waitUntil: 'networkidle0',
	} );

	const dismissNoticeLink = await page.$$eval(
		'#message',
		(notices => notices.map(notice => {
			const a = notice.querySelector('a.woocommerce-message-close');
			return {
				link: a.href
			};
		}))
	);
	
	for (const { link } of dismissNoticeLink) {
		await Promise.all([
			page.waitForNavigation(),
			page.goto(link),
		]);
	};
}