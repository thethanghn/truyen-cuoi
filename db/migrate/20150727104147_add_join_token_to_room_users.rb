class AddJoinTokenToRoomUsers < ActiveRecord::Migration
  def change
    add_column :room_users, :join_token, :integer, default: 0
  end
end
