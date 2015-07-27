class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms, force: true do |t|
      t.string :title
      t.string :password

      t.timestamps null: false
    end
  end
end
