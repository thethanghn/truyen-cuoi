# == Schema Information
#
# Table name: room_users
#
#  id         :integer          not null, primary key
#  room_id    :integer          not null
#  user_id    :integer          not null
#  position   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  join_token :integer          default(0)
#  status     :string           default("active"), not null
#

require 'test_helper'

class RoomUserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
