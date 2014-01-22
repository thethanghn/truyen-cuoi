# config/initializers/will_paginate.rb
if defined?(WillPaginate)
  module WillPaginate
    module ActiveRecord
      module RelationMethods
        def per(value = nil)
           per_page(value)
         end
         def total_count()
           count
         end
      end
    end
  end
end