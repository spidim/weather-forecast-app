# Weather Forecast Application

## Overview

## Requirements
Docker

## Running with Docker

Build the containers and run the app with docker-compose

```
docker-compose build
docker-compose up

```

The application frontend will be accessible at http://localhost

## Copyright - Spiros Dimopoulos <sdimopoulos@irisweb.gr>

## Sub-components

### Frontend

The frontend is based on the Vue.js framework.
It uses the Openstreetmap mapping API.
Also the JS backend swagger client generated with codegen for API access

```
VUE_APP_BACKEND_BASE_URL
VUE_APP_API_KEY
```

Docker build is performed in 2 stages, first the npm build and then nginx.

### Backend

The backend is based on Connexion running over Flask.
Uses pymongo to connect to the database.
For meteorological data, uses OpenWeather API (needs registration)

Required environment variables at frontend/.env

```
- OW_USER_TOKEN
- MONGO_URI
```

Required environment variables at ./.env

```
- MONGO_USER
- MONGO_PASS
```

### Backend JS swagger client

Generated from the OpenAPI definition file found in definitions sub-dir.
Seamlessly connects the frontend to the backend

### MongoDB

Mongo DB is used by the backend to store/cache data. Data storage at Mongo is
ephemeral and is not retained between restarts. First request is slow because
it initializes the cache, but then subsequent requests are very fast.

### License - Proprietary
Copyright - Spiros Dimopoulos <sdimopoulos@irisweb.gr>
Co-author - Georgios Traianos <gtraiano@gmail.com>
It is provided as is without any guarantee for demonstration purposes solely.
Not to be redistributed in any form, copied or sold. 
