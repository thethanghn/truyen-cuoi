class AddWinnerIdToRooms < ActiveRecord::Migration[4.2]
  def change
    add_column :rooms, :winner_id, :integer, index: true
  end
end
