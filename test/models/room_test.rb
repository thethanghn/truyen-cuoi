require "test_helper"

class RoomTest < ActiveSupport::TestCase
  test "outdated only includes rooms older than 30 minutes" do
    assert_includes Room.outdated, rooms(:stale_room)
    assert_not_includes Room.outdated, rooms(:open_room)
  end

  test "cleanup_rooms removes stale unfinished rooms only" do
    Room.cleanup_rooms

    assert_not Room.exists?(rooms(:stale_room).id)
    assert Room.exists?(rooms(:open_room).id)
    assert Room.exists?(rooms(:finished_room).id)
  end

  test "decide marks the leaver as loser and the other player as winner" do
    room = rooms(:open_room)
    room.decide(join_token: 1, reason: "quit")

    assert_equal "quit", room_users(:alice_host).reload.status
    assert_equal "won", room_users(:bob_guest).reload.status
    assert_equal "closed", room.reload.status
    assert_equal users(:bob), room.winner
  end
end
