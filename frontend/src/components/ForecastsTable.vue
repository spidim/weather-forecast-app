<template>
<b-table v-if="forecastData && forecastData.length"
    striped hover borderless sticky-header
    small head-variant="light"
    :style="tableStyle"
    :items="tableItems"
    :fields="tableFields"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
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
            <strong v-else-if="data.value === forecastData[selectedRow].name ||
                reverseTranslationFunction(data.value) === forecastData[selectedRow].name"
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
	name: 'ForecastsTable',

	props: {
		forecastData: {
			type: Array,
			required: true
		},

		tableItems: { // table rows
			type: Array,
			required: true
		},

		tableFields: { // table fields
			type: Array,
			required: true
		},

		sortBy: { // table field name to sort by
			type: String,
			required: false,
			default: null
		},

		sortDesc: { // sort direction (true: desc, false: asc, null: none)
			type: Boolean,
			required: false,
			default: null
		},

		selectedRow: {
			type: Number,
			required: false,
			default: -1
		},

		tableStyle: { // css styling for table
			type: Object,
			required: false,
			default: function() {
				return { height: '70vh' };
			}
		},

		reverseTranslationFunction: { // translates city names from el to en
			type: Function,
			required: false,
			default: function(name) {
				return name;
			}
		}
	},

	methods: {
		sortingChanged(ctx) {
      		this.$emit('sortingChanged', ctx);
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
          	table.parentElement.style.height = this.tableStyle.height;
      		if(this.selectedRow === -1) { // first scroll on table shrink
      			// do not scroll from 1st "page" if not necessary
      			table.parentElement.scrollTop = table.rows[0].clientHeight * index + table.tHead.clientHeight < table.parentElement.clientHeight ? 0 : table.rows[0].clientHeight * index;
      		}
      		else { // scroll while table shrinked
      			table.parentElement.scrollTop = table.rows[0].clientHeight * index;
      		}
      	}
	}
}
</script>