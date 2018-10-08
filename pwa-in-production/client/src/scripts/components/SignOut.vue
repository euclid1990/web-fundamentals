<template>
  <div v-if="message !== ''">
    <strong class="red-text">{{ message }}</strong>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: ''
      };
    },
    mounted() {
      this.api.signOut()
        .then((response) => {
          if (response.code === this.httpStatus.OK) {
            this.guard.delete().then((data) => {
              this.$router.push({ name: 'home' });
            });
          }
          this.message = response.message;
        })
        .catch((error) => {
          this.message = error.message;
        });
    }
  };
</script>
