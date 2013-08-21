namespace :db do
	desc "Fill database with sample data"
	task populate: :environment do
    [Post].each.each(&:delete_all)
		make_posts
	end
end

def make_posts
  500.times do
    body= ''
    rand(2..5).times do
      body += '<p>' + Faker::Lorem.paragraph(rand(2..4)) + '</p>'
    end
    Post.create(body: body)
  end
end