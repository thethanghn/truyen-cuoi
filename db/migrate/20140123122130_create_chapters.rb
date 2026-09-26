class CreateChapters < ActiveRecord::Migration[4.2]
  def change
    create_table :chapters do |t|
      t.string :code
      t.string :title
      t.string :path
      t.integer :seq

      t.timestamps
    end
    add_index :chapters, :code
    add_index :chapters, :title
    add_index :chapters, :path
    add_index :chapters, :seq
  end
end
