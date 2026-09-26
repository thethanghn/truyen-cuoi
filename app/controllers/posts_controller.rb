class PostsController < ApplicationController
  before_action :authenticate_admin!, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  def random
    count = Post.count
    @post = Post.offset(rand(count)).first if count.positive?
    render layout: "mobile"
  end

  # GET /posts
  # GET /posts.json
  def index
    @posts = filtered_posts

    respond_to do |format|
      format.html
      format.json { render json: @posts }
    end
  end

  # GET /posts/canvas
  def canvas
    @posts = filtered_posts
    render :index, layout: "canvas"
  end

  # GET /posts/read
  def read
    @post = Post.find(params[:id])
    read = read_ids
    read << @post.id unless read.include?(@post.id)
    cookies[:ids] = ActiveSupport::JSON.encode(read)

    respond_to do |format|
      format.json { render json: { status: "done", data: read } }
    end
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @post }
    end
  end

  # GET /posts/new
  # GET /posts/new.json
  def new
    @post = Post.new(post_type: valid_post_type(params[:post_type]))

    respond_to do |format|
      format.html
      format.json { render json: @post }
    end
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(post_params)

    respond_to do |format|
      if @post.save
        format.html { redirect_to @post, notice: "Post was successfully created." }
        format.json { render json: @post, status: :created, location: @post }
      else
        format.html { render :new, status: :unprocessable_content }
        format.json { render json: @post.errors, status: :unprocessable_content }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post, notice: "Post was successfully updated." }
        format.json { head :no_content }
      else
        format.html { render :edit, status: :unprocessable_content }
        format.json { render json: @post.errors, status: :unprocessable_content }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post.destroy!

    respond_to do |format|
      format.html { redirect_to posts_url, status: :see_other }
      format.json { head :no_content }
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    permitted = params.expect(post: [:title, :body, :published, :post_type])
    permitted[:post_type] = valid_post_type(permitted[:post_type]) if permitted.key?(:post_type)
    permitted
  end

  def valid_post_type(value)
    Post.post_types.key?(value.to_s) ? value.to_s : "story"
  end

  # IDs of posts the visitor has already read, kept in a JSON cookie.
  def read_ids
    Array(ActiveSupport::JSON.decode(cookies[:ids].presence || "[]")).map(&:to_i)
  rescue JSON::ParserError
    []
  end

  def filtered_posts
    scope = params[:read].present? ? Post.in_group(read_ids) : Post.not_in_group(read_ids)
    scope.shuffled(shuffle_seed).paginate(page: params[:page])
  end

  # A fresh shuffle every time the first page is loaded; later pages (infinite
  # scroll) reuse the seed from the session so the order stays consistent.
  def shuffle_seed
    first_page = params[:page].blank? || params[:page].to_i <= 1
    session[:shuffle_seed] = SecureRandom.hex(8) if first_page || session[:shuffle_seed].blank?
    session[:shuffle_seed]
  end
end
