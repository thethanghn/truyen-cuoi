class MangaSourcesController < ApplicationController
  before_filter :set_manga_source, only: [:show, :crawl]
  def index
    @manga_sources = MangaSource.all
  end

  def show
  end

  def crawl

  end

  private
    def set_manga_source
      @manga_source = MangaSource.find(params[:id])
    end
end
