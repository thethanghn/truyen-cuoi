# == Schema Information
#
# Table name: rooms
#
#  id           :integer          not null, primary key
#  title        :string
#  password     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  game_type    :string           not null
#  game_name    :string
#  status       :string           default("init"), not null
#  winner_id    :integer
#  photon_error :hstore
#

# status: init, open, closed

class Room < ApplicationRecord
  has_many :room_users, dependent: :destroy
  belongs_to :winner, class_name: "User", optional: true

  scope :outdated, -> { where(created_at: ...30.minutes.ago) }

  def self.cleanup_rooms
    outdated.where(status: %w[init open]).destroy_all
  end

  def decide(params)
    actor_nr = params[:join_token]
    reason = params[:reason]
    #the loser
    room_user = self.room_users.where(join_token: actor_nr).last
    room_user.update status: reason
    #the winner
    room_user = self.room_users.where.not(join_token: actor_nr).last
    room_user.update status: 'won'
    self.update status: 'closed', winner_id: room_user.user_id
    #store performance report
    # we will see
  end

  def is_not_finished?
    status != 'closed'
  end
end
