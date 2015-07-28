class AddStatusToRooms < ActiveRecord::Migration
  def change
    add_column :rooms, :status, :string, default: 'open', null: false
  end
end
