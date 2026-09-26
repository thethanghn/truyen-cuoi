class AddConfirmationTokenToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :confirmation_token, :string
  end
end
