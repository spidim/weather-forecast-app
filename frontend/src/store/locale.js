/*
  Copyright (c) 2019-2020

  Control buttons component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @author Georgios Traianos <gtraiano@gmail.com>
  @version 1.0
*/

const state = () => ({
	locale: window.localStorage.getItem('locale') || 'en'
})

const getters = {
	getLocale: state => state.locale
}

const mutations = {
	setLocale: (state, locale) => {
		state.locale = locale
    }
}

const actions = {
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