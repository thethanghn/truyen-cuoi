class Games::RoomsController < GamesController
  before_action :authenticate_user!
  before_action :cleanup_rooms
  before_action :check_open_rooms, only: [:create, :join]

  def init
    room = Room.find(params[:room_id])
    room.update status: 'open'
    room.room_users.where(user_id: current_user.id).last.update join_token: params[:join_token]

    render json: { status: 'ok' }
  end

  def error
    room = Room.find(params[:room_id])
    room.update photon_error: params[:error]
    render json: { status: 'ok' }
  end

  def create
    room = Room.create title: params[:title], game_type: 'mystery_xianqqi', game_name: SecureRandom.uuid
    room.room_users.create user: current_user, position: 'host'
    redirect_to play_games_xiangqi_index_path(room_id: room.id)
  end

  def join
    room = Room.find(params[:room_id])
    room.room_users.create user: current_user, position: 'guest'
    redirect_to play_games_xiangqi_index_path(room_id: room.id, ope: 'join')
  end

  private

  def check_open_rooms
    if current_user.open_rooms.any?
      room = current_user.open_rooms.last
      redirect_to play_games_xiangqi_index_path(room_id: room.id, ope: 'join')
    end
  end

  def cleanup_rooms
    Room.cleanup_rooms
  end

end