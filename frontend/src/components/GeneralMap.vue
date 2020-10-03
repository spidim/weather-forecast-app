<template>
<l-map
    :options="{
        attributionControl: false,
        preferCanvas: true,
        wheelPxPerZoomLevel: activeCityPopup !== -1 ? Number.MAX_VALUE : 60 // prevent wheel zooming when popup is displayed
    }"
    :style="{
    	height: this.height,
    	width: this.width,
    	marginLeft: 'auto',
    	marginRight: 'auto'
    }"
    :zoom="zoom"
    :center="center"
    @update:zoom="zoomUpdated"
    @update:center="centerUpdated"
    @update:bounds="boundsUpdated"
>

    <l-tile-layer v-if="openStreet" :url="mapUrl"></l-tile-layer>
    <l-tile-layer v-if="openWeather" v-for="(url, index) in openWeatherTileUrls"
        :key="url"
        :url="url"
    ></l-tile-layer>

    <l-control-attribution
        position="bottomright"
        :prefix="`
        	${openStreet ? '<a href=https://www.openstreetmap.org/copyright>© OpenStreetMap contributors</a>' : ''}
        	${ openStreet && openWeather ? ' | ' : ''}
        	${ openWeather ? '<a href=https://openweathermap.org/>OpenWeather</a>' : ''}
        `"
    ></l-control-attribution>

    <l-control v-if="openWeather" position="topright">
        <b-dropdown right :text="$t('active layers')" class="m-0 p-0" size="sm">
            <b-dropdown-form class="m-0 p-0">
                <b-form-group>
                    <b-form-checkbox-group
                        class="text-left"
                        size="xs"
                        v-model="activeLayers"
                        :options="openWeatherOptions"
                        switches
                        stacked
                    >
                    </b-form-checkbox-group>
                </b-form-group>
            </b-dropdown-form>
        </b-dropdown>
    </l-control>
    
    <l-marker v-for="(city, index) in markerData" :key="`${city.coords.lat},${city.coords.lon}`"
        :lat-lng="[city.coords.lat,city.coords.lon]"
        :icon="l_icon(city.currWeatherIconId)"
        @popupclose="activeCityPopupUpdated(-1); resetZoom(index);"
        @popupopen="activeCityPopupUpdated(city.id)"
    >
        <l-tooltip
            :options="{
                direction: 'bottom',
                offset: [iconOptions.iconAnchor[0], iconOptions.iconAnchor[1]/2],
                opacity: activeCityPopup !== city.id ? 0.9 : 0 // hide active city popup tooltip
            }"
        >
            {{ $t(city.name.toLowerCase()) }}
        </l-tooltip>
        <l-popup
            :options="{
                'maxWidth': 'auto',
                offset: [iconOptions.iconAnchor[0], 0]
            }"
        >
            <PopupViewChart
                :chartData="plotData[index]"
                :active="activeCityPopup === city.id"
                :ref="index"
            >
            </PopupViewChart>
        </l-popup>
    </l-marker>
</l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon, LPopup, LControlAttribution, LTooltip, LControl } from 'vue2-leaflet'
import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'
import PopupViewChart from './PopupViewChart.vue'
import { mapGetters } from 'vuex'

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default {
	name: 'GeneralMap',

	components: {
        LMap,
        LTileLayer,
        LMarker,
        LIcon,
        LPopup,
        LControlAttribution,
        PopupViewChart,
        LTooltip,
        LControl
    },

    props: {
    	// map height and width for css style
    	height: {
    		type: String,
    		required: true,
    		default: '80vh'
    	},

    	width: {
    		type: String,
    		required: true,
    		default: '100%'
    	},

    	// map center, zoom and bounds
    	center: {
    		type: Object,
    		required: false,
    		default: function() {
    			return {
    				lat: 38.436111,
    				lng: 26.112442
    			}
    		}
    	},

    	zoom: {
    		type: Number,
    		required: false,
    		default: 6
    	},

    	bounds: {
    		type: Object,
    		required: false,
    		default: function() {
    			return {}
    		}
    	},

    	// map icon size scale
    	iconScale: {
            type: Number,
            required: false,
            default: 1.0
        },

    	// use OpenStreet map tiles (base map)
    	openStreet: {
    		type: Boolean,
    		required: false,
    		default: true
    	},

        // base map url
        mapUrl: {
        	type: String,
        	required: function() {
        		return typeof this.$props.openStreet !== 'undefined' && this.$props.openStreet
        	},
        	default: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        },

        // use OpenWeather map tiles
        openWeather: {
        	type: Boolean,
        	required: false,
        	default: false
        },

        // active OpenWeather map tiles
        activeOpenWeatherLayers: {
        	type: Array,
        	required: function() {
        		return typeof this.$props.openWeather !== 'undefined' && this.$props.openWeather
        	}
        },

        openWeatherOptions: {
        	type: Array,
        	required: function() {
        		return typeof this.$props.openWeather !== 'undefined' && this.$props.openWeather
        	}
        },

        // OpenWeather tiles urls
        openWeatherTileUrls: {
        	type: Array,
        	required: function() {
        		return typeof this.$props.openWeather !== 'undefined' && this.$props.openWeather
        	}
        },

        // map markers data
        markerData: {
        	type: Array,
        	required: false
        },

        // popup charts data
        plotData: {
        	type: Array,
        	required: true
        },

        activeCityPopup: {
        	type: Number,
        	required: false,
        	default: -1
        }
    },

    data() {
    	return {
    	}
    },

    methods: {
        zoomUpdated (zoom) {
          //this.zoom = zoom;
          this.$emit('zoomUpdated', zoom);
        },
        
        centerUpdated (center) {
          //this.center = center;
          this.$emit('centerUpdated', center);
        },
        
        boundsUpdated (bounds) {
          //this.bounds = bounds;
          this.$emit('boundsUpdated', bounds);
        },

        activeCityPopupUpdated (id) {
        	this.$emit('activeCityPopupUpdated', id)
        },

        activeOpenWeatherLayersUpdated (layers) {
        	this.$emit('activeOpenWeatherLayersUpdated', layers)
        },
        
        l_icon(icon) {
            return L.icon({
                iconUrl: icon,
                ...this.iconOptions
            })
        },
        
        resetZoom(cityIndex) {
            this.$refs[cityIndex][0].reset([0,1,2])
        },
        
        calculateIconOptions(scale = this.iconScale) {
            return {
                iconSize:     [Math.round(64*scale), Math.round(64*scale)], // size of the icon
                shadowSize:   [Math.round(50*scale), Math.round(64*scale)], // size of the shadow
                iconAnchor:   [Math.round(16*scale), Math.round(32*scale)], // point of the icon which will correspond to marker's location
            }
        }
    },

    created() {
    	if(this.openWeather) {
	        if(window.localStorage.getItem('activeLayers')) { // load control panel options from local storage
	            this.activeLayers = JSON.parse(window.localStorage.getItem('activeLayers'))
	        }
	        else {
	            this.activeLayers = ['temp_new', 'clouds_new'] // default options
	        }
	    }
    },

    computed: {
        iconOptions() {
            return this.calculateIconOptions()

        },

        activeLayers: {
        	/* gets and emits control box options values */
        	get: function() {
        		return this.activeOpenWeatherLayers
        	},
        	set: function(newValue) {
        		this.activeOpenWeatherLayersUpdated(newValue);
        	}
        }
    }
};
</script>

<style type="text/css" scoped>
/*
gets rid of "Will-change memory consumption is too high" warning
https://github.com/Leaflet/Leaflet/issues/4686
 */
.leaflet-fade-anim .leaflet-tile,.leaflet-zoom-anim .leaflet-zoom-animated { will-change:auto !important; }
</style>