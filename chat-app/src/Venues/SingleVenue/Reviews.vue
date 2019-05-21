<template>
  <div>
    <h3 class="mt-4" v-if="tableReviews.length === 0"> No reviews</h3>
    <b-table v-else stacked :items="tableReviews"></b-table>
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
