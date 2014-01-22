class CreateMangas < ActiveRecord::Migration
  def change
    create_table :mangas do |t|
      t.string :title
      t.string :name
      t.string :cover

      t.timestamps
    end
    add_index :mangas, :title
    add_index :mangas, :name
  end
end
