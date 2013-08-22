Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, ENV['717869914889727'], ENV['8a742a616b9de685eb6edde1614aaa40']
end