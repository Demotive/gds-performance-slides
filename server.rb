require 'rubygems'
require 'sinatra'
require 'json'
require 'rack-cache'
require 'net/http'
require 'net/https'
require 'active_support/core_ext/hash'
require 'active_support/core_ext/object'

use Rack::Cache
set :public_folder, 'public'
set :bind, '0.0.0.0'

get '/' do
  File.read(File.join('public', 'index-slider-wrapper.html'))
end

# Direct page access urls
get '/licenses' do
  File.read(File.join('public', 'licenses.html'))
end

get '/lpa' do
  File.read(File.join('public', 'lpa.html'))
end

get '/sorn' do
  File.read(File.join('public', 'sorn.html'))
end

get '/tax-disc' do
  File.read(File.join('public', 'tax-disc.html'))
end

get '/visitors-device' do
  File.read(File.join('public', 'visitors-device.html'))
end

get '/visitors-historic' do
  File.read(File.join('public', 'visitors-historic.html'))
end

get '/visitors-narrative' do
  File.read(File.join('public', 'visitors-narrative.html'))
end

get '/visitors-weekly' do
  File.read(File.join('public', 'visitors-weekly.html'))
end

#===========

# Licenses live data
get '/realtime/licenses' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/performance/licensing/api/application?group_by=licenceUrlSlug&collect=licenceName&start_at=2013-10-07T00%3A00%3A00%2B00%3A00&end_at=2013-10-14T00%3A00%3A00%2B00%3A00&limit=5&sort_by=_count%3Adescending")
  response = http.request(req)
  response.body
end

# LPA live data
get '/realtime/lpa' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/performance/lasting-power-of-attorney/api/volumes?")
  response = http.request(req)
  response.body
end

# SORN live data
get '/realtime/sorn' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/performance/sorn/api/realtime?sort_by=_timestamp%3Adescending&limit=5")
  response = http.request(req)
  response.body
end

get '/satisfaction/sorn' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/performance/vehicle-licensing/api/customer-satisfaction")
  response = http.request(req)
  response.body
end

# Tax Disc live data
get '/realtime/tax-disc' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/performance/tax-disc/api/realtime?sort_by=_timestamp%3Adescending&limit=5")
  response = http.request(req)
  response.body
end

get '/satisfaction/tax-disc' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/performance/vehicle-licensing/api/customer-satisfaction")
  response = http.request(req)
  response.body
end

# Visitors device(?)

# Historic visitors
get '/visitors-historic/content' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  req = Net::HTTP::Get.new("/performance/dashboard/unique-visitors.json")
  response = http.request(req)
  response.body
end

# Visitors narrative
get '/visitors-narrative/content' do
  cache_control :public, :max_age => 20
  http = Net::HTTP.new('www.gov.uk', 443)
  http.use_ssl = true
  #req = Net::HTTP::Get.new("/performance/dashboard/narrative.json")
  req = Net::HTTP::Get.new("/performance/dashboard/narrative")
  response = http.request(req)
  response.body
end

