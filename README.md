# TruyenCuoi

Ruby 4.0.7 · Rails 8.1 · PostgreSQL · Propshaft + esbuild + dart-sass

## Setup

```sh
bin/setup          # bundle install, yarn install, db:prepare, then starts bin/dev
bin/dev            # rails server + JS/CSS watchers (Procfile.dev)
bin/rails test
```

Assets:

- JavaScript entry points live in `app/javascript` (`application.js`, `rails_admin.js`) and are bundled by esbuild (`yarn build`) into `app/assets/builds`.
- Stylesheets: `app/assets/stylesheets/application.scss` (Bootstrap 3 via `bootstrap-sass`) and `rails_admin.scss`, compiled by `yarn build:css`.
- Page-specific classic scripts (`app/assets/javascripts/xiangqi/*`, `news.js`) are served as-is by Propshaft.
- React components (`app/javascript/components`) are rendered from page scripts with `TruyenCuoi.mount("RoomList", element, props)`.

## Environment

See `.env.sample`. Production (Heroku) needs:

| Variable | Purpose |
| --- | --- |
| `SECRET_KEY_BASE` | Rails secret |
| `DATABASE_URL` | Set by Heroku Postgres |
| `HOST` | Mailer host for Devise emails |
| `SMTP_ADDRESS`, `SMTP_USERNAME`, `SMTP_PASSWORD` | Outgoing mail (`MANDRILL_*` still accepted) |
| `PHOTON_APP_ID` | Photon Cloud app for Xiangqi |
| `DEVISE_SECRET_KEY` | Optional; set to the old hard-coded Devise key to keep outstanding confirmation/reset tokens valid |
| `FORCE_SSL` | Optional; `true` to redirect all traffic to https |

Heroku needs the Node.js buildpack before Ruby so `yarn build` runs during `assets:precompile`:

```sh
heroku buildpacks:clear
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/ruby
```

Create the RailsAdmin login with `ADMIN_EMAIL=... ADMIN_PASSWORD=... bin/rails db:seed`.
