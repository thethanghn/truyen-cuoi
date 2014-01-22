class MangasController < ApplicationController
  before_action :set_manga, only: [:show, :edit, :update, :destroy]

  # GET /mangas
  def index
    @mangas = Manga.all
  end

  # GET /mangas/1
  def show
  end

  # GET /mangas/new
  def new
    @manga = Manga.new
  end

  # GET /mangas/1/edit
  def edit
  end

  # POST /mangas
  def create
    @manga = Manga.new(manga_params)

    if @manga.save
      redirect_to @manga, notice: 'Manga was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /mangas/1
  def update
    if @manga.update(manga_params)
      redirect_to @manga, notice: 'Manga was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /mangas/1
  def destroy
    @manga.destroy
    redirect_to mangas_url, notice: 'Manga was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_manga
      @manga = Manga.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def manga_params
      params.require(:manga).permit(:title, :name, :cover)
    end
end
