<template>
  <div>
    <b-table stacked :items="tableReviews"></b-table>
  </div>
</template>

<script>
  export default {
    name: "Reviews",

    data() {
      return {
      }
    },

    props: {
      venueId: String,
      tableReviews: Array
    },

    methods: {
    }
  }
</script>

<style scoped>

</style>
