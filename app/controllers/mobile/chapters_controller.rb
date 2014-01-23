class Mobile::ChaptersController < Mobile::MobileController
  def index
    manga = Manga.find(params[:manga_id]);
    if manga.chapters.count == 0
      @chapters = MangaReaderCrawler.chapterize(params[:manga_id])
      
      @chapters.each do |chapter|
        manga.chapters << Chapter.new(chapter)
      end
    end

    render json: manga.chapters.to_json
  end
end