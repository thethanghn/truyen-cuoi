class PhotonController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :log_params
  before_action :find_room, only: [:PathClose, :PathJoin, :PathLeave]

  class PhotonError < StandardError
    attr_accessor :code, :message
    def initialize(code, message)
      @code = code
      @message = message
    end

    def to_json
      {ResultCode: @code, Message: @message}
    end
  end

  rescue_from PhotonError, with: :photon_argument_errors

  def PathCreate
    if params[:error].present?
      raise PhotonError.new( params[:error], "invalid argument error")
    end
    render success
  end

  # {
  #   "ActorNr": 2,
  #   "AppVersion": "client-x.y.z",
  #   "AppId": "00000000-0000-0000-0000-000000000000",
  #   "GameId": "MyRoom",
  #   "Region": "EU",
  #   "Type": "Join",
  #   "UserId": "MyUserId0",
  #   "Username": "MyPlayer0"
  # }
  def PathJoin
    room.update status: 'filled'
    render success
  end

  # {
  #   "ActorNr": 1,
  #   "AppVersion": "client-x.y.z",
  #   "AppId": "00000000-0000-0000-0000-000000000000",
  #   "GameId": "MyRoom",
  #   "IsInactive": true,
  #   "Reason": "0",
  #   "Region": "EU",
  #   "Type": "ClientDisconnect",
  #   "UserId": "MyUserId1",
  #   "Username": "MyPlayer1"
  # }
  def PathLeave
    type = params["Type"]
    case type
    when "ClientDisconnect" #Indicates that the client called Disconnect().
    when "ClientTimeoutDisconnect" #Indicates that client has timed-out server. This is valid only when using UDP/ENET.
    when "ManagedDisconnect" #Indicates client is too slow to handle data sent.
    when "ServerDisconnect" #Indicates low level protocol error which can be caused by data corruption.
    when "TimeoutDisconnect" #Indicates that the server has timed-out client. Find additional info in the client connection handling page or the doc on analyzing disconnects .
    when "LeaveRequest" #Indicates that the client called OpLeave().
    when "PlayerTtlTimedOut" #Indicate that the inactive actor timed-out, meaning the PlayerTtL of the room expired for that actor. See the API doc for your SDK for additional info.
    when "PeerLastTouchTimedOut" #Indicates a very unusual scenario where the actor did not send anything to Photon Servers for 5 minutes. Normally peers timeout long before that but Photon does a check for every connected peer's timestamp of the last exchange with the servers (called LastTouch) every 5 minutes.
    when "PluginFailedJoin" #Indicates an internal error in Photon Cloud webhooks implementation."
      @room.destroy
    else
      "Un-handled PathLeave #{type}"
    end
  end


#   {
#     "AppVersion": "client-x.y.z",
#     "AppId": "00000000-0000-0000-0000-000000000000",
#     "GameId": "MyRoom",
#     "Region": "EU",
#     "State": {
#         "ActorCounter": 3,
#         "ActorList": [
#             {
#                 "ActorNr": 1,
#                 "UserId": "MyUserId1",
#                 "Username": "MyPlayer1",
#                 "Binary": "RGIAAAEBRAAAAAJzAAlw...",
#                 "DEBUG_BINARY": {
#                     "1": {
#                         "255": "MyPlayer1",
#                         "player_id": "12345"
#                     }
#                 }
#             },
#             {
#                 "ActorNr": 3,
#                 "UserId": "MyUserId0",
#                 "Username": "MyPlayer0",
#                 "Binary": "RGIAAAEBRAAAAAFi/3MA...",
#                 "DEBUG_BINARY": {
#                     "1": {
#                         "255": "MyPlayer0"
#                     }
#                 }
#             }
#         ],
#         "Binary": {
#             "18": "RAAAAAdzAAhwcm9wMUtl...",
#             "19": "RGl6AAEAAAAAAAN6AANp..."
#         },
#         "CheckUserOnJoin": true,
#         "CustomProperties": {
#             "lobby4Key": "test1b",
#             "lobby3Key": "test1a"
#         },
#         "DeleteCacheOnLeave": false,
#         "EmptyRoomTTL": 0,
#         "IsOpen": true,
#         "IsVisible": true,
#         "LobbyType": 0,
#         "LobbyProperties": [
#             "lobby3Key",
#             "lobby4Key"
#         ],
#         "MaxPlayers": 4,
#         "PlayerTTL": 2147483647,
#         "SuppressRoomEvents": false,
#         "Slice": 0,
#         "DebugInfo": {
#             "DEBUG_PROPERTIES_18": {
#                 "250": [
#                     "lobby3Key",
#                     "lobby4Key"
#                 ],
#                 "prop1Key": "prop1Val",
#                 "prop2Key": "prop2Val",
#                 "lobby4Key": "test1b",
#                 "lobby3Key": "test1a",
#                 "map_name": "mymap",
#                 "turn": 1
#             },
#             "DEBUG_EVENTS_19": {
#                 "0": [
#                     [
#                         3,
#                         0,
#                         "data"
#                     ],
#                     [
#                         3,
#                         0,
#                         "data"
#                     ],
#                     [
#                         3,
#                         0,
#                         "data"
#                     ]
#                 ]
#             }
#         }
#     },
#     "Type": "Save",
#     "EvCode": 0
# }

  def PathClose
    if @room.status == 'open'
      @room.destroy
    else
      @room.update status: 'closed'
    end
    render success
  end

  private

  def log_params
    puts params
    Rails.logger.info params
  end

  def find_room
    game_id = params["GameId"]
    raise PhotonError.new(1, "Invalid GameId") unless game_id.present?
    @room = Room.find_by_game_name(game_id)
    raise "Unable to find room with GameId: #{game_id}" unless room.present?
  end

  def photon_argument_errors(e)
    render json: e.to_json
  end

  def success
    { json: { ResultCode: 0, Message: 'OK' } }
  end
end