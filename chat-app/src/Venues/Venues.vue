<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <b-container>
      <b-row>
        <b-col cols="3">
          <b-button class="mt-2" @click="showCreateModal = !showCreateModal"
                    variant="primary"
                    v-if="$cookies.isKey('token')"
          >
            Add New Venue</b-button>

          <div class="mt-4">

            <b-form-group label="Venue Name" label-class="font-weight-bold">
              <b-form-input v-model="searchString"
                            placeholder="Enter venue name"
                            v-on:change="onSearchChange"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="City" label-class="font-weight-bold">
              <b-form-radio v-for="city of cities"
                            v-model="selectedCity"
                            :value="city"
                            :key="city"
                            v-on:change="onCityChange"
              >
                {{ city }}
              </b-form-radio>
            </b-form-group>

            <b-form-group label="Admin" label-class="font-weight-bold">
              <b-form-checkbox v-model="adminOnly"
                               v-on:change="onAdminChange"
                               v-if="$cookies.isKey('token')"
              >
                Show only my venues
              </b-form-checkbox>
            </b-form-group>

            <b-form-group label="Category" class="mt-2" label-class="font-weight-bold">
              <b-form-radio v-for="category of categories"
                            v-model="selectedCategory"
                            :value="category.categoryId"
                            :key="category.categoryId"
                            v-on:change="onCategoryChange"
              >
                {{ category.categoryName }}
              </b-form-radio>
            </b-form-group>

            <b-form-group label="Sort By" class="mt-2" label-class="font-weight-bold">
              <b-form-radio v-for="direction of dirOptions"
                            v-model="selectedDir"
                            :value="direction.value"
                            :key="direction.value"
                            v-on:change="onSortByChange"
              >
                {{ direction.title }}
              </b-form-radio>
            </b-form-group>

            <b-form-group :label="`Min Star Rating: ${minStarRating}`"  label-class="font-weight-bold">
              <b-form-input v-model="minStarRating"
                            v-on:change="onMinStarRatingChange"
                            min=1
                            max=5
                            type="range"
              ></b-form-input>
              <div >0 = poor quality, 5 = amazing</div>
            </b-form-group>

            <b-form-group class="mt-4" :label="`Max Cost Rating: ${maxCostRating}`"
                          label-class="font-weight-bold">

              <b-form-input v-model="maxCostRating"
                            v-on:change="onMaxCostRatingChange"
                            min=0
                            max=4
                            type="range"
              ></b-form-input>
              <div >0 = free, 4 = expensive</div>
            </b-form-group>

          </div>

          <b-modal v-model="showCreateModal"
                   title="Create new venue"
                   hide-footer
          >
            <CreateVenue @close-reload="onVenueCreated"/>
          </b-modal>

        </b-col>

        <b-col cols="9">
          <b-row v-for="venue of venues" class="mt-3" :key="venue.venue_id">
            <VenueCard :venue="venue"> </VenueCard>
          </b-row>
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>

<script>
  import VenueCard from './VenueCard';
  import CreateVenue from './CreateVenue';
  import authUtils from '../utils/authUtils';

  export default {
    name: "Venues",

    components: {
      VenueCard,
      CreateVenue
    },

    data() {
      return {
        error: '',
        errorFlag: false,
        venues: [],
        cities: ['All cities'],
        selectedCity: 'All cities',
        adminOnly: false,
        selectedCategory: 'all',
        categories: [
          { categoryName: 'All', categpryId: 'all' }
        ],
        showCreateModal: false,

        searchString: '',

        dirOptions: [
          { value: 'starHigh',
            reverse: false,
            sortBy: 'STAR_RATING',
            title: 'StarRating: Highest to Lowest'
          },
          { value: 'starLow',
            reverse: true,
            sortBy: 'STAR_RATING',
            title: 'StarRating: Lowest to Highest'
          },
          { value: 'costLow',
            reverse: true,
            sortBy: 'COST_RATING',
            title: 'CostRating: Highest to Lowest'
          },
          { value: 'costHigh',
            reverse: false,
            sortBy: 'COST_RATING',
            title: 'CostRating: Lowest to Highest'
          },
          {
            value: 'distClose',
            reverse: false,
            sortBy: 'DISTANCE',
            title: 'Distance: Closest to furthest',
          },
          {
            value: 'distFar',
            reverse: true,
            sortBy: 'DISTANCE',
            title: 'Distance: Furthest to closest',
          },
        ],
        selectedDir: null,
        myLatitude: null,
        myLongitude: null,

        minStarRating: 1,
        maxCostRating: 4
      }
    },

    mounted: function() {
      this.selectedDir = this.dirOptions[0].value;
      this.refreshData();
    },

    methods: {
      onVenueCreated() {
        this.showCreateModal = false;
        this.refreshData();
      },

      refreshData() {
        return Promise.all([
          this.getVenueData(),
          this.getCities()
        ]);
      },

      getVenueData: function(city) {
        return Promise.all([
          this.getVenues(city),
          this.getCategories()
        ])
          .then((result) => {
            let venues = result[0];
            const categories = result[1];

            // setup data
            for (const venue of venues) {
              if (!venue.meanStarRating) {
                venue.meanStarRating = 3;
              }

              for (const category of categories) {
                if (venue.categoryId === category.categoryId) {
                  venue.categoryName = category.categoryName;
                }
              }
            }

            this.venues = venues;   // replace array to trigger dom update
          });
      },

      getVenues: function(city) {
        let params = '?';
        if (city !== undefined && city !== "All cities") {
          params += `city=${city}&`;
        }

        if (this.adminOnly) {
          params += `adminId=${authUtils.getAuthedUserId(this)}&`;
        }

        if (this.selectedCategory !== 'all') {
          params += `categoryId=${this.selectedCategory}&`;
        }

        if (this.searchString !== '') {
          params += `q=${this.searchString}&`;
        }

        // sort by
        const option = this.dirOptions.find((option) => { return option.value === this.selectedDir });
        params += `sortBy=${option.sortBy}&reverseSort=${option.reverse}&`;

        // distance
        if (option.sortBy === 'DISTANCE') {
          console.log(this.myLatitude, this.myLongitude);
          params += `myLatitude=${this.myLatitude}&myLongitude=${this.myLongitude}&`;
        }

        // min star rating
        params += `minStarRating=${this.minStarRating}&`;

        // max cost rating
        params += `maxCostRating=${this.maxCostRating}&`;


        return this.axios.get(`${this.$baseUrl}/venues${params}`)
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getCategories: function() {
        return this.axios.get(this.$baseUrl + '/categories')
          .then((res) => {
            this.categories = [{ categoryName: 'All', categoryId: 'all' }].concat(res.data);
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getCities: function() {
        // how to deeep copy JSON.parse(JSON.stringify(this.cities))

        return this.getVenues()
          .then((venues) => {
            let tmpCities = [].concat(this.cities);

            for (const venue of venues) {
              if (!tmpCities.includes(venue.city)) {
                tmpCities.push(venue.city);
              }
            }

            this.cities = tmpCities;
          })
      },

      onCityChange: function(selected) {
        this.getVenueData(selected)
          .then(() => {
            this.selectedCity = selected;
          });
      },

      onAdminChange: function(checked) {
        this.adminOnly = checked;
        this.getVenueData(this.selectedCity)
      },

      onCategoryChange(selected) {
        this.selectedCategory = selected;
        this.getVenueData(this.selectedCity)
      },

      onSearchChange(string) {
        this.searchString = string;
        this.getVenueData(this.selectedCity);
      },

      onSortByChange(value) {
        if (value === 'distClose' || value === 'distFar') {
          this.getLocation()
            .then(() => {
              this.selectedDir = value;
              this.getVenueData(this.selectedCity);
            });
        } else {
          this.selectedDir = value;
          this.getVenueData(this.selectedCity);
        }
      },

      onMinStarRatingChange(rating) {
        this.minStarRating = rating;
        this.getVenueData(this.selectedCity);
      },

      onMaxCostRatingChange(rating) {
        this.maxCostRating = rating;
        this.getVenueData(this.selectedCity);
      },

      getLocation() {
        console.log('nav', navigator);
        return new Promise(resolve => {
          navigator.geolocation.getCurrentPosition((position) =>
            this.setPosition(position, resolve));
        }, reject => {

        });
      },

      setPosition(position, resolve) {
        console.log(position.coords);
        this.myLatitude = position.coords.latitude;
        this.myLongitude = position.coords.longitude;
        resolve();

        console.log(this.myLatitude, this.myLongitude);
      }
    }
  }
</script>

<style scoped>

</style>
