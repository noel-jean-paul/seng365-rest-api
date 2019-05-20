<template>
  <div>
    <b-button @click="showModal = !showModal">Add New Venue</b-button>

    <b-modal v-model="showModal"
             title="Create new venue"
             hide-footer
    >
      <b-container>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "CreateVenue",

    data() {
      return {
        showModal: false
      }
    },
  }
</script>

<style scoped>

</style>
