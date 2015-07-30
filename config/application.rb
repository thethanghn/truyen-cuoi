require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(:default, Rails.env)

module TruyenCuoi
  class Application < Rails::Application
    config.autoload_paths += %W(#{config.root}/lib/crawlers)

    config.assets.precompile += %w(*.png *.jpg *.jpeg *.gif *.svg *.ttf *.woff *.eot)

    # add vendor/images to the assets path
    config.assets.paths << Rails.root.join("vendor", "assets", "fonts")
  end
end
