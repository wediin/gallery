<template>
  <b-card-group columns>
    <b-card
      title="Card title that wraps to a new line"
      img-src="https://placekitten.com/g/400/450"
      img-fluid
      img-alt="image"
      img-top>
      <p class="card-text">
        This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit
        longer.
      </p>
    </b-card>
    <b-card header="Quote">
      <blockquote class="blockquote mb-0">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
      </blockquote>
    </b-card>

    <b-card
      v-for="photo in photo"
      :title="photo.contributor"
      :key="photo.id"
      :img-src="photo.url"
      :img-alt="photo.url"
      img-fluid
      img-top>
      <p class="card-text">
        This card has supporting text below as a natural lead-in to additional content.
      </p>
      <small class="text-muted">{{ photo.createtimestamp | dateDiff }}</small>
    </b-card>
    <b-card
      bg-variant="primary"
      text-variant="white">
      <blockquote class="card-blockquote">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
        </p>
        <footer>
          <small>Someone famous in <cite title="Source Title">Source Title</cite></small>
        </footer>
      </blockquote>
    </b-card>
    <b-card title="Title">
      <p class="card-text">
        This card has supporting text below as a natural lead-in to additional content.
      </p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </b-card>
    <b-card
      img-src="https://picsum.photos/400/400/?image=41"
      img-fluid
      img-alt="image"
      overlay/>
    <b-card
      img-src="https://picsum.photos/400/200/?image=41"
      img-fluid
      img-alt="image"
      img-top>
      <p class="card-text">
        This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content
        than the first.
      </p>
      <div slot="footer">
        <small class="text-muted">Footer Text</small>
      </div>
    </b-card>
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
