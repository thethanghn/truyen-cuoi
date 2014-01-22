# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140122101800) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admins", force: true do |t|
    t.string   "email"
    t.string   "encrypted_password"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  create_table "manga_sources", force: true do |t|
    t.string   "title"
    t.string   "name"
    t.string   "website"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "icon"
  end

  add_index "manga_sources", ["name"], name: "index_manga_sources_on_name", using: :btree
  add_index "manga_sources", ["title"], name: "index_manga_sources_on_title", using: :btree
  add_index "manga_sources", ["website"], name: "index_manga_sources_on_website", using: :btree

  create_table "manga_sources_mangas", force: true do |t|
    t.integer "manga_source_id"
    t.integer "manga_id"
  end

  add_index "manga_sources_mangas", ["manga_id"], name: "index_manga_sources_mangas_on_manga_id", using: :btree
  add_index "manga_sources_mangas", ["manga_source_id"], name: "index_manga_sources_mangas_on_manga_source_id", using: :btree

  create_table "mangas", force: true do |t|
    t.string   "title"
    t.string   "name"
    t.string   "cover"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "path"
  end

  add_index "mangas", ["name"], name: "index_mangas_on_name", using: :btree
  add_index "mangas", ["path"], name: "index_mangas_on_path", using: :btree
  add_index "mangas", ["title"], name: "index_mangas_on_title", using: :btree

  create_table "posts", force: true do |t|
    t.string   "title"
    t.text     "body"
    t.boolean  "published"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "post_type",  default: "story"
  end

  add_index "posts", ["post_type"], name: "index_posts_on_post_type", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
