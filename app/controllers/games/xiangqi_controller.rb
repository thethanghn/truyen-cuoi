class Games::XiangqiController < ApplicationController
  def index
  end

  def play
    @room = Room.new title: params[:title]
    @gameId = params[:gameId]
    @ope = params[:ope] || 'init'

  end

end