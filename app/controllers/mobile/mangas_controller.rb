class Mobile::MangasController < Mobile::MobileController
  def index
    @mangas = Manga.all.limit(20)
    render json: @mangas.to_json
  end
end