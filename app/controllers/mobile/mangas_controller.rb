class Mobile::MangasController < Mobile::MobileController
  def index
    @mangas = Manga.all
    render json: @mangas.to_json
  end
end