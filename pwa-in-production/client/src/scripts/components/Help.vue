<template>
  <div id="help" class="help">
    <aside id="help-dialog"
      class="mdc-dialog"
      role="alertdialog"
      aria-labelledby="my-mdc-dialog-label"
      aria-describedby="my-mdc-dialog-description"
      data-mdc-auto-init="MDCDialog">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">
            How can we help you?
          </h2>
        </header>
        <section id="my-mdc-dialog-description" class="mdc-dialog__body">
          <ul class="mdc-list mdc-list--two-line" aria-orientation="vertical">
            <li class="mdc-list-item mdc-ripple-upgraded mdc-ripple-upgraded--foreground-activation">
              <span class="mdc-list-item__text">
                <span class="mdc-list-item__primary-text">Sign in/Sign up</span>
                <span class="mdc-list-item__secondary-text">You can login from a computer, phone or tablet. </span>
              </span>
              <span class="mdc-list-item__meta material-icons" aria-hidden="true">info</span>
            </li>
            <li class="mdc-list-item mdc-ripple-upgraded mdc-ripple-upgraded--foreground-activation">
              <span class="mdc-list-item__text">
                <span class="mdc-list-item__primary-text">Fix a problem or send us feedback</span>
                <span class="mdc-list-item__secondary-text">We’re always looking for ways to improve App and would love to hear from you. </span>
              </span>
              <span class="mdc-list-item__meta material-icons" aria-hidden="true">info</span>
            </li>
          </ul>
        </section>
        <footer class="mdc-dialog__footer">
          <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">Ok</button>
        </footer>
      </div>
      <div class="mdc-dialog__backdrop"></div>
    </aside>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    methods: {

    },
    created() {

    },
    mounted() {
      window.mdcAutoInit(document.getElementById('help'), () => {});
    }
  };
</script>
