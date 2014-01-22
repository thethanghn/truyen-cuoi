class MangaSource < ActiveRecord::Base
  #attr_accessible :name, :title, :website
  has_and_belongs_to_many :mangas
end
