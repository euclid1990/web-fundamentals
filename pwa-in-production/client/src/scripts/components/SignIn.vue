<template>
  <div id="sign-in" class="sign-in">
    <form class="sign-in-form" action="#" @submit.prevent="validateBeforeSubmit">
      <section class="sign-in-header">
        <img src="../../images/icons/puzzle.svg" width="100" height="100">
        <h1>PWA App</h1>
      </section>
      <section class="sign-in-body">
        <div v-if="message !== ''">
          <strong class="red-text">{{ message }}</strong>
        </div>
        <div class="mdc-text-field mdc-text-field--with-leading-icon email" data-mdc-auto-init="MDCTextField">
          <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">email</i>
          <input type="text" class="mdc-text-field__input" name="email" v-model="email" v-validate="'required'">
          <label for="my-input" class="mdc-floating-label">Email</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <span v-show="errors.has('email')" class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" aria-hidden="true">{{ errors.first('email') }}</span>
        <div class="mdc-text-field mdc-text-field--with-leading-icon email" data-mdc-auto-init="MDCTextField">
          <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">lock</i>
          <input type="password" class="mdc-text-field__input" name="password" autocomplete="new-password" v-model="password" v-validate="'required'">
          <label for="my-input" class="mdc-floating-label">Password</label>
          <div class="mdc-line-ripple"></div>
          <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
        </div>
        <span v-show="errors.has('password')" class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" aria-hidden="true">{{ errors.first('password') }}</span>
        <div class="button-container">
          <button type="button" class="mdc-button go-to-sign-up" v-on:click="goToSignUp">
            Sign up here
          </button>
          <button class="mdc-button mdc-button--raised button-sign-in">
            Sign In
          </button>
        </div>
      </section>
      <section class="sign-in-footer">
        <router-link to="/sign-in">Forgot Password?</router-link>
      </section>
    </form>
  </div>
</template>

<script>
  import Guard from '../guard';

  export default {
    data() {
      return {
        email: '',
        password: '',
        message: '',
        isSubmitting: false
      };
    },
    methods: {
      validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
          if (this.isSubmitting) {
            return;
          }
          if (result) {
            this.isSubmitting = true;
            this.api.signIn({ email: this.email, password: this.password })
              .then((response) => {
                if (response.code === this.httpStatus.OK) {
                  return this.guard.store(response.data.user).then((data) => {
                    this.$router.push({ name: 'home' });
                  });
                }
                this.message = response.message;
                this.addErrors(response.errors);
              })
              .catch((error) => {
                this.message = error.message;
              })
              .then(() => {
                this.isSubmitting = false;
              });
          }
        });
      },
      goToSignUp() {
        this.$router.push({ name: 'signUp' });
      }
    },
    mounted() {
      window.mdcAutoInit(document.getElementById('sign-in'), () => {});
    },
    async beforeRouteEnter(to, from, next) {
      const isAuthenticated = await Guard.isAuthenticated();
      // Redirect to home page if user authenticated
      if (isAuthenticated) {
        return next({ name: 'home' });
      }
      return next();
    }
  };
</script>
