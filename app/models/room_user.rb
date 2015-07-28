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
#

class RoomUser < ActiveRecord::Base

  belongs_to :room
  belongs_to :user

  validates :room_id, :user_id, :position, presence: true
end
