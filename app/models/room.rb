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

class Room < ActiveRecord::Base
  has_many :room_users, dependent: :destroy

  scope :outdated, -> { where{created_at < DateTime.now - 30.minutes } }

  def self.cleanup_rooms
    self.where{((status == 'init') | (status == 'open')) & (created_at < DateTime.now - 30.minutes)}.all.destroy_all
  end
end
