import BackendApiHandler from '../utils/BackendApiHandler.js'
import store from './'

const state = () => ({
	allCityData: [],
	lastFetch: 0 // datetime of last data fetch
})

const getters = {
	getAllCityData: state => state.allCityData,
	getLastFetch: state => state.lastFetch
}

const actions = {
	setAllCityData: (context, data) => {
		context.commit('setAllCityData', data)
		context.commit('setLastFetch', Date.now())
	},

	setAllCityDataAsync: context => {
		const parseAllCityInfo = (error, data, response) => {
		    if (error) {
		        console.error(error);
		    } else {
		        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
		        context.commit('setAllCityData', data) // save api data to state
		        context.commit('setLastFetch', Date.now())
		    }
		}

		const initDataOnMap = () => {
		    const backendapi = new BackendApiHandler();
		    backendapi.getAllCityInfo(parseAllCityInfo);
		}

		initDataOnMap();
	},

	translateCityNames: context => {
		context.commit('translateCityNames')
	}
}

const mutations = {
	setAllCityData: (state, data) => {
		state.allCityData = data
	},

	setLastFetch: (state, datetime) => {
		state.lastFetch = datetime
	},

	translateCityNames: (state) => {
		state.allCityData = state.allCityData.map(city => {
			return {
				...city,
				translatedName: store.i18n.t(city.name.toLowerCase())
			}
		})
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}