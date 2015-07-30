class AddPhotonErrorToRooms < ActiveRecord::Migration
  def change
    enable_extension "hstore"
    add_column :rooms, :photon_error, :hstore
  end
end
