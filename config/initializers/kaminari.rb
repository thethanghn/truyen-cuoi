# RailsAdmin paginates with Kaminari while the app uses will_paginate. Both want
# to define `.page` on models, so give Kaminari's version a different name
# (RailsAdmin reads Kaminari.config.page_method_name).
Kaminari.configure do |config|
  config.page_method_name = :page_kaminari
end
