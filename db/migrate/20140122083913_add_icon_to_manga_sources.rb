class AddIconToMangaSources < ActiveRecord::Migration
  def change
    add_column :manga_sources, :icon, :string
  end
end
