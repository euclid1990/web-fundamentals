<template>
  <div id="weather" class="weather">
    <div v-if="message !== ''">
      <strong class="red-text">{{ message }}</strong>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        isFetching: true,
        message: '',
        weather: null
      };
    },
    created() {

    },
    mounted() {
      window.mdcAutoInit(document.getElementById('weather'), () => {});
    }
  };
</script>
