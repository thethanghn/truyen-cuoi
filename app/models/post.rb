class Post < ActiveRecord::Base
  attr_accessible :body, :published, :title
  default_scope order{created_at.desc}
end
