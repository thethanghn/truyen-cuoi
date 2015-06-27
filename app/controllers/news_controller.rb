class NewsController < ApplicationController
  def index
  end

  def show
    url = params[:url]

    html = parseUrl(url)

    render json: { html: html.to_s }
  end

  private

  def parseUrl(url)
    response = Faraday.get url
    page = Nokogiri::HTML(response.body)

    if url.include?('vnexpress.net')
      html = page.css('.block_col_480')
      unless html.present?
        html = page.css('.block_col_680')
      end
    elsif url.include?('dantri.com')
      html = page.css('#ctl00_IDContent_Tin_Chi_Tiet')
    elsif url.include?('www.football365.com/')
      html = page.css('.base-content .base-layout-a .col1')
    end
    html
  end

end