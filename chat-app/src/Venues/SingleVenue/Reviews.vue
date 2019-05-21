<template>
  <div>
    <div> Reviews</div>

    <b-table stacked :items="reviews"></b-table>
  </div>
</template>

<script>
  export default {
    name: "Reviews",

    data() {
      return {
        reviews: []
      }
    },

    mounted() {
      this.getReviews();
    },

    props: {
      venueId: String
    },

    methods: {
      getReviews() {
        this.axios.get(`${this.$baseUrl}/venues/${this.venueId}/reviews`)
          .then((reviews) => {
            let rows = [];
            for (const review of reviews.data) {
              const row = {
                review: review.reviewBody,
                star_rating: review.starRating,
                cost_rating: review.costRating,
                author: review.reviewAuthor.username,
                time_posted: review.timePosted
              };
              rows.push(row);
            }
            this.reviews = rows;
          });
      }
    }
  }
</script>

<style scoped>

</style>
