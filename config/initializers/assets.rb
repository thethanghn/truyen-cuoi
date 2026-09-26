# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

# Fonts shipped inside npm packages (Bootstrap 3 glyphicons, Font Awesome for RailsAdmin).
Rails.application.config.assets.paths << Rails.root.join("node_modules/bootstrap-sass/assets/fonts")
Rails.application.config.assets.paths << Rails.root.join("node_modules/@fortawesome/fontawesome-free/webfonts")
