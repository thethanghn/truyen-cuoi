class UpdateDefaultStatusOfRooms < ActiveRecord::Migration
  def change
    change_column :rooms, :status, :string, default: 'init', null: false
  end
end
