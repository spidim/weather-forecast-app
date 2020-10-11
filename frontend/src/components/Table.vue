<template>
<b-table v-if="tableData && tableData.length"
    striped hover borderless sticky-header
    :style="tableStyle"
    small head-variant="light"
    :items="tableItems"
    :fields="tableFields"
    @sort-changed="sortingChanged"
    id="table"
>
    <template v-slot:[translateTableKey()]="data">
        <!-- clickable city name to load plot -->
        <a href="" 
        	v-on:click.prevent="selectedRowUpdate(data.index, data.value);"
        >
            <!-- no city selected, render all without formatting -->
            <span v-if="selectedRow === -1">
                {{ data.value }}
            </span>
            <!-- city selected, make selected city name bold -->
            <strong v-else-if="data.value === tableData[selectedRow].name ||
                reverseTranslationFunction(data.value) === tableData[selectedRow].name"
            >
                {{ data.value }}
            </strong>
            <!-- city selected, render not selected city names without formatting -->
            <span v-else>
                {{ data.value }}
            </span>
        </a>
    </template>
</b-table>
</template>

<script>
export default {
	name: 'Table',

	props: {
		tableData: {
			type: Array,
			required: true
		},

		tableItems: {
			type: Array,
			required: true
		},

		tableFields: {
			type: Array,
			required: true
		},

		selectedRow: {
			type: Number,
			required: false,
			default: -1
		},

		tableStyle: {
			type: Object,
			required: false
		},

		reverseTranslationFunction: {
			type: Function,
			required: false,
			default: function(name) {
				return name;
			}
		}
	},

	methods: {
		sortingChanged(ctx) {
      		// ctx.sortBy   ==> Field key for sorting by (or null for no sorting)
      		// ctx.sortDesc ==> true if sorting descending, false otherwise
      		this.$emit('sortingChanged', ctx.sortDesc);
    	},

		selectedRowUpdate(index, value) {
			this.$emit('selectedRowUpdate', index, value);
		},

		translateTableKey() { // to overcome dynamic argument expression constraints (https://vuejs.org/v2/guide/syntax.html#Dynamic-Argument-Expression-Constraints)
          // tried passing an argument to the function too, it works but gives a warning
          	return `cell(${this.$t('city')})`;
      	},

		scrollToRow(index) {
          	let table = this.$el.querySelector("#table");
          	table.parentElement.style.height = this.selectedRow === -1 ? '25vh' : '70vh'; // must find way to get updated height
          	table.parentElement.scrollTop = table.rows[0].clientHeight * index + table.tHead.clientHeight < table.parentElement.clientHeight ? 0 : table.rows[0].clientHeight * index;
      }
	}
}
</script>