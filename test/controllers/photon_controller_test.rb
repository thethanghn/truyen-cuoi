require "test_helper"

class PhotonControllerTest < ActionDispatch::IntegrationTest
  setup do
    @room = rooms(:open_room)
  end

  test "PathCreate opens the room" do
    post "/photon/webhook/PathCreate", params: { GameId: @room.game_name }, as: :json
    assert_response :success
    assert_equal 0, response.parsed_body["ResultCode"]
    assert_equal "open", @room.reload.status
  end

  test "PathJoin marks the room as filled" do
    post "/photon/webhook/PathJoin", params: { GameId: @room.game_name }, as: :json
    assert_equal "filled", @room.reload.status
  end

  test "missing GameId returns a Photon error" do
    post "/photon/webhook/PathCreate", params: {}, as: :json
    assert_equal 1, response.parsed_body["ResultCode"]
  end
end
