class AddGameNameToRooms < ActiveRecord::Migration
  def change
    add_column :rooms, :game_name, :string
  end
end
