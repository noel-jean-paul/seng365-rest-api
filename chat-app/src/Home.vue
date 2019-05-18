<template>
  <div>
    <b-form-group
      label="Given name"
      :invalid-feedback="invalidFNameFeedback"

      :state="fNameState"
    >
      <b-form-input v-model="fName" :state="fNameState" trim></b-form-input>
    </b-form-group>

    <b-form-group
      label="Family name"
      :invalid-feedback="invalidFNameFeedback"
      :state="lNameState"
    >
      <b-form-input v-model="lName" :state="lNameState" trim></b-form-input>
    </b-form-group>

    <!--<b-form-group-->
      <!--label="Email"-->
      <!--:invalid-feedback="invalidFeedback"-->

      <!--:state="state"-->
    <!--&gt;-->
      <!--<b-form-input v-model="email" :state="state" trim></b-form-input>-->
    <!--</b-form-group>-->

    <!--<b-form-group-->
      <!--label="Username"-->
      <!--:invalid-feedback="invalidFeedback"-->
      <!--:state="state"-->
    <!--&gt;-->
      <!--<b-form-input v-model="username" :state="state" trim></b-form-input>-->
    <!--</b-form-group>-->

    <!--<b-form-group-->
      <!--label="Password"-->
      <!--:invalid-feedback="invalidFeedback"-->
      <!--:state="state"-->
    <!--&gt;-->
      <!--<b-form-input v-model="password" :state="state" trim></b-form-input>-->
    <!--</b-form-group>-->
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
        password: ''
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
    }
  }
</script>

<style scoped>

</style>
