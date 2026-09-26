RailsAdmin.config do |config|
  # Assets are built by jsbundling/cssbundling (see package.json "build" scripts).
  config.asset_source = :webpack

  # Only signed-in admins (Devise scope :admin) can reach /admin.
  config.authenticate_with do
    warden.authenticate! scope: :admin
  end
  config.current_user_method(&:current_admin)

  config.actions do
    dashboard
    index
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app
  end
end
