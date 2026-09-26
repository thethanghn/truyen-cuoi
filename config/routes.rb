Rails.application.routes.draw do
  # Health check for load balancers and uptime monitors.
  get "up" => "rails/health#show", as: :rails_health_check

  # Photon Cloud webhooks
  resources :photon, only: [] do
    post "PathCreate"
    post "PathClose"
    post "PathJoin"
    post "PathLeave"
  end

  devise_for :admins
  mount RailsAdmin::Engine => "/admin", as: "rails_admin"

  devise_for :users
  get "/random" => "posts#random"

  resources :posts do
    collection do
      get "read"
      get "canvas"
    end
  end

  resources :news

  namespace :games do
    resources :blackjack
    resources :xiangqi do
      get :play, on: :collection
    end
    resources :rooms do
      post :init
      get :join
      post :error
    end
  end

  root to: "posts#index"
end
