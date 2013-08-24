class AddTypeToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :post_type, :string, :default => 'story'
    add_index :posts, :post_type
  end
end
