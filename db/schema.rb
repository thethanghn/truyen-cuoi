# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2015_07_30_031630) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "pg_catalog.plpgsql"

  create_table "admins", id: :serial, force: :cascade do |t|
    t.string "email", limit: 255
    t.string "encrypted_password", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "chapters", id: :serial, force: :cascade do |t|
    t.string "code", limit: 255
    t.string "title", limit: 255
    t.string "path", limit: 255
    t.integer "seq"
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.integer "manga_id"
    t.index ["code"], name: "index_chapters_on_code"
    t.index ["manga_id"], name: "index_chapters_on_manga_id"
    t.index ["path"], name: "index_chapters_on_path"
    t.index ["seq"], name: "index_chapters_on_seq"
    t.index ["title"], name: "index_chapters_on_title"
  end

  create_table "manga_sources", id: :serial, force: :cascade do |t|
    t.string "title", limit: 255
    t.string "name", limit: 255
    t.string "website", limit: 255
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "icon", limit: 255
    t.index ["name"], name: "index_manga_sources_on_name"
    t.index ["title"], name: "index_manga_sources_on_title"
    t.index ["website"], name: "index_manga_sources_on_website"
  end

  create_table "manga_sources_mangas", id: :serial, force: :cascade do |t|
    t.integer "manga_source_id"
    t.integer "manga_id"
    t.index ["manga_id"], name: "index_manga_sources_mangas_on_manga_id"
    t.index ["manga_source_id"], name: "index_manga_sources_mangas_on_manga_source_id"
  end

  create_table "mangas", id: :serial, force: :cascade do |t|
    t.string "title", limit: 255
    t.string "name", limit: 255
    t.string "cover", limit: 255
    t.datetime "created_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.string "path", limit: 255
    t.index ["name"], name: "index_mangas_on_name"
    t.index ["path"], name: "index_mangas_on_path"
    t.index ["title"], name: "index_mangas_on_title"
  end

  create_table "posts", id: :serial, force: :cascade do |t|
    t.string "title", limit: 255
    t.text "body"
    t.boolean "published"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "post_type", limit: 255, default: "story"
    t.index ["post_type"], name: "index_posts_on_post_type"
  end

  create_table "room_users", id: :serial, force: :cascade do |t|
    t.integer "room_id", null: false
    t.integer "user_id", null: false
    t.string "position", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "join_token", default: 0
    t.string "status", default: "active", null: false
    t.index ["room_id", "user_id"], name: "index_room_users_on_room_id_and_user_id", unique: true
  end

  create_table "rooms", id: :serial, force: :cascade do |t|
    t.string "title"
    t.string "password"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "game_type", null: false
    t.string "game_name"
    t.string "status", default: "init", null: false
    t.integer "winner_id"
    t.hstore "photon_error"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 255, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.string "current_sign_in_ip", limit: 255
    t.string "last_sign_in_ip", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.datetime "confirmed_at", precision: nil
    t.string "confirmation_token"
    t.datetime "confirmation_sent_at", precision: nil
    t.string "unconfirmed_email"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end
end
