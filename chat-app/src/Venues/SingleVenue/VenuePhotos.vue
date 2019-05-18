<template>
  <div id="venuePhotos">
    <div v-masonry transition-duration="0.3s" item-selector=".item">
      <div v-masonry-tile class="item"
           v-for="(photo, index) of venue.photos"
           :key="index"
      >
        <img
            class='mb-2'
             :src="$baseUrl + '/venues/' + venue.venueId + '/photos/' +
              photo.photoFilename"
             :alt="photo.photoDescription"
        />
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: "VenuePhotos",

    props: {
      venue: Object
    }
  }
</script>

<style scoped>

</style>
