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

ActiveRecord::Schema.define(version: 20150730031630) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"

  create_table "admins", force: :cascade do |t|
    t.string   "email"
    t.string   "encrypted_password"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "chapters", force: :cascade do |t|
    t.string   "code"
    t.string   "title"
    t.string   "path"
    t.integer  "seq"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "manga_id"
  end

  add_index "chapters", ["code"], name: "index_chapters_on_code", using: :btree
  add_index "chapters", ["manga_id"], name: "index_chapters_on_manga_id", using: :btree
  add_index "chapters", ["path"], name: "index_chapters_on_path", using: :btree
  add_index "chapters", ["seq"], name: "index_chapters_on_seq", using: :btree
  add_index "chapters", ["title"], name: "index_chapters_on_title", using: :btree

  create_table "manga_sources", force: :cascade do |t|
    t.string   "title"
    t.string   "name"
    t.string   "website"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "icon"
  end

  add_index "manga_sources", ["name"], name: "index_manga_sources_on_name", using: :btree
  add_index "manga_sources", ["title"], name: "index_manga_sources_on_title", using: :btree
  add_index "manga_sources", ["website"], name: "index_manga_sources_on_website", using: :btree

  create_table "manga_sources_mangas", force: :cascade do |t|
    t.integer "manga_source_id"
    t.integer "manga_id"
  end

  add_index "manga_sources_mangas", ["manga_id"], name: "index_manga_sources_mangas_on_manga_id", using: :btree
  add_index "manga_sources_mangas", ["manga_source_id"], name: "index_manga_sources_mangas_on_manga_source_id", using: :btree

  create_table "mangas", force: :cascade do |t|
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

  create_table "posts", force: :cascade do |t|
    t.string   "title"
    t.text     "body"
    t.boolean  "published"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "post_type",  default: "story"
  end

  add_index "posts", ["post_type"], name: "index_posts_on_post_type", using: :btree

  create_table "room_users", force: :cascade do |t|
    t.integer  "room_id",                       null: false
    t.integer  "user_id",                       null: false
    t.string   "position",                      null: false
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.integer  "join_token", default: 0
    t.string   "status",     default: "active", null: false
  end

  add_index "room_users", ["room_id", "user_id"], name: "index_room_users_on_room_id_and_user_id", unique: true, using: :btree

  create_table "rooms", force: :cascade do |t|
    t.string   "title"
    t.string   "password"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "game_type",                     null: false
    t.string   "game_name"
    t.string   "status",       default: "init", null: false
    t.integer  "winner_id"
    t.hstore   "photon_error"
  end

  create_table "users", force: :cascade do |t|
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
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "confirmed_at"
    t.string   "confirmation_token"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
