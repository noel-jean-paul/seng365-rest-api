<template>
  <b-container>

    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group label="Given Name">
        <b-form-input v-model="givenName"
                         trim
                         placeholder="Given Name"
                         required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Family Name">
        <b-form-input v-model="familyName"
                      trim
                      placeholder="Family Name"
                      required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="New Password">
        <b-form-input v-model="newPassword"
                      trim
                      placeholder="New password"
                      type="password"
        ></b-form-input>
      </b-form-group>

      <b-form-group :disabled="!newPassword"
                    label="Please enter your old password"
      >
        <b-form-input v-model="oldPassword"
                      trim
                      placeholder="Old password"
                      required
                      type="password"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Save</b-button>

      <div class="text-danger" v-if="formError">
        Incorrect password provided
      </div>
    </b-form>
  </b-container>
</template>

<script>
  import authUtils from '../utils/authUtils';

	export default {
    name: "EditProfile",

    props: {
      user: Object
    },

    data() {
      return {
        givenName: this.user.givenName,
        familyName: this.user.familyName,
        newPassword: '',
        oldPassword: '',
        formError: false
      }
    },

    methods: {
      onSubmit() {
        this.formError = false;

        if (this.newPassword) {
          // try to log in to validate password
          this.axios.post(`${this.$baseUrl}/users/login`, {
            username: this.user.username,
            password: this.oldPassword
          })
            .then((response) => {
              authUtils.setCookie(this, response.data.userId, response.data.token);
            })

            .then(() => {
              this.saveProfile();
            })

            .catch((error) => {
              // 400 response
              console.log(error);
              this.formError = true;
            });
        } else {
          this.saveProfile();
        }
      },

      saveProfile() {
        const data = {
          givenName: this.givenName,
          familyName: this.familyName
        };

        if (this.newPassword) {
          data.password = this.newPassword;
        }

        this.axios({
          method: 'patch',
          url: `${this.$baseUrl}/users/${this.$route.params.userId}`,
          data: data,
          headers: {
            'X-Authorization': authUtils.getCookie(this)
          }
        })
          .then(() => {
            this.$emit('close-reload');
          });
      }
    }
  }
</script>

<style scoped>

</style>
