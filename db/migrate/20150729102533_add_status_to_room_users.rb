class AddStatusToRoomUsers < ActiveRecord::Migration
  def change
    add_column :room_users, :status, :string, default: 'active', null: false
  end
end
