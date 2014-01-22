class AddPathToMangas < ActiveRecord::Migration
  def change
    add_column :mangas, :path, :string
    add_index :mangas, :path
  end
end
