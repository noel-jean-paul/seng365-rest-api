<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">TravelEA</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item>
              <router-link class="custom-router-link" :to="{ name: 'home' }">Home</router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="custom-router-link" :to="{ name: 'venues' }"> Venues </router-link>
            </b-nav-item>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.custom-router-link {
  color: inherit;
}

a:hover {
  color: inherit;
}

</style>
