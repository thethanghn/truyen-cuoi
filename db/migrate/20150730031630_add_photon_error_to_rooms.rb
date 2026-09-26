class AddPhotonErrorToRooms < ActiveRecord::Migration[4.2]
  def change
    enable_extension "hstore"
    add_column :rooms, :photon_error, :hstore
  end
end
