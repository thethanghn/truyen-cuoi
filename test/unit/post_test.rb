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

require 'test_helper'

class PostTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
