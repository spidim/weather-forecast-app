/*
  Copyright (c) 2019-2020

  Control buttons component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @author Georgios Traianos <gtraiano@gmail.com>
  @version 1.0

*/

import store from './'
/*
  chartData Schema
  ----------------
  chartData = [
  	{
		city.name,
		city.id,
		variables: {
			temperature: [values],
			humidity: [values],
			pressure: [values]
		}
  	},
  	...
  ]
*/

const forecastVariables = source => {
/* returns a list of plot variables */
    let variables = source.forecastInfo
    delete variables.overall
    return Object.keys(variables)
}

const generateData = (state, source) => {
/* returns plot data for all cities */
	if (source && source.length) {
		let chartData = []
		let labels = []
		let data = []
		let dt = Date.now()

		return source.map(city => {
			chartData = []

			forecastVariables(city).forEach(variable => {
				labels = []
				data = []

				city.forecastInfo[variable].hourlyForecast.map((entry, index) => {
					labels.push(dt + (index*3600000)); // where to get actual dt from?
        			data.push(entry);
				})
				chartData[variable] = {
					locale: store.i18n.locale,
		    		variable: store.i18n.t(variable), // pass selected variable name
		    		labels: labels,
		    		title: city.translatedName,
		    		datasets: [{
		           		fill: false,
		           		tension: 0,
		           		borderColor: "#80b6f4", // if more than one datasets, color should be set randomly or left to chart.js to decide
		           		label: city.translatedName,
		           		data: data
		        	}]
				}
			})

			return {
				name: city.name,
				id: city.id,
				variables: chartData
			}
		})
	}
	else {
	  return {}
	}
}

const state = () => ({
	chartData: []
})

const getters = {
	getChartData: state => state.chartData,
	getLocale: state => state.locale
}

const mutations = {
	generateChartData: (state, source) => {
		state.chartData = generateData(state, source)
	},

	setLocale: (state, locale) => {
		state.locale = locale
    }
}

const actions = {
	generateChartData: (context, source) => {
		context.commit('generateChartData', source)
	},

	setLocale: ({ commit }, locale) => {
    	commit('setLocale', locale)
    }
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}