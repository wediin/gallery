<template>
  <div>
    <vue-gallery
      :images="photoSrc"
      :index="index"
      :options="galleryOptions"
      @close="index = null"/>
    <b-card-group
      style="column-count: 4"
      columns>
      <b-card
        v-for="(photo, idx) in photos"
        :key="photo.id"
        :img-src="photo.urls[0]"
        :img-alt="photo.urls[0]"
        style="display: inline-block"
        no-body
        img-fluid
        img-top
        @click="index = idx"/>
    </b-card-group>
  </div>
</template>

<script>
// @ is an alias to /src
import photoAPI from '@/api/photo'
import DateDiff from 'date-diff'
import VueGallery from 'vue-gallery'
import gql from 'graphql-tag'

export default {
  name: 'Home',
  components: {
    VueGallery
  },
  filters: {
    dateDiff (timestamp) {
      const from = new Date(timestamp)
      const to = new Date()
      const diff = new DateDiff(from, to)
      if (diff.years() !== 0 ||
        diff.months() !== 0 ||
        diff.days() !== 0) {
        return from.toLocaleString()
      }

      if (diff.hours() !== 0) {
        return `${diff.hours()} hours ago`
      }
      if (diff.minutes() !== 0) {
        return `${diff.minutes()} minutes ago`
      }
      if (diff.seconds() !== 0) {
        return `${diff.seconds()} seconds ago`
      }

      return ''
    }
  },
  data () {
    return {
      photos: [],
      photo: [],
      index: null,
      galleryOptions: {
        stretchImages: 'contain'
      }
    }
  },
  computed: {
    photoSrc () {
      return this.photos.map((item) => {
        return item.urls[0]
      })
    }
  },
  created () {
    this.getPhoto()
  },
  methods: {
    async getPhoto () {
      const response = await photoAPI.getPhoto()
      this.photo = response.data
    }
  },
  apollo: {
    photos: gql`query {
      photos {
        id
        contributor
        urls
        time
        masked
      }
    }`
  }
}
</script>
