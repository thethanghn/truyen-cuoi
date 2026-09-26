class AddGameNameToRooms < ActiveRecord::Migration[4.2]
  def change
    add_column :rooms, :game_name, :string
  end
end
