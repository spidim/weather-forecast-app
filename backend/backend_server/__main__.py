#!/usr/bin/env python3

import connexion
import sys, os

from backend_server import encoder
from flask_cors import CORS

def main():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Weather Forecast API'})
    try:
        os.environ['OW_USER_TOKEN']
    except KeyError as e:
        print("The OW_USER_TOKEN environment variable is not set."+
                " Please set it in the environment and try again", file=sys.stderr)
        raise RuntimeError('The OW_USER_TOKEN environment variable is required')
    try:
        os.environ['MONGO_URI']
    except KeyError as e:
        print("The MONGO_URI environment variable is not set."+
                " Please set it in the environment and try again", file=sys.stderr)
        raise RuntimeError('The MONGO_URI environment variable is required')
    CORS(app.app)
    app.run(port=8080)


if __name__ == '__main__':
    main()
