<template>
  <div id="weather" class="weather">
    <div class="weather-search">
      <div v-if="message !== ''">
        <strong class="red-text">{{ message }}</strong>
      </div>
      <div class="weather-location">
        <h2>Location Search</h2>
        <button class="mdc-fab mdc-fab--mini" aria-label="Favorite">
          <span class="mdc-fab__icon material-icons">location_searching</span>
        </button>
      </div>
      <div class="weather-fixed-adjust"></div>
      <div class="mdc-text-field text-field mdc-text-field--outlined mdc-text-field--with-leading-icon city" data-mdc-auto-init="MDCTextField">
        <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">search</i>
        <input type="text" class="mdc-text-field__input" name="city_name" v-model="cityName" v-validate="'required'" v-on:input="onChange" v-on:keydown.down="onArrowDown" v-on:keydown.up="onArrowUp" v-on:keydown.enter="onEnter">
        <label for="tf-outlined" class="mdc-floating-label">Enter City name</label>
        <div class="mdc-notched-outline">
          <svg>
            <path class="mdc-notched-outline__path"/>
          </svg>
        </div>
        <div class="mdc-notched-outline__idle"></div>
      </div>
      <div class="autocomplete" v-show="isOpenAutocomplete">
        <div class="autocomplete-items">
          <div v-for="(c, i) in cities" :key="i" :class="{ 'autocomplete-active': i === arrowCounter }" @click="onSetCity(c)">{{ c.name }}, {{ c.country }}</div>
        </div>
      </div>
    </div>
    <div class="weather-fixed-adjust"></div>
    <div v-if="weather" class="weather-forecast">
      <div class="weather-location">{{ weather.location }}</div>
      <div class="weather-date">{{ weather.date }}</div>
      <div class="weather-description">{{ weather.description }}</div>
      <div class="weather-current">
        <div class="weather-visual">
          <div class="weather-icon" :class="'weather-icon--' + weather.current.visual">
          </div>
          <div class="weather-temperature">
            <span class="weather-value">{{ weather.current.temperature }}</span><span class="weather-scale">°C</span>
          </div>
        </div>
        <div class="weather-description">
          <div class="weather-humidity">{{ weather.current.humidity }}%</div>
          <div class="weather-wind">
            <span class="weather-value">{{ weather.current.wind.speed }}</span>
            <span class="weather-scale">mph</span>
            <span class="weather-direction">{{ weather.current.wind.direction }}</span>°
          </div>
          <div class="weather-sunrise">{{ weather.current.sunrise }}</div>
          <div class="weather-sunset">{{ weather.current.sunset }}</div>
        </div>
      </div>
      <div class="weather-future">
        <div class="weather-oneday" v-for="(item, index) in weather.future" :key="index">
          <div class="weather-date">{{ item.day }}</div>
          <div class="weather-icon" :class="'weather-icon--' + item.visual"></div>
          <div class="weather-temp-high">
            <span class="weather-value">{{ item.tempHigh }}</span>°
          </div>
          <div class="weather-temp-low">
            <span class="weather-value">{{ item.tempLow }}</span>°
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    data() {
      return {
        message: '',
        cityName: '',
        cities: [],
        city: null,
        weather: null,
        isFetching: false,
        isOpenAutocomplete: false,
        arrowCounter: -1
      };
    },
    methods: {
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.isOpen = false;
          this.arrowCounter = -1;
        }
      },
      onChange(evt) {
        if (evt.target.value) {
          this.debouncedGetCity();
        }
      },
      onArrowDown() {
        if (this.arrowCounter < this.cities.length - 1) {
          this.arrowCounter = this.arrowCounter + 1;
        }
      },
      onArrowUp() {
        if (this.arrowCounter > 0) {
          this.arrowCounter = this.arrowCounter - 1;
        }
      },
      onEnter(e) {
        if (this.arrowCounter >= 0 && this.cities.length) {
          this.city = this.cities[this.arrowCounter];
          this.cityName = this.city.name;
          this.isOpenAutocomplete = false;
          this.arrowCounter = -1;
          this.getWeather();
        }
      },
      onSetCity(c) {
        this.city = c;
        this.cityName = this.city.name;
        this.isOpenAutocomplete = false;
        this.arrowCounter = -1;
        this.getWeather();
      },
      getCity() {
        if (!this.cityName) return;

        this.message = '';
        this.isFetching = true;
        this.api.getCity(this.cityName).then((response) => {
          if (response) {
            this.cities = [].concat(response.place);
            this.isOpenAutocomplete = true;
          }
        })
        .catch((error) => {
          this.message = error.message;
        })
        .then(() => {
          this.isFetching = false;
        });
      },
      getWeather() {
        this.message = '';
        this.isFetching = true;
        this.api.getForecast(this.city.woeid).then((response) => {
          if (response) {
            let channel = response.channel;
            this.weather = {
              location: `${channel.location.city}, ${channel.location.region}, ${channel.location.country}`,
              date: channel.item.condition.date,
              description: channel.item.condition.text,
              current: {
                visual: this.getIconClass(channel.item.condition.code),
                temperature: this.fToC(channel.item.condition.temp),
                humidity: channel.atmosphere.humidity,
                wind: channel.wind,
                sunrise: channel.astronomy.sunrise,
                sunset: channel.astronomy.sunset
              },
              future: _.filter(channel.item.forecast, (v, i) => (i < 7)).map((v, i) => ({
                day: v.day,
                code: v.code,
                visual: this.getIconClass(v.code),
                tempHigh: this.fToC(v.high),
                tempLow: this.fToC(v.low)
              }))
            };
          }
        })
        .catch((error) => {
          this.message = error.message;
        })
        .then(() => {
          this.isFetching = false;
        });
      },
      getIconClass(weatherCode) {
        // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
        weatherCode = parseInt(weatherCode);
        switch (weatherCode) {
          case 25: // cold
          case 32: // sunny
          case 33: // fair (night)
          case 34: // fair (day)
          case 36: // hot
          case 3200: // not available
            return 'clear-day';
          case 0: // tornado
          case 1: // tropical storm
          case 2: // hurricane
          case 6: // mixed rain and sleet
          case 8: // freezing drizzle
          case 9: // drizzle
          case 10: // freezing rain
          case 11: // showers
          case 12: // showers
          case 17: // hail
          case 35: // mixed rain and hail
          case 40: // scattered showers
            return 'rain';
          case 3: // severe thunderstorms
          case 4: // thunderstorms
          case 37: // isolated thunderstorms
          case 38: // scattered thunderstorms
          case 39: // scattered thunderstorms (not a typo)
          case 45: // thundershowers
          case 47: // isolated thundershowers
            return 'thunderstorms';
          case 5: // mixed rain and snow
          case 7: // mixed snow and sleet
          case 13: // snow flurries
          case 14: // light snow showers
          case 16: // snow
          case 18: // sleet
          case 41: // heavy snow
          case 42: // scattered snow showers
          case 43: // heavy snow
          case 46: // snow showers
            return 'snow';
          case 15: // blowing snow
          case 19: // dust
          case 20: // foggy
          case 21: // haze
          case 22: // smoky
            return 'fog';
          case 24: // windy
          case 23: // blustery
            return 'windy';
          case 26: // cloudy
          case 27: // mostly cloudy (night)
          case 28: // mostly cloudy (day)
          case 31: // clear (night)
            return 'cloudy';
          case 29: // partly cloudy (night)
          case 30: // partly cloudy (day)
          case 44: // partly cloudy
            return 'partly-cloudy-day';
        };
      },
      fToC(fahrenheit) {
        return Math.round((+fahrenheit - 32) * 5 / 9);
      }
    },
    created() {
       this.debouncedGetCity = _.debounce(this.getCity, 500)
    },
    mounted() {
      window.mdcAutoInit(document.getElementById('weather'), () => {});
      document.addEventListener('click', this.handleClickOutside);
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside);
    }
  };
</script>
