# == Schema Information
#
# Table name: admins
#
#  id                 :integer          not null, primary key
#  email              :string(255)
#  encrypted_password :string(255)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

require 'test_helper'

class AdminTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
