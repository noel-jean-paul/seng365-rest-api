<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand>
          <router-link class="custom-router-link"
                       :to="{ name: 'login' }"
          >
            TravelEA
          </router-link>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item>
              <router-link class="custom-router-link" :to="{ name: 'venues' }"> Venues </router-link>
            </b-nav-item>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template slot="button-content"><em>User</em></template>
              <b-dropdown-item href='/'>Switch user</b-dropdown-item>
              <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
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
