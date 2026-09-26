require "test_helper"

class PagesSmokeTest < ActionDispatch::IntegrationTest
  test "public pages render" do
    [root_url, games_xiangqi_index_url, games_blackjack_index_url, news_index_url,
     new_user_session_url, new_user_registration_url, rails_health_check_url].each do |url|
      get url
      assert_response :success, "expected #{url} to render"
    end
  end

  test "xiangqi play page renders for a player in the room" do
    sign_in users(:alice)
    get play_games_xiangqi_index_url(room_id: rooms(:open_room).id)
    assert_response :success
  end

  test "rails admin requires an admin" do
    get rails_admin_url
    assert_redirected_to new_admin_session_url

    sign_in admins(:admin)
    get rails_admin_url
    assert_response :success
  end
end
