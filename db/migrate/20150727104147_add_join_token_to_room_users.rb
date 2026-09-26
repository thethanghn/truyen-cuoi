class AddJoinTokenToRoomUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :room_users, :join_token, :integer, default: 0
  end
end
