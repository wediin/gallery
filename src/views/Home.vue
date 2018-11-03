<template>
  <div>
    <vue-gallery
      :images="photoSrc"
      :index="index"
      :options="galleryOptions"
      @close="index = null"/>
    <b-card-group
      :style="{columnCount: 4, columnGap: 5 + 'px'}"
      columns>
      <b-card
        v-for="(photo, idx) in photos"
        :key="photo.id"
        :img-src="photo.urls[0]"
        :img-alt="photo.urls[0]"
        style="display: inline-block"
        class="kcard"
        header-class="kimg"
        no-body
        img-fluid

        @click="index = idx"/>
    </b-card-group>
    <div>
      <b-button
        v-b-modal.uploadModal=""
        variant="info"
        class="button-float"
        @click="show=true">
        <i class="fa fa-plus"/>
      </b-button>
      <b-modal
        id="uploadModal"
        v-model="show"
        title="Upload Picture">
        <div>
          <div>
            <b-form-input
              v-model="contributor"
              type="text"
              placeholder="Enter your name"/>
          </div>
          <div class="upload">
            <ul>
              <li
                v-for="file in files"
                :key="file.id"
                style="text-align: left;">
                <span>{{ file.name }}</span> -
                <span v-if="file.error">{{ file.error }}</span>
                <span v-else-if="file.success">success</span>
                <span v-else-if="file.active">active</span>
                <span v-else>pending</span>
              </li>
            </ul>
          </div>
        </div>
        <div
          slot="modal-footer"
          class="w-100">
          <button
            v-if="!$refs.upload || !$refs.upload.active"
            type="button"
            class="float-right btn btn-success"
            @click.prevent="startUpload">
            <i
              class="fa fa-arrow-up"
              aria-hidden="true"/>
            Start Upload
          </button>
          <button
            v-else=""
            type="button"
            class="float-right btn btn-danger"
            @click.prevent="$refs.upload.active = false">
            <i
              class="fa fa-stop"
              aria-hidden="true"/>
            Stop Upload
          </button>
          <file-upload
            ref="upload"
            :multiple="true"
            :size="1024 * 1024 * 10"
            v-model="files"
            :custom-action="uploadFile"
            style="margin-right: 10px"
            class="float-right btn btn-primary"
            extensions="gif,jpg,jpeg,png,webp"
            accept="image/png,image/gif,image/jpeg,image/webp"
            @input-filter="inputFilter"
            @input-file="inputFile">
            <i class="fa fa-plus"/>
            Select files
          </file-upload>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<style>
  .kcard {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 8px !important;
  }
  .kimg {
    border-top-left-radius: 2px !important;
    border-top-right-radius: 2px !important;
    border-bottom-left-radius: 2px !important;
    border-bottom-right-radius: 2px !important;
  }
  .button-float{
    position:fixed;
    width:60px;
    height:60px;
    bottom:40px;
    right:40px;
    background-color:#AB3B3A !important;
    border-color: #AB3B3A !important;
    color:#FFF;
    border-radius:50px !important;
    text-align:center;
    box-shadow: 2px 2px 3px #64363C;
  }
</style>

<script>
// @ is an alias to /src
import photoAPI from '@/api/photo'
import DateDiff from 'date-diff'
import VueGallery from 'vue-gallery'
import gql from 'graphql-tag'
import FileUpload from 'vue-upload-component'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    VueGallery,
    FileUpload
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
      },
      show: false,
      contributor: '',
      files: []
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
    },
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    },
    inputFile (newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log('add', newFile)
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile)
      }
      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile)
      }
    },
    startUpload () {
      this.$refs.upload.active = true
    },
    uploadFile (file, component) {
      const request = axios.create({
        baseURL: 'http://220.135.75.2:9527/',
        timeout: 5000
      })

      let formdata = new FormData()
      formdata.append('file', file.file)
      formdata.append('contributor', this.contributor)

      request.post('upload', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(r => {
        this.$apollo.queries.photos.refetch()
      })

      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  },
  apollo: {
    photos: {
      query: gql`query {
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
}
</script>
