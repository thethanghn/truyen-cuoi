class AddConfirmationSentAtToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :confirmation_sent_at, :datetime
    add_column :users, :unconfirmed_email, :string
  end
end
