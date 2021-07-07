const path = require( 'path' );
const { jestConfig } = require( '@automattic/puppeteer-utils' );

module.exports = {
	...jestConfig,
	rootDir: path.resolve( __dirname, '../../' ),
	roots: [ path.resolve( __dirname, '../' ) ],
	setupFilesAfterEnv: [
		path.resolve( __dirname, './jest-setup.js' ),
		...jestConfig.setupFilesAfterEnv,
	],
};
