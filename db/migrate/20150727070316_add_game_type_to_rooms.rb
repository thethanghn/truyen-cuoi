class AddGameTypeToRooms < ActiveRecord::Migration
  def change
    add_column :rooms, :game_type, :string, null: false
  end
end
