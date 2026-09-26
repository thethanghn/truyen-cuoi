require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Turn on fragment caching in view templates.
  config.action_controller.perform_caching = true

  # Cache assets for far-future expiry since they are all digest stamped.
  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.year.to_i}" }

  # Heroku terminates SSL at its router. Opt in with FORCE_SSL=true once every
  # client (including the Photon webhooks) uses https.
  config.assume_ssl = ENV["FORCE_SSL"] == "true"
  config.force_ssl = ENV["FORCE_SSL"] == "true"

  # Log to STDOUT with the current request id as a default log tag.
  config.log_tags = [ :request_id ]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Change to "debug" to log everything (including potentially personally-identifiable information!).
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Prevent health checks from clogging up the logs.
  config.silence_healthcheck_path = "/up"

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Mailer (Devise confirmation emails). Set HOST and SMTP_* in the Heroku config.
  config.action_mailer.default_url_options = { host: ENV.fetch("HOST", "example.com"), protocol: "https" }
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address:              ENV.fetch("SMTP_ADDRESS", "smtp.mandrillapp.com"),
    port:                 ENV.fetch("SMTP_PORT", 587).to_i,
    domain:               ENV["HOST"],
    user_name:            ENV["SMTP_USERNAME"] || ENV["MANDRILL_USERNAME"],
    password:             ENV["SMTP_PASSWORD"] || ENV["MANDRILL_PASSWORD"],
    authentication:       :login,
    enable_starttls_auto: true
  }

  # Enable locale fallbacks for I18n.
  config.i18n.fallbacks = true

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Only use :id for inspections in production.
  config.active_record.attributes_for_inspect = [ :id ]
end
