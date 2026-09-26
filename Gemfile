source "https://rubygems.org"

ruby file: ".ruby-version"

gem "rails", "~> 8.1.4"

# Assets: Propshaft serves files, esbuild bundles JS, dart-sass builds CSS
gem "propshaft"
gem "jsbundling-rails"
gem "cssbundling-rails"

gem "pg", "~> 1.6"
gem "puma", ">= 6.0"
gem "bootsnap", require: false

# Views
gem "haml", "~> 7.0"
gem "slim-rails", "~> 4.0"

# Auth & admin
gem "devise", "~> 5.0"
gem "rails_admin", "~> 3.3"

gem "will_paginate", "~> 4.0"

# News scraping
gem "faraday", "~> 2.14"
gem "nokogiri", ">= 1.19"

gem "tzinfo-data", platforms: %i[ windows jruby ]

group :development, :test do
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"
  gem "dotenv-rails", "~> 3.1"
  gem "faker", "~> 3.4"
  gem "brakeman", require: false
end

group :development do
  gem "annotaterb", require: false
  gem "web-console"
end
