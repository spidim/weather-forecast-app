import i18n from '../lang/i18n.js' // used solely for translation purposes, not included in state
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
					locale: state.locale,
		    		variable: i18n.t(variable), // pass selected variable name
		    		labels: labels,
		    		title: state.locale === 'el'
		            	? i18n.t(city.name.toLowerCase())
		            	: city.name,
		    		datasets: [{
		           		fill: false,
		           		tension: 0,
		           		borderColor: "#80b6f4", // if more than one datasets, color should be set randomly or left to chart.js to decide
		           		label: state.locale === 'el' // translate city name on label
		               		? i18n.t(city.name.toLowerCase())
		               		: city.name,
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
	chartData: [],
	locale: window.localStorage.getItem('locale') || 'en' // locale value from local storage, otherwise default to 'en'
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
    	i18n.locale = locale // set translation locale
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