require "test_helper"

class PostTest < ActiveSupport::TestCase
  test "defaults to the story type" do
    assert_equal "story", Post.new.post_type
  end

  test "rejects unknown post types" do
    post = Post.new(body: "x", post_type: "limerick")
    assert_not post.valid?
    assert post.errors.of_kind?(:post_type, :inclusion)
  end

  test "newest posts come first" do
    assert_equal posts(:two), Post.first
  end

  test "in_group and not_in_group split by id" do
    ids = [posts(:one).id]
    assert_equal [posts(:one)], Post.in_group(ids).to_a
    assert_equal [posts(:two)], Post.not_in_group(ids).to_a
  end

  test "empty groups" do
    assert_empty Post.in_group([])
    assert_equal Post.count, Post.not_in_group([]).count
  end

  test "shuffled order is random per seed but stable for the same seed" do
    40.times { |i| Post.create!(body: "<p>#{i}</p>") }

    order_a = Post.shuffled("seed-a").pluck(:id)
    assert_equal order_a, Post.shuffled("seed-a").pluck(:id)
    assert_not_equal order_a, Post.shuffled("seed-b").pluck(:id)
    assert_equal Post.pluck(:id).sort, order_a.sort
  end
end
