<template>
  <div id="home" class="home">
    <aside class="mdc-drawer mdc-drawer--dismissible" data-mdc-auto-init="MDCDrawer">
      <div class="mdc-drawer__header" v-if="user">
        <div class="mdc-drawer__avatar">
          <img src="../../images/avatar_male.png">
        </div>
        <div class="mdc-drawer__info">
          <h3 class="mdc-drawer__title">{{ user.name }}</h3>
          <h6 class="mdc-drawer__subtitle">{{ user.email }}</h6>
        </div>
      </div>
      <div class="mdc-drawer__content">
        <nav class="mdc-list" data-mdc-auto-init="MDCList">
          <router-link to="/" exact-active-class="mdc-list-item--activated" class="mdc-list-item" aria-selected="true" alt="Market Place">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">trending_up</i>Market Place
          </router-link>
          <router-link to="/weather" exact-active-class="mdc-list-item--activated" class="mdc-list-item" aria-selected="true" alt="Weather">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">cloud</i>Weather
          </router-link>
          <hr class="mdc-list-divider">
          <router-link to="/settings" exact-active-class="mdc-list-item--activated" class="mdc-list-item" aria-selected="true" alt="Market Place">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>Settings
          </router-link>
          <a class="mdc-list-item" href="#" tabindex="-1" id="help-activation">
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">announcement</i>Help &amp; feedback
          </a>
        </nav>
      </div>
    </aside>

    <div class="mdc-drawer-app-content">
      <header class="mdc-top-app-bar app-bar">
        <div class="mdc-top-app-bar__row" id="app-bar" data-mdc-auto-init="MDCTopAppBar">
          <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <button class="material-icons mdc-top-app-bar__navigation-icon mdc-ripple-upgraded--unbounded mdc-ripple-upgraded">menu</button>
            <span class="mdc-top-app-bar__title">PWA App</span>
          </section>
          <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
            <a id="add-home" class="material-icons mdc-top-app-bar__action-item deferred-prompt" href="#">cloud_download</a>
            <router-link to="/sign-out" class="material-icons mdc-top-app-bar__action-item" aria-label="Sign out" alt="Sign out">exit_to_app</router-link>
          </section>
        </div>
      </header>
      <div id="main-content" class="main-content">
        <div class="mdc-top-app-bar--fixed-adjust"></div>
        <div style="position: relative;">
          <transition :name="transitionName">
              <router-view class="child-view"></router-view>
          </transition>
        </div>
      </div>
    </div>

    <div class="mdc-drawer-scrim"></div>

    <Help></Help>
  </div>
</template>

<script>
  import Help from './Help.vue';

  export default {
    data() {
      return {
        user: null,
        transitionName: 'slide-left'
      };
    },
    components: {
      Help
    },
    methods: {
      goToSignOut() {
        this.$router.push({ name: 'signOut' });
      }
    },
    created() {
      // Fetch the user from IndexedDB when the view is created and the data is already being observed
      this.guard.get().then((user) => {
        this.user = user;
      });
    },
    mounted() {
      window.mdcAutoInit(document.getElementById('home'), () => {});
      const list = document.querySelector('.mdc-list');
      const listLink = document.querySelectorAll('.mdc-list a');
      const drawer = document.querySelector('.mdc-drawer');
      const topAppBar = document.getElementById('app-bar');
      const helpActivation = document.getElementById('help-activation');
      const helpDialog = document.getElementById('help-dialog');
      const addToHomeScreen = document.getElementById('add-home');

      list.MDCList.wrapFocus = true;
      listLink.forEach(link => addEventListener('click', function(evt) {
        drawer.MDCDrawer.open = false;
      }));

      topAppBar.MDCTopAppBar.setScrollTarget(document.getElementById('main-content'));

      topAppBar.MDCTopAppBar.listen('MDCTopAppBar:nav', () => {
        drawer.MDCDrawer.open = !drawer.MDCDrawer.open;
      });

      helpActivation.addEventListener('click', function(evt) {
        helpDialog.MDCDialog.lastFocusedTarget = evt.target;
        helpDialog.MDCDialog.show();
      });

      console.log('Perform [Add to Home Screen] criteria checking!');
      // Listen for beforeinstallprompt
      let deferredPrompt;
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        console.log('Add to home screen criteria are met');
        // Update UI notify the user they can add to home screen
        addToHomeScreen.classList.remove('deferred-prompt');
      });

      addToHomeScreen.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addToHomeScreen.style.display = 'none';
        if (!!deferredPrompt) {
          // Show the prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice
            .then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
              } else {
                console.log('User dismissed the A2HS prompt');
              }
              deferredPrompt = null;
          });
        }
      });
    }
  };
</script>
