class CreateRooms < ActiveRecord::Migration[4.2]
  def change
    create_table :rooms, force: true do |t|
      t.string :title
      t.string :password

      t.timestamps null: false
    end
  end
end
