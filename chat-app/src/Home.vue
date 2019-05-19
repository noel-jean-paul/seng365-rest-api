<template>
  <div>

    <b-form class="mt-2 ml-2" @submit.stop.prevent="onSubmit">
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

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-form-invalid-feedback :state="uniquenessValidation">
        Email or username is already in use
      </b-form-invalid-feedback>
    </b-form>
  </div>
</template>

<script>
  export default {
    name: "Home",

    data() {
      return {
        fName: '',
        lName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        duplicateEmail: false
      }
    },

    methods: {
      onSubmit() {
        this.duplicateEmail = false;

        if (this.submissionValid()) {
          console.log('form submitted');
          this.createUser()
            .then((response) => {
              console.log('user created', response);
            })
            .catch(() => {
              // 400 returned
              console.log('400: duplicate email or username');
              this.duplicateEmail = true;
            });
        } else {
          console.log('errors');
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

        console.log(validationResults);
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
      uniquenessValidation() {
        return !this.duplicateEmail;  // fail validation if email/username duplicate
      },

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
