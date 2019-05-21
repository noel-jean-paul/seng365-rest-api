<template>

    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group
        label="Given name"
        :invalid-feedback="invalidFNameFeedback"

        :state="fNameState"
      >
        <b-form-input v-model="fName"
                      :state="fNameState"
                      trim
                      placeholder="Given name"
                      required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        label="Family name"
        :invalid-feedback="invalidLNameFeedback"
        :state="lNameState"

      >
        <b-form-input v-model="lName"
                      :state="lNameState"
                      trim
                      placeholder="Family name"
                      required
        ></b-form-input>
      </b-form-group>


      <b-form-group
        label="Email"
        :invalid-feedback="invalidEmailFeedback"
        :state="emailState"

      >
        <b-form-input v-model="email"
                      :state="emailState"
                      type="email"
                      trim
                      placeholder="Email"
                      required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        label="Username"
        :invalid-feedback="invalidUsernameFeedback"
        :state="usernameState"

      >
        <b-form-input v-model="username"
                      :state="usernameState"
                      placeholder="Username"
                      trim
                      required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        label="Password"
        :invalid-feedback="invalidPasswordFeedback"
        :state="passwordState"

      >
        <b-form-input v-model="password"
                      :state="passwordState"
                      placeholder="Password"
                      type="password"
                      trim

        ></b-form-input>
      </b-form-group>

      <b-form-group
        label="Confirm Password"
        :invalid-feedback="invalidConfirmPasswordFeedback"
        :state="confirmPasswordState"

      >
        <b-form-input v-model="confirmPassword"
                      :state="confirmPasswordState"
                      placeholder="Confirm Password"
                      type="password"
                      trim
                      required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Register</b-button>

      <div class="text-danger" v-if="duplicateEmail">
        Email or username is already in use
      </div>

      <div class="text-danger" v-if="formError">
        Form contains errors
      </div>


    </b-form>
</template>

<script>
  import authUtils from '../utils/authUtils'

  export default {
    name: "RegisterForm",

    data() {
      return {
        fName: '',
        lName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        duplicateEmail: false,
        formError: false
      }
    },

    methods: {
      onSubmit() {
        this.duplicateEmail = false;
        this.formError = false;

        if (this.submissionValid()) {
          this.createUser()
            .then((response) => {

              // Set cookie
              authUtils.setCookie(this, response.data.userId, response.data.token);

              this.$router.push({ name: 'venues'});
            })
            .catch((error) => {
              // 400 returned
              console.log(error);
              console.log('400: duplicate email or username');
              this.duplicateEmail = true;
            });
        } else {
          this.formError = true;
        }
      },

      submissionValid() {
        const validationResults = [
          this.fNameState,
          this.lNameState,
          this.emailState,
          this.usernameState,
          this.passwordState,
          this.confirmPasswordState
        ];

        for (const result of validationResults) {
          if (!result) {
            return false;
          }
        }

        return true;
      },

      createUser() {
        return this.axios.post(`${this.$baseUrl}/users`, {
          username: this.username,
          givenName: this.fName,
          familyName: this.lName,
          email: this.email,
          password: this.password
        })
      },

      isAlphaNumeric(string) {
        return !!string.match('^[a-zA-Z0-9]*$');
      }
    },

    computed: {
      fNameState() {
        return this.fName.length >= 2;
      },

      invalidFNameFeedback() {
        if (this.fName.length < 2) {
          return 'Enter at least 2 characters'
        } else {
          return '';
        }
      },

      lNameState() {
        return this.lName.length >= 2;
      },

      invalidLNameFeedback() {
        if (this.lName.length < 2) {
          return 'Enter at least 2 characters'
        } else {
          return '';
        }
      },

      emailState() {
        return this.email.length >= 1;
      },

      invalidEmailFeedback() {
        if (this.email.length < 1) {
          return 'Please enter your email';
        } else {
          return '';
        }
      },

      usernameState() {
        if (this.username.length < 1 || this.username.length > 64) {
          return false;
        } else return this.isAlphaNumeric(this.username);
      },

      invalidUsernameFeedback() {
        if (this.username.length < 1 || this.username.length > 64) {
          return 'Username must be 1-64 characters long';
        } else if (! this.isAlphaNumeric(this.username)) {
          return 'Username must only contain letters and numbers';
        } else {
          return '';
        }
      },

      passwordState() {
        return this.password.length >= 1;
      },

      invalidPasswordFeedback() {
        if (this.password.length < 1) {
          return 'Please enter a password';
        } else {
          return '';
        }
      },

      confirmPasswordState() {
        if (this.confirmPassword.length < 1) {
          return false;
        } else return this.password === this.confirmPassword;
      },

      invalidConfirmPasswordFeedback() {
        if (this.confirmPassword.length < 1) {
          return 'Please re-enter your password';
        } else if (this.password !== this.confirmPassword) {
          return "Passwords do not match";
        } else {
          return '';
        }
      }
    }
  }
</script>

<style scoped>

</style>
