<template>
  <div>
    <b-container>
      <b-card
        title="Log in"
      >

        <b-button @click="login">Log in</b-button>
        <b-button @click="showModal = !showModal">Register</b-button>
      </b-card>

    </b-container>

    <b-modal v-model="showModal"
             title="Registration Form"
             hide-footer
    >
      <b-container>
        <RegisterForm/>
      </b-container>
    </b-modal>

  </div>
</template>

<script>
  import RegisterForm from "./RegisterForm";

  export default {
    name: "Home",

    components: {
      RegisterForm
    },

    data() {
      return {
        showModal: false
      }
    },

    mounted() {
      this.$cookies.config({ expires: "7d" }) // set cookie config

      // // move off the login page if the user is already authenticated
      // if (this.$cookies.get('token')) {
      //   this.$router.push({ name: 'venues' });
      // }
    },
  }
</script>

<style scoped>

</style>
