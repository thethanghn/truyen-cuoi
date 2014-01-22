class CreateMangaSources < ActiveRecord::Migration
  def change
    create_table :manga_sources do |t|
      t.string :title
      t.string :name
      t.string :website

      t.timestamps
    end
    add_index :manga_sources, :title
    add_index :manga_sources, :name
    add_index :manga_sources, :website
  end
end
