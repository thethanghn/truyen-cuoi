# == Schema Information
#
# Table name: rooms
#
#  id         :integer          not null, primary key
#  title      :string
#  password   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  game_type  :string           not null
#  game_name  :string
#  status     :string           default("init"), not null
#

require 'test_helper'

class RoomTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
