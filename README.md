# Welcome to WooCommerce Snap! :camera:

WooCommerce snap provides a screenshotting utility for WooCommerce. This utility provides the following features:

* specify WordPress / WooCommerce version
* specify theme
* specify one or more URLs to screenshot
* specify the height/width of the screenshot
* specify a device (such as mobile, tablet, or desktop)
* specify a selector to focus the screenshot on

##### Table of Contents  

- [Getting setup](#getting-setup)
- [Environment configuration ](#environment-configuration)
  - [Testing future releases](#testing-future-releases)
    - [WordPress](#wordpress)
    - [WooCommerce](#woocommerce)
  - [Plugins](#plugins)
- [Config settings](#config-settings)
- [Available commands](#available-commands)
- [Feedback](#feedback)


## Getting setup

Make sure you have [Docker](https://www.docker.com/), [Node.js](https://nodejs.org/) and [NPM](https://docs.npmjs.com/getting-started/what-is-npm) installed on your system.

Once you have those, install dependencies by running:

```
npm install
```

Once complete, spin up the container by running:

```
npm run snap:up
```

Now you can access the site at `http://localhost:8084`. You can also log into the WO Admin at `http://localhost:8084/wp-login.php` with `admin` and `password` as the username and password.

Let's run a few tests!

Run the following command in your terminal:

```
npm run snapit-urls
```

Once the script finishes, screenshots will be added to the `screenshots` folder. Note that before each run, the `screenshots` folder will be cleared.

When you're done screenshotting, you can run the following to stop the container:

```
npm run snap:down
```

And that's it!

## Environment configuration

This project can be ran as-is and will default to the following:

* The latest WordPress
* The latest WooCommerce
* Storefront theme installed and activated
* A site with "WooCommerce Snap" as the site title

Local setup allows for overriding the above values. To do so, create a file called `local.env` in the `env` folder with the required and optional values below:

```bash
WORDPRESS_VERSION=<desired target WordPress version> # for example, WORDPRESS_VERSION="5.7.2"
WOOCOMMERCE_VERSION=<desired target WooCommerce version> # for example, WOOCOMMERCE_VERSION="5.2.0"
SITE_TITLE=<desired site title> # for example, SITE_TITLE="Demo Store"
SITE_THEME=<slug of desired theme> # for example, SITE_THEME="twenty-twenty-one"
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
WOOCOMMERCE_VERSION="5.2.0"

SITE_TITLE="WooCommerce Snap - Local Env"
SITE_THEME="astra"

# WordPress
WORDPRESS_DB_HOST=db:3306
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DEBUG=1
ABSPATH=/usr/src/wordpress/

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

1. Find the `Previous Versions` section otowards the bottom of the [Advanced View page](https://wordpress.org/plugins/woocommerce/advanced/) for the WooCommerce plugin.
2. Pick the latest version you'd like to use.
3. Update `WOOCOMMERCE_VERSION` with the selected version in your `local.env` file.

For example, you could use `WOOCOMMERCE_VERSION="5.5.0-rc.1"` to test the latest RC of the 5.5 release.

## Default settings

Edit the `capture/config/default.json` with any overrides you'd like. Of note, the following fields affect how screenshots are taken:

```json
{
  "screenshotUrls": [
    {
      "url": "wp-admin/edit.php?post_type=shop_coupon",
      "name": "coupons"
    },
    {
      "url": "wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Foverview",
      "name": "analytics-overview"
    }
  ],
  "viewport": {
    "width": 1280,
    "height": 720
  },
  "deviceViewport": {
    "enabled": false,
    "device": "iPhone 6"
  },
  "fullPageScreenshot": false
}
```

* `screenshotUrls`: Determines the URL(s) to load and screenshot. Supply the URL to load in the `url` field and the `name` field, which is used for the screenshot file name.
* `viewport` is the viewport size of the browser, supply any height or width you'd like.
* `deviceViewport` is a device specifc viewport size and the option to enable to disable it.
  * A full list of devices that are supported can be found [here](https://github.com/puppeteer/puppeteer/blob/5e21ba3cbbe455317158e6a4fc5af2808abd45df/lib/DeviceDescriptors.js).
* `fullPageScreenshot` can be used to enable/disable taking a full page screenshot. If enabled, the `viewport` will be ignored.

## Available commands

You can run any of the following commands. Note that using `-dev` opens the browser in non-headless mode so you can watch as the automation runs.

### URLs

Use these commands to take screenshots of URLs provided in the `capture/config/default.json` file.

```
snap:urls
snap:urls-dev
```

### Merchant

```
snap:merchant
snap:merchant-dev
```

### Shopper

```
snap:shopper
snap:shopper-dev
```

**Using workflows**

Both the Merchant and Shopper flows provide workflows that can be built rather than just visiting URLs. Please see the [Workflows page]((docs/workflows.md)) for more details on building workflows for screenshots.

## Screenshot methods

`takeScreenshot()` - takes a screenshot of the page and saves it to the `screenshots` folder. A full page screenshot is taken if `fullPageScreenshot` is set to `true` in `default.json`.

`screenshotDOMElement()` - takes a screenshot of the DOM element and saves it to the `screenshots` folder. Parameters include: `name` for the screenshot file name, `selector` for the DOM element to screenshot, and optional `padding` around the selector.

`screenshotBuffer()` - returns a base64 encoded screenshot of the provided URL. Implemented for potential use in an API to gather screenshots.

## Feedback

Feedback is welcome! What features would you like to see? Feel free to open an issue or submit a PR.