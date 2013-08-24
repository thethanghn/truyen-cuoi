class PostsController < ApplicationController
  # GET /posts
  # GET /posts.json
  def index
    read = ActiveSupport::JSON.decode(cookies[:ids] || '[]') || []
    if params[:read].present?
      @posts = Post.in_group(read).paginate(page: params[:page])
    else
      @posts = Post.not_in_group(read).paginate(page: params[:page])
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @posts }
    end
  end
  
  # GET /posts/read
  def read
    @post = Post.find(params[:id])
    read = ActiveSupport::JSON.decode(cookies[:ids] || '[]') || []
    read << @post.id unless read.include? @post.id
    cookies[:ids] = ActiveSupport::JSON.encode(read)
    respond_to do |format|
      format.json { render json: {status: 'done', data: read} }
    end
  end

  # GET /posts/1
  # GET /posts/1.json
  def show
    @post = Post.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @post }
    end
  end

  # GET /posts/new
  # GET /posts/new.json
  def new
    @post = Post.new
    @post.post_type = PostType.find(params[:post_type]) || :story

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @post }
    end
  end

  # GET /posts/1/edit
  def edit
    @post = Post.find(params[:id])
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(params[:post])
    @post.post_type = PostType.find(params[:post][:post_type]) || :story
    
    respond_to do |format|
      if @post.save
        format.html { redirect_to @post, notice: 'Post was successfully created.' }
        format.json { render json: @post, status: :created, location: @post }
      else
        format.html { render action: "new" }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /posts/1
  # PUT /posts/1.json
  def update
    @post = Post.find(params[:id])

    respond_to do |format|
      if @post.update_attributes(params[:post])
        format.html { redirect_to @post, notice: 'Post was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  def destroy
    @post = Post.find(params[:id])
    @post.destroy

    respond_to do |format|
      format.html { redirect_to posts_url }
      format.json { head :no_content }
    end
  end
end
