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
#

class Room < ActiveRecord::Base
  has_many :room_users, dependent: :destroy

  def self.cleanup_rooms
    self.where(game_name: nil).destroy_all
  end
end
