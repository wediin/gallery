<template>
  <b-card-group
    style="column-count: 3"
    columns>
    <b-card
      v-for="photo in photo"
      :key="photo.id"
      :img-src="photo.urls[0]"
      :img-alt="photo.urls[0]"
      no-body
      img-fluid
      img-top/>
  </b-card-group>
</template>

<script>
// @ is an alias to /src
import photoAPI from '@/api/photo'
import DateDiff from 'date-diff'

export default {
  name: 'Home',
  components: {
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
      photo: []
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
  }
}
</script>
