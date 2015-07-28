class PhotonController < ApplicationController
  skip_before_action :verify_authenticity_token

  class PhotonError < StandardError
    attr_accessor :code, :message
    def initialize(code, message)
      @code = code
      @message = message
    end

    def to_json
      {ResultCode: @code, Message: @message}
    end
  end

  rescue_from PhotonError, with: :photon_argument_errors

  def PathCreate
    Rails.logger.info params
    if params[:error].present?
      raise PhotonError.new( params[:error], "invalid argument error")
    end
    render json: { ResultCode: 0, Message: 'OK' }
  end

  private

  def photon_argument_errors(e)
    render json: e.to_json
  end
end