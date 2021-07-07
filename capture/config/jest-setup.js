/**
 * External dependencies
 */
 const path = require( 'path' );
 const fs = require( 'fs' );
 const shell = require('shelljs');
 const config = require('config');
 const {
	 enablePageDialogAccept,
	 setBrowserViewport,
 } = require('@wordpress/e2e-test-utils');
	
 /**
  * Array of page event tuples of [ eventName, handler ].
  *
  * @type {Array}
  */
 const pageEvents = [];

/**
 * Pull in the environment file so we can run WP CLI commands.
 */
let ENV_FILE = path.resolve( './env/default.env' );
const localEnvironmentFile = path.resolve( './env/config/local.env' );
if ( fs.existsSync( localEnvironmentFile ) ) {
	ENV_FILE = localEnvironmentFile
}
 
 const WP_CONTAINER = 'wc_snap_wordpress';
 const WP_CLI = `docker run --env-file ${ ENV_FILE } --rm --user xfs --volumes-from ${ WP_CONTAINER } --network container:${ WP_CONTAINER } wordpress:cli`;

// Make sure the screenshots directory exists

if (!fs.existsSync('./screenshots')) {
	fs.mkdirSync('./screenshots');
}

 // clear the screenshots folder before running
 const screenshotPath = path.resolve( './screenshots' );
 if (fs.existsSync(screenshotPath)) {
	 fs.readdirSync(screenshotPath).forEach((file, index) => {
		 const filename = path.join(screenshotPath, file);
		 fs.unlinkSync(filename);
	 });
 }

 async function setupBrowser() {
	 await setBrowserViewport( 'large' );
 }
 
 /**
  * Adds an event listener to the page to handle additions of page event
  * handlers, to assure that they are removed at test teardown.
  */
 function capturePageEventsForTearDown() {
	 page.on( 'newListener', ( eventName, listener ) => {
		 pageEvents.push( [ eventName, listener ] );
	 } );
 }
 
 /**
  * Removes all bound page event handlers.
  */
 function removePageEvents() {
	 pageEvents.forEach( ( [ eventName, handler ] ) => {
		 page.removeListener( eventName, handler );
	 } );
 }

 
 function setTestTimeouts() {
	 const TIMEOUT = 100000;
	 // Increase default value to avoid test failing due to timeouts.
	 page.setDefaultTimeout( TIMEOUT );
	 // running the login flow takes more than the default timeout of 5 seconds,
	 // so we need to increase it to run the login in the beforeAll hook
	 jest.setTimeout( TIMEOUT );
 }
 
 async function createCustomerUser() {
	 const username = config.get( 'users.customer.username' );
	 const email = config.get( 'users.customer.email' );
	 const password = config.get( 'users.customer.password' );
 
	 shell.exec( `${ WP_CLI } wp user delete ${ username } --yes`, {
		 silent: true,
	 } );
	 shell.exec(
		 `${ WP_CLI } wp user create ${ username } ${ email } --role=customer --user_pass=${ password }`,
		 { silent: true }
	 );
 }
 
 async function removeGuestUser() {
	 const email = config.get( 'users.guest.email' );
	 shell.exec( `${ WP_CLI } wp user delete ${ email } --yes`, {
		 silent: true,
	 } );
 }
 
 // Before every test suite run, delete all content created by the test. This ensures
 // other posts/comments/etc. aren't dirtying tests and tests don't depend on
 // each other's side-effects.
 beforeAll( async () => {
	 capturePageEventsForTearDown();
	 enablePageDialogAccept();
	 setTestTimeouts();
	 await createCustomerUser();
	 await removeGuestUser();
	 await setupBrowser();
 } );
 
 afterEach( async () => {
	 await setupBrowser();
 } );
 
 afterAll( () => {
	 removePageEvents();
 } );
 