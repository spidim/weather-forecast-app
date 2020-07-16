import Vue from 'vue'
import Vuex from 'vuex'
import chartData from './chartData'
import allCityData from './allCityData'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
	modules: {
		allCityData,
		chartData
	},
	strict: debug
});

store.watch(
	(state, getters) => getters['chartData/getLocale'], // when locale changes
	() => {
		store.dispatch('chartData/generateChartData', store.getters['allCityData/getAllCityData']); // generate plot data
		if (debug) {
			console.log(`Plot data generated on ${new Date(Date.now())}`);
		}
	}
)

store.watch(
	(state, getters) => getters['allCityData/getLastFetch'], // when forecast data is fetched
	(newValue, oldValue) => {
		store.dispatch('chartData/generateChartData', store.getters['allCityData/getAllCityData']); // generate plot data
		if (debug) {
			console.log(`City forecast data fetched on ${new Date(newValue)}`);
			console.log(`Plot data generated on ${new Date(Date.now())}`);
		}
	}
)

export default store