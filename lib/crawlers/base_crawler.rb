require 'open-uri'
class BaseCrawler
  def initialize(hostname)
    @hostname = hostname
  end
  def self.get(manga_source)
    case manga_source.name
    when 'manga-reader'
      MangaReaderCrawler.new(manga_source.website)
    else
      puts 'no crawler found'
      nil
    end
  end
end