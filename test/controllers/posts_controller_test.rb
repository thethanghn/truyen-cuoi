require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @post = posts(:one)
  end

  test "index lists unread posts" do
    get posts_url
    assert_response :success
    assert_select ".post", 2
  end

  test "reading a post hides it from the unread list" do
    get read_posts_url(id: @post.id, format: :json)
    assert_response :success
    assert_equal [@post.id], response.parsed_body["data"]

    get posts_url
    assert_select ".post", 1
    get posts_url(read: 1)
    assert_select ".post", 1
  end

  test "show" do
    get post_url(@post)
    assert_response :success
  end

  test "random" do
    get random_url
    assert_response :success
  end

  test "new requires an admin" do
    get new_post_url
    assert_redirected_to new_admin_session_url
  end

  test "admin can create a post" do
    sign_in admins(:admin)

    assert_difference("Post.count") do
      post posts_url, params: { post: { body: "<p>New</p>", post_type: "poem" } }
    end

    assert_redirected_to post_url(Post.unscoped.order(:id).last)
    assert_equal "poem", Post.unscoped.order(:id).last.post_type
  end

  test "admin can update a post" do
    sign_in admins(:admin)
    patch post_url(@post), params: { post: { body: "<p>Edited</p>" } }
    assert_redirected_to post_url(@post)
    assert_equal "<p>Edited</p>", @post.reload.body
  end

  test "admin can destroy a post" do
    sign_in admins(:admin)
    assert_difference("Post.count", -1) do
      delete post_url(@post)
    end
    assert_redirected_to posts_url
  end

  test "anonymous visitors cannot destroy posts" do
    assert_no_difference("Post.count") do
      delete post_url(@post)
    end
  end

  test "infinite scroll pages share one shuffle with no repeats" do
    40.times { |i| Post.create!(body: "<p>#{i}</p>") }
    ids_on = ->(html) { Nokogiri::HTML(html).css("#masonry-container .post").map { |n| n["id"].to_i } }

    get posts_url
    page1 = ids_on.(response.body)
    get posts_url(page: 2)
    page2 = ids_on.(response.body)

    assert_equal 30, page1.size
    assert_empty page1 & page2
    assert_equal Post.count, (page1 + page2).uniq.size
  end
end
