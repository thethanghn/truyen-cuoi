class AddGameTypeToRooms < ActiveRecord::Migration[4.2]
  def change
    add_column :rooms, :game_type, :string, null: false
  end
end
