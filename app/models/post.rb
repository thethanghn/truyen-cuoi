class Post < ActiveRecord::Base
  # attr_accessible :body, :published, :title, :post_type
  # classy_enum_attr :post_type
  default_scope {order{created_at.desc}}
  scope :in_group, ->(ids) {
    where{id >> ids}
  }
  scope :not_in_group, ->(ids) {
    where{id << ids}
  }
end
