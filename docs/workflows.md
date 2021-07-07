# Workflows

Both the `merchant` and `shopper` flows provide a number of options for a variety of workflows that can be built out. Both `capture/merchant/merchant.test.js` and `capture/shopper/shopper.test.js` are provided as examples of how to build out a capture workflow. Feel free to modify as needed or add your own into each directory. These can be ran individually or together as needed. For example, to run all the merchant screenshot runs, you can run:

```
npm run snap:merchant
```

If you want to just run a single flow, you can use the command below, where you just pass in the file name of the flow you want to run:

```
npm run snap:merchant: merchant.test.js
```

## Workflow building

One of the benefits of using the [WooCommerce e2e utils package](https://www.npmjs.com/package/@woocommerce/e2e-utils) is that we get access to a varity of useful methods, which, while intended for testing, provide useful methods for creating screenshot workflows.

Some examples of workflows that can be built are:

* Creating orders
* Creating products
* Placing an order
* Creating a coupon and applying it to an order

Note that as WooCommerce Snap uses the the testing packages from WooCommerce, any files you create will need to end in `.test.js` or `.spec.js` to be picked up by the runner.

### Merchant flows

The full list of merchant flows that are available can be found [here](https://github.com/woocommerce/woocommerce/tree/trunk/tests/e2e/utils#merchant-merchant).

If writing your own capture script for a merchant workflow, you can use the `dismissAllNotices()` helper method to remove any WooCommerce notices in WP Admin (such as the SSL warning and the regenerating thumbnails message) that show in the local environment. For example, this can be added to the `beforeAll() {}` setup as below:

```javascript
    beforeAll(async () => {
        await merchant.login();
        await dismissAllNotices();
    });
```

### Shopper flows

In addition to merchant flows, shopper workflows are also provided and can be used.

The full list of shopper flows that can be used can be found [here](https://github.com/woocommerce/woocommerce/tree/trunk/tests/e2e/utils#shopper-shopper).

### Other utility functions

Other helpful utility functions that can help when building out page workflows can be found [here](https://github.com/woocommerce/woocommerce/tree/trunk/tests/e2e/utils#page-utilities).