# Welcome to WooCommerce Snap! :camera:

WooCommerce snap provides a screenshotting utility for WooCommerce. This utility provides the following features:

* specify WordPress / WooCommerce version
* specify one or more URLs to screenshot
* install a theme or plugin from a zip file
* install a WordPress.org theme or plugin from a slug name

##### Table of Contents  

- [Getting setup](#getting-setup)
- [Customize screenshot URLs](#customize-screenshot-urls)
- [Installing themes and plugins](#installing-themes-and-plugins)
- [Environment configuration ](#environment-configuration)
  - [Testing future releases](#testing-future-releases)
    - [WordPress](#wordpress)
    - [WooCommerce](#woocommerce)
- [Feedback](#feedback)


## Getting setup

Make sure you have [Docker](https://www.docker.com/), [Node.js](https://nodejs.org/) and [NPM](https://docs.npmjs.com/getting-started/what-is-npm) installed on your system.

Once you have those, install dependencies by running:

```
npm install
```

And finally install the browsers needed with:

```
npx playwright install
```

This allows using Firefox, Chrome and Webkit (Safari) for screenshots.

Once complete, spin up the container by running:

```
npm run snap:up
```

Now you can access the site at `http://localhost:8084`. You can also log into the WO Admin at `http://localhost:8084/wp-login.php` with `admin` and `password` as the username and password.

Let's get some screenshots!

Run the following command in your terminal:

```
npm run snap:it
```

Once the script finishes, screenshots will be added to the `screenshots` folder. Note that before each run, the `screenshots` folder will be cleared. Screenshots are stopped by the flow type (`merchant` and `shopper`) and by browser (`chromium`, `firefox`, `webkit`).

When you're done screenshotting, you can run the following to stop the container:

```
npm run snap:down
```

**Note**: This will delete everything in the `plugins`, `themes` and `screenshots` folders, so be sure you have anything from there saved that you need!

And that's it!

## Customize screenshot URLs

Edit the `config.json` with any overrides you'd like, for example, you can add more URLs you'd like to screenshot or remove others:

```json
{
    "shopperUrls": [
        "shop",
        "cart"
    ],
    "merchantUrls": [
        "wp-admin/admin.php?page=wc-settings"
    ],
    "fullPageScreenshot": true
}
```

* `shopperUrls`: URLs that a shopper to the store might visit.
* `merchantUrls` Admin views that require a login.
* `fullPageScreenshot`: Whether or not to take a full page screenshot.

**Note:** URLs just need the end of the path. For example, if you want to screenshot a page at http://localhost:8084/my-account/ you just need to add in `my-account` under shopper URLs:

```json
{
    "shopperUrls": [
        "shop",
        "cart",
        "my-account"
    ],
}
```

## Installing themes and plugins

You can additionally pass in any of the following arguments to install additional themes and plugins from zip files or from WordPress.org slugs:

* `--theme` - Installs and activates the theme from provided ZIP file. Example: `--theme=bistro.zip` will install and activate the Bistro theme.
* `--plugin` - Installs and activates the plugin from the provided ZIP file. Example: `--plugin=woocommerce-bookings.zip` will install and activate WooCommerce Bookings.
* `--wporg_plugins` - Supports a comma separated list. Example: `--wporg_plugin=classic-editor,contact-form-7` will install and activate both Classic Editor and Contact Form 7.
* `--wporg_themes` - Supports a comma separated list. Example: `--wporg_themes=go,neve` will install and activate both Go and Neve themes, but it won't activate them.

**Note** When using ZIP files, they need to be placed in this directory (`woocommerce-snap`) for the script to work.

Example command with three options:

```
npm run snap:up -- --theme=bistro.zip --plugin=woocommerce-bookings.zip --wporg_plugins=classic-editor
```

This will spin up the site and install and activate the Bistro theme, WooCommerce Bookings, and the Classic Editor plugin.

## Environment configuration

This project can be ran as-is and will default to the following:

* The latest WordPress
* The latest WooCommerce
* Storefront theme installed and activated
* A site with "WooCommerce" as the site title

Local setup allows for overriding the above values. To do so, create a file called `local.env` in the `env` folder with the required and optional values below:

```bash
WORDPRESS_VERSION=<desired target WordPress version> # for example, WORDPRESS_VERSION="5.7.2"
WOOCOMMERCE_VERSION=<desired target WooCommerce version> # for example, WOOCOMMERCE_VERSION="8.2.0"
```

The setup script also requires the following env variables to be configured in `local.env` if using a local setup:

```bash
# WordPress
WORDPRESS_DB_HOST=db:3306
WORDPRESS_DB_USER=<DB user>
WORDPRESS_DB_PASSWORD=<DB password>
WORDPRESS_DB_NAME=<DB name>

# Database
MYSQL_ROOT_PASSWORD=<MYSQL root password>
MYSQL_DATABASE=<DB name>
MYSQL_USER=<DB user>
MYSQL_PASSWORD=<DB password>
```

These can just be copied over from the `default.env` file if no changes are needed. For example, a `local.env` file might look like this:

```bash
WORDPRESS_VERSION="5.7.2"
WOOCOMMERCE_VERSION="8.2.0"

# WordPress
WORDPRESS_DB_HOST=db:3306
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DEBUG=1

# Database
MYSQL_ROOT_PASSWORD=wordpress
MYSQL_DATABASE=wordpress
MYSQL_USER=wordpress
MYSQL_PASSWORD=wordpress
```

### Testing future releases

#### WordPress

If you would like to take screenshots using an upcoming release of WordPress, do the following:

1. Find the official images on [Docker Hub](https://hub.docker.com/_/wordpress).
2. Look in the list of `Supported tags` for the version you'd like.
3. Update `WORDPRESS_VERSION` with the selected tag in your `local.env` file.

As an example, if you wanted to test with the upcoming WordPress 5.8 release, you would look in the list of supported tags for 5.8. In this example, we'll go with `beta-5.8`. Once selected, we'll update the variable with this version in the `local.env` file: `WORDPRESS_VERSION="beta-5.8"`.

#### WooCommerce

For WooCommerce, you can do the following:

1. Find the `Previous Versions` section towards the bottom of the [Advanced View page](https://wordpress.org/plugins/woocommerce/advanced/) for the WooCommerce plugin.
2. Pick the latest version you'd like to use.
3. Update `WOOCOMMERCE_VERSION` with the selected version in your `local.env` file.

For example, you could use `WOOCOMMERCE_VERSION="5.5.0-rc.1"` to test the latest RC of the 5.5 release.

## Feedback

Feedback is welcome! What features would you like to see? Feel free to open an issue or submit a PR.