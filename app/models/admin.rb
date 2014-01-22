class Admin < ActiveRecord::Base
  #attr_accessible :email, :password
  devise :database_authenticatable, :timeoutable
end
