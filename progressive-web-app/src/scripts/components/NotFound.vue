<template>
  <div id="not-found" class="not-found">
    <div id="clouds">
      <div class="cloud x1"></div>
      <div class="cloud x1_5"></div>
      <div class="cloud x2"></div>
      <div class="cloud x3"></div>
      <div class="cloud x4"></div>
      <div class="cloud x5"></div>
    </div>
    <div class='c'>
      <div class='_404'>404</div>
      <hr>
      <div class='_1'>THE PAGE</div>
      <div class='_2'>WAS NOT FOUND</div>
       <router-link to="/" class="btn" aria-selected="true" alt="Back To Home">BACK TO HOME</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    }
  };
</script>
