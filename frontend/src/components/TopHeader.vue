<!--
  Copyright (c) 2019

  Top Header component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @version 1.0
 -->

<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
	<b-navbar-brand><img src="../assets/logo_rect.png" class="logo"></b-navbar-brand>
	<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
	<b-collapse id="nav-collapse" is-nav>

	  <!-- Right aligned nav items -->

	  <b-navbar-nav class="ml-auto">
		<b-nav-item><router-link class="regular" to="/" exact>{{$t('maps')}}</router-link></b-nav-item>
		<b-nav-item><router-link class="regular" to="/forecast">{{$t('forecasts')}}</router-link></b-nav-item>
		<b-nav-item><router-link class="regular" to="/meteomap">{{$t('meteomap')}}</router-link></b-nav-item>
		<b-nav-item><router-link class="regular" to="/about">{{$t('about')}}</router-link></b-nav-item>
		<b-nav-item><router-link class="regular" to="/terms">{{$t('terms of use')}}</router-link></b-nav-item>
		<LanguageSwitcher></LanguageSwitcher>
	  </b-navbar-nav>
	</b-collapse>
  </b-navbar>
</div>
</template>

<script type = "text/javascript" >
import Vue from 'vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

export default {
	components: {
		LanguageSwitcher
	}
}
</script>

<style>
.logo {
    height: 50px;
}

.regular {
	color: #42b983;
}

.regular:hover {
	color: yellow;
	text-decoration: none;
}

.router-link-active, .router-link-active:hover {
    /*text-decoration: underline;*/
	text-decoration: none;
    font-weight: bold;
	color: white;
}

*:focus {
	outline: none;
}
</style>
