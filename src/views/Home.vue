<template>
  <div>
    <vue-gallery
      :images="photoSrc"
      :index="index"
      :options="galleryOptions"
      @close="index = null"/>
    <div class="kgroup">
      <img
        v-lazy="photo.thumbURL"
        v-for="(photo, idx) in photos"
        :key="photo.thumbURL"
        class="kcard"
        @click="index = idx">
    </div>
    <!-- <div
      v-lazy-container="{ selector: 'img', error: 'xxx.jpg', loading: '@/assets/loading.gif'}"
      class="kgroup">
      <img
        v-for="(photo, idx) in photos"
        :key="photo.thumbURL"
        :data-src="photo.thumbURL"
        class="kcard"
        @click.native="index = idx">
    </div> -->
    <!-- <b-card-group
      :style="{columnCount: 4, columnGap: 5 + 'px'}"
      columns>
      <b-card
        v-for="(photo, idx) in photos"
        :key="photo.id"
        :img-src="photo.thumbURL"
        :img-alt="photo.thumbURL"
        style="display: inline-block"
        class="kcard"
        header-class="kimg"
        no-body
        img-fluid

        @click="index = idx"/>
    </b-card-group> -->
    <div>
      <b-button
        v-b-modal.uploadModal=""
        variant="info"
        class="button-float"
        @click="openUploader">
        <i class="fa fa-plus"/>
      </b-button>
      <b-modal
        id="uploadModal"
        v-model="show"
        title="照片上傳">
        <div>
          <div>
            <b-form-input
              v-model="contributor"
              type="text"
              placeholder="我的名字"/>
          </div>
          <div
            id="uploadPanel"
            class="upload"/>
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
            上傳個
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
            選擇照片
          </file-upload>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<style>
  .kgroup {
    display: flex;
    align-items: left;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
    flex-flow: row wrap;
    align-content: flex-end;
  }
  .kcard {
    display: inline-block;
    display: flex;
    width: 31%;
    margin: 2px;
    object-fit: cover; /* Do not scale the image */
    object-position: top; /* Center the image within the element */
    /* margin-right: 0;
    margin-left: 0;
    margin-bottom: 8px !important; */
  }
  .kcard:before {
    padding-top: 100%;
    display: block;
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
  .spin{
    position:absolute;
    z-index:101;
    width:100%;
    height:100%;
    vertical-align: middle;
    text-align: center;
    display: table;
    top:0px;
    padding: 20px;
  }
  .upload-preview{
    position:relative;
    z-index: 100;
    padding: 3px;
    margin-left: 3px;
    margin-right: 3px;
    margin-top: 3px;
    margin-bottom: 2px;
    width: 60px;
    height: 60px;
  }
  .upload-preview-pending{
    opacity: 0.5;
  }
</style>

<script>
// @ is an alias to /src
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
      index: null,
      galleryOptions: {
        // stretchImages: 'contain',
        // Close the gallery when clicking on an empty slide area:
        closeOnSlideClick: true,
        clearSlides: true,
        // Defines if images should be stretched to fill the available space,
        // while maintaining their aspect ratio (will only be enabled for browsers
        // supporting background-size="contain", which excludes IE < 9).
        // Set to "cover", to make images cover all available space (requires
        // support for background-size="cover", which excludes IE < 9):
        stretchImages: false,
        // Toggle the controls on pressing the Return key:
        toggleControlsOnReturn: true,
        // Toggle the controls on slide click:
        toggleControlsOnSlideClick: true,
        // Toggle the automatic slideshow interval on pressing the Space key:
        toggleSlideshowOnSpace: true,
        // Navigate the gallery by pressing left and right on the keyboard:
        enableKeyboardNavigation: true,
        // Close the gallery on pressing the ESC key:
        closeOnEscape: true,
        // Close the gallery by swiping up or down:
        closeOnSwipeUpOrDown: true
      },
      show: false,
      contributor: '',
      files: []
    }
  },
  computed: {
    photoSrc () {
      return this.photos.map((item) => {
        return item.webviewURL
      })
    }
  },
  methods: {
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
        this.generateUploadImgElement(newFile)
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
        baseURL: 'https://gallery.kvnmm.com/',
        timeout: 5000
      })

      let formdata = new FormData()
      formdata.append('file', file.file)
      formdata.append('contributor', this.contributor)
      this.updateUploadImgStatus(file)

      request.post('upload', formdata,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(r => {
        this.$apollo.queries.photos.refetch()
        // this.show = false
        if (r.data === 'upload successful') {
          this.updateUploadImgCompleted(file)
        } else {
          this.updateUploadImgFailed(file)
        }
      })

      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    openUploader () {
      this.uploadCounter = 0
      this.show = true
      document.getElementById('uploadPanel').innerHTML = ''
    },
    generateUploadImgElement (fileObj) {
      var file = fileObj.file
      var id = fileObj.id
      var reader = new FileReader()
      reader.onload = (function (file, id) {
        // debugger
        return function (e) {
          document.getElementById('uploadPanel').innerHTML +=
            ['<div id="', id, '" style="display:inline-block;position:relative"><img id="img-', id, '" src="', e.target.result, '" class="upload-preview upload-preview-pending"/></div>'].join('')
        }
      })(file, id)

      reader.readAsDataURL(file, id)
    },
    updateUploadImgStatus (fileObj) {
      var file = fileObj.file
      var id = fileObj.id
      var reader = new FileReader()
      reader.onload = (function (file, id) {
        // debugger
        return function (e) {
          document.getElementById(id).innerHTML +=
            ['<div id="spin-', id, '"class="spin"><i class="fa fa-spinner fa-spin"/></div>'].join('')
        }
      })(file, id)

      reader.readAsDataURL(file, id)
    },
    updateUploadImgCompleted (fileObj) {
      var id = fileObj.id
      var imgId = ['img-', id].join('')
      document.getElementById(imgId).classList.remove('upload-preview-pending')
      var spinId = ['spin-', id].join('')
      var spin = document.getElementById(spinId)
      spin.parentNode.removeChild(spin)
    },
    updateUploadImgFailed (fileObj) {
      var id = fileObj.id
      document.getElementById(id).innerHTML +=
            ['<div id="failed-', id, '"class="spin"><i class="fas fa-ban"/></div>'].join('')
    }
  },
  apollo: {
    photos: gql`query {
          photos {
              id
              contributor
              originURL
              webviewURL
              thumbURL
              time
              masked
          }
      }`
  }
}
</script>
