<template>
    <b-card-group>
      <b-card v-for="photo of venue.photos"
              :key="photo.photoFilename"
              :img-src="$baseUrl + '/venues/' + venue.venueId + '/photos/' +
              photo.photoFilename"
              :img-alt="photo.photoDescription"
              />
    </b-card-group>
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
