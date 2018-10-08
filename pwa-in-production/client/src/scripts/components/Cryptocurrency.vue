<template>
  <div id="cryptocurrency" class="cryptocurrency">
    <div v-if="message !== ''">
      <strong class="red-text">{{ message }}</strong>
    </div>
    <table v-show="isFetching" width="100%" class="mdc-table grey-text mdc-shadow--2dp mdc-table-responsive mdc-table-loading">
      <thead>
        <tr>
          <th class="mdc-table__cell--numeric"><div class='text-input__loading--line'></div></th>
          <th class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></th>
          <th class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></th>
          <th class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></th>
          <th class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></th>
          <th class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></th>
          <th class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></th>
          <th class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="mdc-table__cell--numeric"><div class='text-input__loading--line'></div></td>
          <td class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></td>
          <td class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></td>
          <td class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></td>
          <td class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></td>
          <td class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></td>
          <td class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></td>
          <td class="mdc-table__cell--non-numeric"><div class='text-input__loading--line'></div></td>
        </tr>
      </tbody>
    </table>
    <table v-show="!isFetching && message === ''" width="100%" class="mdc-table grey-text mdc-shadow--2dp mdc-table-responsive">
      <thead>
        <tr>
          <th class="mdc-table__cell--numeric">#</th>
          <th class="mdc-table__cell--non-numeric">Cryptocurrency</th>
          <th class="mdc-table__cell--non-numeric">Market</th>
          <th class="mdc-table__cell--non-numeric">Price</th>
          <th class="mdc-table__cell--non-numeric">Volume (24h)</th>
          <th class="mdc-table__cell--non-numeric">Circulating Supply</th>
          <th class="mdc-table__cell--non-numeric">Change (24h)</th>
          <th class="mdc-table__cell--non-numeric">Price Graph (7d)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cryptocurrencies" :key="index">
          <td class="mdc-table__cell--numeric"> {{ index + 1 }}</td>
          <td class="mdc-table__cell--non-numeric">
            <img class="cryptocurrency-symbol" :src="'img/cryptocurrencies/' + item.symbol + '.png'">
            <span>{{ item.name }}</span>
          </td>
          <td class="mdc-table__cell--non-numeric">{{ item.market_cap | format }}</td>
          <td class="mdc-table__cell--non-numeric">{{ item.price | format }}</td>
          <td class="mdc-table__cell--non-numeric">{{ item.volume | format }}</td>
          <td class="mdc-table__cell--non-numeric">{{ item.circulating_supply | format }}</td>
          <td class="mdc-table__cell--non-numeric">{{ item.change | format }}</td>
          <td class="mdc-table__cell--non-numeric">
            <img :src="'img/cryptocurrencies/' + item.symbol + '-price-graph.png'">
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import numeral from 'numeral';
  import db from '../db';

  export default {
    data() {
      return {
        isFetching: true,
        message: '',
        cryptocurrencies: []
      };
    },
    filters: {
      format: function(value) {
        return numeral(value).format('0,0.[00]');
      }
    },
    created() {
      this.api.cryptocurrencies()
        .then((response) => {
          if (response.code === this.httpStatus.OK) {
            this.cryptocurrencies = response.data.cryptocurrencies;
            this.cryptocurrencies.length && db.cryptocurrencies.clear().then((result) => {
              db.cryptocurrencies.bulkAdd(this.cryptocurrencies);
            })
          }
          this.message = response.message;
        })
        .catch((error) => {
          this.message = error.message;
        })
        .then(() => {
          this.isFetching = false;
        });
    },
    mounted() {
      window.mdcAutoInit(document.getElementById('cryptocurrency'), () => {});
    }
  };
</script>
