<template>
  <div id="sign-up" class="sign-up">
    <form class="sign-up-form" action="#" @submit.prevent="validateBeforeSubmit">
      <section class="sign-up-header">
        <h1>Sign Up</h1>
      </section>
      <section class="sign-up-body">
        <div v-if="message !== ''">
          <strong class="red-text">{{ message }}</strong>
        </div>
        <div class="mdc-text-field mdc-text-field--with-leading-icon name" data-mdc-auto-init="MDCTextField">
          <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">account_box</i>
          <input type="text" class="mdc-text-field__input" name="name" v-model="name" v-validate="'required'">
          <label for="my-input" class="mdc-floating-label">Name</label>
          <div class="mdc-line-ripple"></div>
        </div>
        <span v-show="errors.has('name')" class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg" aria-hidden="true">{{ errors.first('name') }}</span>
        <div class="mdc-text-field mdc-text-field--with-leading-icon email" data-mdc-auto-init="MDCTextField">
          <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">email</i>
          <input type="text" class="mdc-text-field__input" name="email" v-model="email" v-validate="'required|email'">
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
          <button type="button" class="mdc-button go-to-sign-up" v-on:click="goToSignIn">
            Sign in here
          </button>
          <button class="mdc-button mdc-button--raised button-sign-up">
            Sign Up
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<script>
  import Guard from '../guard';

  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        isSubmitting: false,
        message: ''
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
            this.api.signUp({ name: this.name, email: this.email, password: this.password })
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
      goToSignIn() {
        this.$router.push({ name: 'signIn' });
      }
    },
    mounted() {
      window.mdcAutoInit(document.getElementById('sign-up'), () => {});
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
