class MangaReaderCrawler < BaseCrawler
  CATEGORY_LIST = 'http://www.mangareader.net/alphabetical'
  def categorize
    doc = Nokogiri::HTML(open(CATEGORY_LIST))
    rows = doc.css('ul.series_alpha li a')
    
    rows.map {|row| {title: row.text, name:row.text.downcase.gsub(/\s+/, '-'),  path: @hostname+row['href'] } }
  end

  def self.chapterize(manga_id)
    manga = Manga.find(manga_id)
    doc = Nokogiri::HTML(open(manga.path));
    rows = doc.css('div#chapterlist tr a')
    list = []
    rows.each do |row|
      list << {title: row.text, path: MangaSource.first.website + row['href'] } if row.text && row['href']
    end
    list
  end
end