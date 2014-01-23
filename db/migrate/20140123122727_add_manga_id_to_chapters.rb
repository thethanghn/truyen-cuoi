class AddMangaIdToChapters < ActiveRecord::Migration
  def change
    add_column :chapters, :manga_id, :integer
    add_index :chapters, :manga_id
  end
end
