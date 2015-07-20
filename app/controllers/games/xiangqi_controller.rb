class Games::XiangqiController < ApplicationController
  def index
  end

  def play
    @gameId = params[:gameId]
    @ope = params[:ope] || 'init'
  end

end