class Manga < ActiveRecord::Base
  has_and_belongs_to_many :manga_sources
  
end
