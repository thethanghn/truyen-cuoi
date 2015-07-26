# == Schema Information
#
# Table name: admins
#
#  id                 :integer          not null, primary key
#  email              :string(255)
#  encrypted_password :string(255)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class Admin < ActiveRecord::Base
  #attr_accessible :email, :password
  devise :database_authenticatable, :timeoutable
end
