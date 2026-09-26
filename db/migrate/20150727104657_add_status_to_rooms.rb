class AddStatusToRooms < ActiveRecord::Migration[4.2]
  def change
    add_column :rooms, :status, :string, default: 'open', null: false
  end
end
