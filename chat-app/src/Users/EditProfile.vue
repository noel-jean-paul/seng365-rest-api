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

      <b-button type="submit" variant="primary">Save</b-button>
    </b-form>
  </b-container>
</template>

<script>
	export default {
		name: "EditProfile",

    props: {
		  user: Object
    },

    data() {
		  return {
		    givenName: user.givenName,
        familyName: user.familyName,
        newPassword: '',
        oldPassword: ''
      }
    }
	}
</script>

<style scoped>

</style>
