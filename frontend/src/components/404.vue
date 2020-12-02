<!--
  Copyright (c) 2019-2020

  Control buttons component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @author Georgios Traianos <gtraiano@gmail.com>
  @version 1.0
 -->
<template>
<b-container fluid>
	<!--b-row align-v="stretch" align-h="center">
		<h1>{{$t('404')}}</h1>
  	</b-row-->
  	<div class="row justify-content-center">
        <div class="col-12 text-center">
        	<h1>{{$t('404')}}</h1>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-12 text-center">
            <b-icon-emoji-frown scale=20 shift-v="-200%" />
        </div>
    </div>
</b-container>
</template>

<script type="text/javascript">
import { BIconEmojiFrown } from 'bootstrap-vue';
export default {
	name: 'PageNotFound',
	components: {
		BIconEmojiFrown
	}
}
</script>