class Games::XiangqiController < GamesController
  before_action :authenticate_user!, only: [:play]
  def index
    @rooms = Room.where(status: 'open').where(game_type: 'mystery_xianqqi').to_a

    respond_to do |format|
      format.html
      format.json { render json: @rooms.to_json }
    end
  end

  def play
    @room = Room.find params[:room_id]
    @title = @room.title
    @room_user = @room.room_users.where(user_id: current_user.id).last
    @ope = params[:ope] || 'init'
    if @ope == 'init' && @room_user.join_token > 0
      @ope = 'rejoin'
    end
  end

end