class AddPathToMangas < ActiveRecord::Migration[4.2]
  def change
    add_column :mangas, :path, :string
    add_index :mangas, :path
  end
end
