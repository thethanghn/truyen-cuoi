namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    Post.delete_all
    make_posts
  end
end

def make_posts
  500.times do
    body = Array.new(rand(2..5)) { "<p>#{Faker::Lorem.paragraph(sentence_count: rand(2..4))}</p>" }.join
    Post.create!(body: body)
  end
end
