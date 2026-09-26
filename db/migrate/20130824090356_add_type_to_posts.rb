class AddTypeToPosts < ActiveRecord::Migration[4.2]
  def change
    add_column :posts, :post_type, :string, :default => 'story'
    add_index :posts, :post_type
  end
end
