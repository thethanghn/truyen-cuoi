class PhotonController < ApplicationController
  skip_before_action :verify_authenticity_token

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
    Rails.logger.info params
    if params[:error].present?
      raise PhotonError.new( params[:error], "invalid argument error")
    end
    render success
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
    game_id = params["GameId"]

    raise PhotonError.new(1, "Invalid GameId") unless game_id.present?

    room = Room.find_by_game_name(game_id)

    raise "Unable to find room with GameId: #{game_id}" unless room.present?
    room.update status: 'closed'
    render success
  end

  private

  def photon_argument_errors(e)
    render json: e.to_json
  end

  def success
    { json: { ResultCode: 0, Message: 'OK' } }
  end
end