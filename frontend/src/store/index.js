/*
  Copyright (c) 2019-2020

  Control buttons component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @author Georgios Traianos <gtraiano@gmail.com>
  @version 1.0
*/

import Vue from 'vue'
import Vuex from 'vuex'
import chartData from './chartData'
import allCityData from './allCityData'
import locale from './locale'
import i18n from '../lang/i18n.js'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
	modules: {
		allCityData,
		chartData,
		locale
	},
	strict: debug
});

Vue.set(store, 'i18n', i18n) // expose i18n to store as 'store.i18n'

store.watch(
	(state, getters) => getters['locale/getLocale'], // when locale changes
	() => {
		store.dispatch('allCityData/translateCityNames'); // add city names translation
		store.dispatch('chartData/generateChartData', store.getters['allCityData/getAllCityData']); // generate plot data
		if (debug) {
			console.log(`Plot data generated on ${new Date(Date.now())}`);
		}
	}
)

store.watch(
	(state, getters) => getters['allCityData/getLastFetch'], // when forecast data is fetched
	(newValue, oldValue) => {
		store.dispatch('allCityData/translateCityNames');
		store.dispatch('chartData/generateChartData', store.getters['allCityData/getAllCityData']); // generate plot data
		if (debug) {
			console.log(`City forecast data fetched on ${new Date(newValue)}`);
			console.log(`Plot data generated on ${new Date(Date.now())}`);
		}
	}
)

export default store