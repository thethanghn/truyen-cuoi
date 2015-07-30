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

class Room < ActiveRecord::Base
  has_many :room_users, dependent: :destroy
  belongs_to :winner, class_name: 'User'

  scope :outdated, -> { where{created_at < DateTime.now - 30.minutes } }

  def self.cleanup_rooms
    self.where{((status == 'init') | (status == 'open')) & (created_at < DateTime.now - 30.minutes)}.all.destroy_all
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
