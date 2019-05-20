<template>
  <div>
    <b-container style="max-width: 540px">
      <b-card
        title="Log in"
      >
        <b-card-text>
          Enter either your email or username, and password
        </b-card-text>



        <b-form-group
          label="Email"
        >
          <b-form-input v-model="email"
                        type="email"
                        trim
                        placeholder="Email"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Username"
        >
          <b-form-input v-model="username"
                        placeholder="Username"
                        trim
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Password"
        >
          <b-form-input v-model="password"
                        placeholder="Password"
                        type="password"
                        trim
                        required
          ></b-form-input>
        </b-form-group>

        <b-button @click="login" variant="primary">Log in</b-button>
        <b-button @click="showModal = !showModal">Register</b-button>

        <div class="text-danger" v-if="badCredentials">
          Bad credentials
        </div>
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
  import authUtils from '../utils/authUtils';

  export default {
    name: "Home",

    components: {
      RegisterForm
    },

    data() {
      return {
        email: '',
        username: '',
        password: '',
        badCredentials: false,
        showModal: false
      }
    },

    mounted() {
      this.$cookies.config({ expires: "7d" }) // set cookie config

      // // move off the login page if the user is already authenticated
      if (this.$cookies.isKey('token')) {
        this.$router.push({ name: 'venues' });
      }
    },

    methods: {
      login() {
        this.axios.post(`${this.$baseUrl}/users/login`, {
          username: this.username,
          email: this.email,
          password: this.password
        })
          .then((response) => {
            authUtils.setCookie(this, response.data.userId, response.data.token);
            this.$router.push({ name: 'venues'});
          })
          .catch((response) => {
            console.log(response);
            this.badCredentials = true;
        });

      }
    }
  }
</script>

<style scoped>

</style>
