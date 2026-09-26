# Creates the RailsAdmin login. Run with:
#   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... bin/rails db:seed
email = ENV["ADMIN_EMAIL"]
password = ENV["ADMIN_PASSWORD"]

if email.present? && password.present?
  admin = Admin.find_or_initialize_by(email: email)
  admin.password = password
  admin.save!
  puts "Admin #{email} ready."
else
  puts "Skipping admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD."
end
