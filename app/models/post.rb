# == Schema Information
#
# Table name: posts
#
#  id         :integer          not null, primary key
#  title      :string(255)
#  body       :text
#  published  :boolean
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_type  :string(255)      default("story")
#

class Post < ApplicationRecord
  enum :post_type, { story: "story", poem: "poem" }, default: :story, validate: { allow_nil: true }

  default_scope { order(created_at: :desc) }

  scope :in_group, ->(ids) { where(id: ids) }
  scope :not_in_group, ->(ids) { where.not(id: ids) }

  # Random but repeatable order: the same seed always gives the same shuffle,
  # so paginated pages (infinite scroll) never repeat or skip a post.
  scope :shuffled, ->(seed) {
    reorder(Arel.sql(sanitize_sql_array(["md5(posts.id::text || ?)", seed.to_s])))
  }
end
