from pymongo import MongoClient
from backend_server.helpers.openw_client import OpenWClient
from backend_server.models import City, CityCoords, ForecastInfo
from backend_server.models import ForecastInfoHumidity, ForecastInfoPressure
from backend_server.models import ForecastInfoTemperature
from backend_server import util
from backend_server import encoder
import sys, os, json

class MongoHelper:

    def __init__(self):
        """
        Initialises the MongoHelper. Creates the connection and
        loads the data in the store, if it is empty.
        """
        try:
            self.MONGO_URI = os.environ['MONGO_URI']
        except KeyError as e:
            print("The MONGO_URI environment variable is not set."+
                    " Please set it in the environment and try again", file=sys.stderr)
            raise RuntimeError('The MONGO_URI environment variable is required')
        self.client = MongoClient(self.MONGO_URI)
        self.db = self.client.weather_db
        mycollections = self.db.list_collection_names()
        if "cities" in mycollections:
            print("Cities collection is already available. We'll use the cache")
            self.city_collection = self.db['cities']
        else:
            self.city_collection = self.db['cities']
            print("Cities collection is not available. Process remote data and create it.")
            supported_cities = util.load_supported_cities_conf()
            open_w_client = OpenWClient(supported_cities)
            open_w_client.fetch_all_city_data_from_remote_api()
            all_cities_original = open_w_client.get_all_city_data()

            cities_response = []
            for city in all_cities_original:
                city_weather_info = open_w_client.parse_city_remote_data_to_weather_info(city)
                cityCoords = CityCoords(lat=city['lat'],
                                        lon=city['lon'])
                hourly_info = city_weather_info['forecast_hourly']
                forecastInfoTemp = ForecastInfoTemperature(hourly_graph_url='',
                                    hourly_forecast=hourly_info['temperature'])
                forecastInfoPress = ForecastInfoPressure(hourly_graph_url='',
                                    hourly_forecast=hourly_info['pressure'])
                forecastInfoHum = ForecastInfoHumidity(hourly_graph_url='',
                                    hourly_forecast=hourly_info['humidity'])
                forecastInfo = ForecastInfo(overall=hourly_info['weather'],
                                temperature=forecastInfoTemp,
                                humidity=forecastInfoHum,
                                pressure=forecastInfoPress)
                city = City(id=city['id'], coords=cityCoords,
                            name=city['name'],
                            curr_weather_icon_id=city_weather_info['currWeatherIconId'],
                             forecast_info=forecastInfo)
                json_encoder = encoder.JSONEncoder()
                encoded_obj = json_encoder.encode(city)
                print("Will save json ",encoded_obj)
                cities_response.append(json.loads(encoded_obj))
            res = self.city_collection.insert_many(cities_response)
            print(res.inserted_ids, sep=' ', end='n', file=sys.stdout, flush=False)

    def get_all_city_objects(self):
        """
        Returns all City objects that are currently in the store
        """
        all_cities_objects = []
        all_cities = self.city_collection.find()
        for city in all_cities:
            city_obj = util.deserialize_model(city,City)
            all_cities_objects.append(city_obj)
        return all_cities_objects

    def get_city_object_by_id(self,cityId):
        """
        Returns a City object filtered by the id
        """
        city = self.city_collection.find_one({ 'id' : cityId })
        city_obj = util.deserialize_model(city,City)
        return city_obj
