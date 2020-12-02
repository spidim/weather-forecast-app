<!--
  Copyright (c) 2019

  Main App File

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @author Georgios Traianos <gtraiano@gmail.com>
  @version 1.0
 -->

<template>
  <div id="app">

      <TopHeader/>
        <router-view></router-view>
  </div>
</template>

<script>
import TopHeader from './components/TopHeader.vue';

export default {
	name: 'app',

	components: {
		TopHeader,
	},

	data () {
		return {
			msg: 'Welcome to Weather Forecast App',
			counter: 1,
			max: 10,
		}
	}
}
</script>

<style>
/* host fonts locally (used https://google-webfonts-helper.herokuapp.com/fonts) */
/* roboto-regular - greek_latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto'), local('Roboto-Regular'),
       url('./assets/fonts/roboto-v20-greek_latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('./assets/fonts/roboto-v20-greek_latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

/* roboto-700 - greek_latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Bold'), local('Roboto-Bold'),
       url('./assets/fonts/roboto-v20-greek_latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('./assets/fonts/roboto-v20-greek_latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

/* roboto-mono-regular - greek_latin */
@font-face {
  font-family: 'Roboto Mono';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Mono'), local('RobotoMono-Regular'),
       url('./assets/fonts/roboto-mono-v7-greek_latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('./assets/fonts/roboto-mono-v7-greek_latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

/* roboto-mono-700 - greek_latin */
@font-face {
  font-family: 'Roboto Mono';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Mono Bold'), local('RobotoMono-Bold'),
       url('./assets/fonts/roboto-mono-v7-greek_latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('./assets/fonts/roboto-mono-v7-greek_latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

#app {
  /*font-family: Helvetica, Arial, sans-serif;*/
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 6px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.topinfo {
    background-color: gray;
    margin-top: 3%;
}
</style>
