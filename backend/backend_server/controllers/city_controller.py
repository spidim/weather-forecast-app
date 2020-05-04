import connexion
import six

from backend_server.models.city import City  # noqa: E501
from backend_server.helpers.mongo_helper import MongoHelper

def get_all_city_info():  # noqa: E501
    """Get a list of all cities

    Returns all available city forecasts # noqa: E501


    :rtype: List[City]
    """

    mongo = MongoHelper()
    cities_response = mongo.get_all_city_objects()
    return cities_response

def get_city_info(cityId):  # noqa: E501
    """Find city by ID

    Returns a city&#39;s weather info # noqa: E501

    :param cityId: ID of city to return
    :type cityId: int

    :rtype: City
    """
    mongo = MongoHelper()
    city = mongo.get_city_object_by_id(cityId)
    return city
