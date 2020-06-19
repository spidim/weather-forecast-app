<!--
  Copyright (c) 2019

  Control buttons component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @version 1.0
 -->


<template>
    <b-button-toolbar class="d-sm-inline-flex">

       <b-dropdown class="mx-1" :text="$t('variable')" size="md">
           <b-dropdown-item class="container-fluid p-0 m-0"
           @click="$emit('selected_var','temperature')">{{$t('temperature')}}</b-dropdown-item>
           <b-dropdown-item class="container-fluid p-0 m-0"
           @click="$emit('selected_var','pressure')">{{$t('pressure')}}</b-dropdown-item>
           <b-dropdown-item class="container-fluid p-0 m-0"
           @click="$emit('selected_var','humidity')">{{$t('humidity')}}</b-dropdown-item>
       </b-dropdown>
       <b-button-group class="mx-1">
           <!--<b-button @click="$emit('show-info-modal')" size="sm">{{$t('info')}}</b-button>-->
           <b-button v-b-modal="infoModalId" size="md">{{$t('info')}}</b-button>
       </b-button-group>
    </b-button-toolbar>

</template>

<script type = "text/javascript" >
export default {
    props: {
        infoModalId : {
            type: String,
            required: true,
        }
    },
    data() {
      return {
        show: false,
    }}
};
</script>
<style>
.footer {
    font-size: small;
}

div.control {
    margin-top: 5px;
}
</style>
