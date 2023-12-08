#!/bin/bash

SITE_TITLE="WooCommerce"

if [[ -f "./env/local.env" ]]; then
	echo "Loading local env file..."
	ENV_FILE="./env/local.env"
else 
	echo "Loading in default env file..."
	ENV_FILE="./env/default.env"
fi

# Get any themes, plugins, or wporg_plugin slugs that were provided
themes_dir="themes"
plugins_dir="plugins"

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --theme=*)
      theme_file="${1#*=}"
      if [ -f "$theme_file" ]; then
        echo "Processing theme file: $theme_file"
		unzip -q "$theme_file" -d "$themes_dir/$theme_folder"
		theme_slug="$(basename -s .zip "$theme_file")"
		echo "Theme slug: $theme_slug"
      else
        echo "Error: Theme file not found - $theme_file" >&2
        exit 1
      fi
      ;;
    --plugin=*)
      plugin_file="${1#*=}"
      if [ -f "$plugin_file" ]; then
        echo "Processing plugin file: $plugin_file"
		unzip -q "$plugin_file" -d "$plugins_dir/$plugin_folder"
		plugin_slug="$(basename -s .zip "$plugin_file")"
		echo "Plugin slug: $plugin_slug"
      else
        echo "Error: Plugin file not found - $plugin_file" >&2
        exit 1
      fi
      ;;
	--wporg_plugins=*)
      wporg_plugins="${1#*=}"
      IFS=',' read -ra wporg_plugins_array <<< "$wporg_plugins"
      ;;
	--wporg_themes=*)
      wporg_themes="${1#*=}"
      IFS=',' read -ra wporg_themes_array <<< "$wporg_themes"
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
  shift
done

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

echo "Updating permalink structure"
cli wp rewrite structure '/%postname%/'

if [ -z "$WOOCOMMERCE_VERSION" ]
then
    echo "Installing and activating WooCommerce..."
    cli wp plugin install woocommerce --activate
else 
    echo "Installing and activating WooCommerce ${WOOCOMMERCE_VERSION} ..."
    cli wp plugin install woocommerce --version=${WOOCOMMERCE_VERSION} --activate
fi

echo "Installing and activating Storefront theme..."
cli wp theme install storefront --activate

if [ -n "$wporg_plugins" ]
then
	for plugin in "${wporg_plugins_array[@]}"; do
		echo "Installing and activating ${plugin}..."
		cli wp plugin install ${plugin} --activate
	done
fi

if [ -n "$wporg_themes" ]
then
	for theme in "${wporg_themes_array[@]}"; do
		echo "Installing and activating ${theme}..."
		cli wp theme install ${theme}
	done
fi

if [ -n "$theme_slug" ]
then
	echo "Installing and activating ${theme_slug}..."
	cli wp theme activate ${theme_slug}
fi

if [ -n "$plugin_slug" ]
then
	echo "Installing and activating ${plugin_slug}..."
	cli wp plugin activate ${plugin_slug}
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
cli wp import wp-content/plugins/woocommerce/sample-data/sample_products.xml --authors=skip --quiet

# Hide the admin notices for cleaner screenshotting
cp "env/silence-notices.php" "plugins"
cli wp plugin activate silence-notices

# Entirely for fun, output Woo in the brand purple
R=173
G=134
B=233

COLOR_CODE=$(printf "%03d" "$((16 + 36 * $R / 255 * 6 + 6 * $G / 255 + $B / 255))")

banner="
 __          __          _ 
 \ \        / /         | |
  \ \  /\  / /__   ___  | |
   \ \/  \/ / _ \ / _ \ | |
    \  /\  / (_) | (_)  |_|
     \/  \/ \___/ \___/ (_)

"

echo -e "\033[38;5;${COLOR_CODE}m$banner\033[0m"

echo "The site is up and running at http://${WP_URL}/wp-admin/. Head over there to check it out :)"