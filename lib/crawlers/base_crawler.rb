require 'open-uri'
class BaseCrawler
  def self.get(name)
    case name
    when 'manga-reader'
      MangaReaderCrawler.new
    else
      puts 'no crawler found'
      nil
    end
  end
end