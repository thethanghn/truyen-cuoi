class Mobile::ChaptersController < Mobile::MobileController
  def index
    @chapters = MangaReaderCrawler.chapterize(params[:manga_id])
  end
end