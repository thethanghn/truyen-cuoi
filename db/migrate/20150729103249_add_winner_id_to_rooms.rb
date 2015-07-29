class AddWinnerIdToRooms < ActiveRecord::Migration
  def change
    add_column :rooms, :winner_id, :integer, index: true
  end
end
