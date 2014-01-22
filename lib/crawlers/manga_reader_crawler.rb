class MangaReaderCrawler < BaseCrawler
  CATEGORY_LIST = 'http://www.mangareader.net/alphabetical'
  def categorize
    doc = Nokogiri::HTML(open(CATEGORY_LIST))
    rows = doc.css('ul.series_alpha li a')
    rows
  end
end