#!/bin/bash

SITE_TITLE="WooCommerce Snap"

if [[ -f "./env/local.env" ]]; then
	echo "Loading local env file..."
	ENV_FILE="./env/local.env"
    . ./env/local.env
else 
	echo "Loading in default env file..."
	. ./env/default.env
	ENV_FILE="./env/default.env"
fi

cli()
{
	docker run --env-file $ENV_FILE --rm --user xfs --volumes-from wc_snap_wordpress --network container:wc_snap_wordpress wordpress:cli "$@"
}

echo "Setting up environment..."
docker-compose --env-file $ENV_FILE -f ./env/docker-compose.yml up --build --force-recreate -d

# Wait for containers to be started up before the setup.
# The db being accessible means that the db container started and we're ready to go
cli wp db check --path=/var/www/html --quiet > /dev/null
while [[ $? -ne 0 ]]; do
	echo "Waiting until the service is ready..."
	sleep 5
	cli wp db check --path=/var/www/html --quiet > /dev/null
done
echo "Database is up and running..."

WP_URL="localhost:8084"

echo "Setting up WordPress..."
cli wp core install \
	--path=/var/www/html \
	--url="$WP_URL" \
	--title="$SITE_TITLE" \
	--admin_name=admin \
	--admin_password=password \
	--admin_email="admin@woocommercesnap.com" \
	--skip-email

echo "Updating WordPress to the latest version..."
cli wp core update --quiet

echo "Updating the WordPress database..."
cli wp core update-db --quiet

echo "Updating permalink structure"
cli wp rewrite structure '/%postname%/'

echo "Installing and activating Gutenberg..."
cli wp plugin install gutenberg --activate

if [ -z "$WOOCOMMERCE_VERSION" ]
then
    echo "Installing and activating WooCommerce..."
    cli wp plugin install woocommerce --activate
else 
    echo "Installing and activating WooCommerce ${WOOCOMMERCE_VERSION} ..."
    cli wp plugin install woocommerce --version=${WOOCOMMERCE_VERSION} --activate
fi

if [ -z "$SITE_THEME" ]
then
	echo "Installing and activating Storefront theme..."
	cli wp theme install storefront --activate
else 
    echo "Installing and activating ${SITE_THEME}..."
    cli wp theme install ${SITE_THEME} --activate
fi

echo "Adding basic WooCommerce settings..."
cli wp option set woocommerce_store_address "60 29th Street"
cli wp option set woocommerce_store_address_2 "#343"
cli wp option set woocommerce_store_city "San Francisco"
cli wp option set woocommerce_default_country "US:CA"
cli wp option set woocommerce_store_postcode "94110"
cli wp option set woocommerce_currency "USD"
cli wp option set woocommerce_product_type "both"
cli wp option set woocommerce_allow_tracking "no"
cli wp option set woocommerce_enable_signup_and_login_from_checkout "yes"

echo "Importing WooCommerce shop pages..."
cli wp wc --user=admin tool run install_pages

echo "Installing and activating the WordPress Importer plugin..."
cli wp plugin install wordpress-importer --activate

echo "Importing sample products..."
cli wp import wp-content/plugins/woocommerce/sample-data/sample_products.xml --authors=skip

echo "Installing basic auth plugin for interfacing with the API..."
cli wp plugin install https://github.com/WP-API/Basic-Auth/archive/master.zip
cli wp plugin activate Basic-Auth

echo "Nice! The site is up and running at http://${WP_URL}/wp-admin/. Head over there to check it out :)"