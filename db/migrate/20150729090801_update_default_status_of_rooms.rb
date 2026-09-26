class UpdateDefaultStatusOfRooms < ActiveRecord::Migration[4.2]
  def change
    change_column :rooms, :status, :string, default: 'init', null: false
  end
end
