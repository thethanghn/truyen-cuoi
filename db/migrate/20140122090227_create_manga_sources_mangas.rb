class CreateMangaSourcesMangas < ActiveRecord::Migration
  def change
    create_table :manga_sources_mangas do |t|
      t.integer :manga_source_id
      t.integer :manga_id
    end
    add_index :manga_sources_mangas, :manga_source_id
    add_index :manga_sources_mangas, :manga_id
  end
end
