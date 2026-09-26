class AddIconToMangaSources < ActiveRecord::Migration[4.2]
  def change
    add_column :manga_sources, :icon, :string
  end
end
