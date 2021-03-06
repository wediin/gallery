<template>
  <div>
    <preview
      :images="photoSrc"
      :index="index"
      :options="galleryOptions"
      @close="index = null"/>
    <section
      class="kImgSection">
      <div
        v-for="(photo, idx) in photoObject"
        :style="photo.thumb.containerStyle"
        :key="photo.thumb.url"
        class="kImgContainer">
        <i :style="photo.thumb.placeholderStyle"/>
        <img
          v-lazy="photo.thumb.url"
          class="kImg"
          @click="index = idx">
      </div>
    </section>
    <div>
      <b-button
        variant="info"
        class="button-float"
        @click="openUploader">
        <i class="fa fa-plus"/>
      </b-button>
      <b-modal
        v-model="uploadModalShow"
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
            class="upload">
            <template v-for="photo in uploadPhotos">
              <div
                :key="photo.id"
                :id="photo.id"
                style="display:inline-block;position:relative"
              >
                <img
                  :src="photo.src"
                  :class="{
                    'upload-preview-pending': photo.status === 'pending' || photo.status === 'uploading'
                  }"
                  class="upload-preview"
                >
                <div
                  v-if="photo.status === 'uploading'"
                  class="spin"
                >
                  <i class="fa fa-spinner fa-spin" />
                </div>
                <div
                  v-if="photo.status === 'failed'"
                  class="spin"
                >
                  <i class="fas fa-ban" />
                </div>
              </div>
            </template>
          </div>
        </div>
        <div
          slot="modal-footer"
          class="w-100">
          <button
            v-if="!uploading"
            type="button"
            class="float-right btn btn-upload"
            @click.prevent="startUpload">
            <i
              class="fa fa-arrow-up"
              aria-hidden="true"/>
            上傳個
          </button>
          <button
            v-else=""
            type="button"
            class="float-right btn btn-upload"
            disabled>
            <i
              class="fa fa-stop"
              aria-hidden="true"/>
            上傳中
          </button>
          <file-upload
            ref="upload"
            :multiple="true"
            :size="1024 * 1024 * 10"
            :thread="5"
            v-model="files"
            :custom-action="uploadFile"
            :class="{
              'd-none': uploading
            }"
            style="margin-right: 10px"
            class="float-right btn btn-select"
            extensions="gif,jpg,jpeg,png,webp"
            accept="image/png,image/gif,image/jpeg,image/webp"
            @input-filter="inputFilter"
            @input-file="inputFile">
            <i class="fa fa-plus"/>
            選擇照片
          </file-upload>
          <button
            v-if="uploading"
            type="button"
            style="margin-right: 10px"
            class="float-right btn btn-select"
            disabled>
            <i class="fa fa-plus"/>
            選擇照片
          </button>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<style>
  @media screen and (min-width: 768px) {
    html {
      width: calc(100vw - 17px);
    }
  }
  .kImgSection {
    display: flex;
    flex-wrap: wrap;
  }
  .kImgSection::after {
    content: '';
    flex-grow: 999999999;
  }
  .kImgContainer {
    margin: 1px;
    position: relative;
  }
  .kImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    vertical-align: bottom;
  }
  .kImg[lazy=loaded] {
     animation: fade 1s;
  }
  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
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
  .button-float:target,
  .button-float:active,
  .button-float:focus,
  .button-float:active:focus{
    box-shadow: 2px 2px 3px #64363C !important;
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
    margin: 3px 3px 2px 3px;
    width: 60px;
    height: 60px;
  }
  .upload-preview-pending{
    opacity: 0.5;
  }

  .modal-open {
    padding-right: 0px !important;
    overflow: inherit !important;
  }
</style>

<script>
// @ is an alias to /src
import DateDiff from 'date-diff'
import gql from 'graphql-tag'
import FileUpload from 'vue-upload-component'
import axios from 'axios'
import Preview from './Preview'

export default {
  name: 'Home',
  components: {
    FileUpload,
    Preview
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
      defaultImgWidth: 200,
      uploading: false,
      uploadModalShow: false,
      contributor: '',
      files: [],
      uploadPhotos: []
    }
  },
  computed: {
    photoSrc () {
      return this.photos.map((item) => {
        return {
          url: item.webview.url,
          contributor: item.contributor
        }
      })
    },
    photoObject () {
      return this.photos.map((photo) => {
        const width = photo.thumb.width
        const height = photo.thumb.height
        photo.thumb = {
          ...photo.thumb,
          containerStyle: {
            width: width * this.defaultImgWidth / height + 'px',
            flexGrow: width * 200 / height
          },
          placeholderStyle: {
            display: 'block',
            paddingBottom: height / width * 100 + '%'
          }
        }
        return photo
      })
    }
  },
  mounted () {
    const vm = this
    const query = window.matchMedia('(min-width: 768px)')
    const listener = function (query) {
      if (query.matches) {
        vm.defaultImgWidth = 200
      } else {
        vm.defaultImgWidth = 100
      }
    }
    listener(query)
    query.addListener(listener)
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
        this.generateUploadPhotoElement(newFile)
      }
    },
    startUpload () {
      if (this.files.length === 0) {
        return
      }
      this.uploading = true
      this.$refs.upload.active = true
    },
    uploadFile (file, component) {
      const request = axios.create({
        baseURL: 'https://gallery.kvnmm.com/',
        timeout: 0
      })

      this.updateUploadPhotoStatus(file.id, 'uploading')

      let formdata = new FormData()
      formdata.append('file', file.file)
      formdata.append('contributor', this.contributor)

      request.post('upload', formdata,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(r => {
        this.$apollo.queries.photos.refetch()
        if (r.status === 200) {
          this.updateUploadPhotoStatus(file.id, 'uploaded')
          if (this.$refs.upload && this.$refs.upload.uploaded) {
            this.uploading = false
            this.uploadModalShow = false
          }
        } else {
          this.updateUploadPhotoStatus(file.id, 'failed')
        }
      })

      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    openUploader () {
      this.files = []
      this.uploadPhotos = []
      this.uploadModalShow = true
    },
    generateUploadPhotoElement (fileObj) {
      const me = this
      const reader = new FileReader()
      const file = fileObj.file
      const id = fileObj.id

      reader.addEventListener('load', () => {
        const file = event.target
        const photo = {
          id: id,
          src: file.result,
          status: 'pending'
        }
        me.uploadPhotos.push(photo)
      })

      reader.readAsDataURL(file)
    },
    updateUploadPhotoStatus (photoId, status) {
      const index = this.uploadPhotos.findIndex(photo => photo.id === photoId)
      if (index < 0) {
        return
      }
      this.uploadPhotos[index].status = status
    }
  },
  apollo: {
    photos: gql`query {
      photos {
        thumb {
          width
          height
          url
        }
        webview {
          width
          height
          url
        }
        contributor
      }
    }`
  }
}
</script>

<style lang="scss" scoped>
  .btn-upload {
    color: #FFFFFF;
    background-color: #AB3B3A;
    border-color: #AB3B3A;
  }

  .btn-upload:hover,
  .btn-upload:focus,
  .btn-upload:active,
  .btn-upload.active,
  .open .dropdown-toggle.btn-upload {
    color: #FFFFFF;
    background-color: #CB4042;
    border-color: #AB3B3A;
  }

  .btn-upload:active,
  .btn-upload.active,
  .open .dropdown-toggle.btn-upload {
    background-image: none;
  }

  .btn-upload.disabled,
  .btn-upload[disabled],
  fieldset[disabled] .btn-upload,
  .btn-upload.disabled:hover,
  .btn-upload[disabled]:hover,
  fieldset[disabled] .btn-upload:hover,
  .btn-upload.disabled:focus,
  .btn-upload[disabled]:focus,
  fieldset[disabled] .btn-upload:focus,
  .btn-upload.disabled:active,
  .btn-upload[disabled]:active,
  fieldset[disabled] .btn-upload:active,
  .btn-upload.disabled.active,
  .btn-upload[disabled].active,
  fieldset[disabled] .btn-upload.active {
    background-color: #AB3B3A;
    border-color: #AB3B3A;
  }

  .btn-upload .badge {
    color: #AB3B3A;
    background-color: #FFFFFF;
  }

  .btn-select {
    color: #FFFFFF;
    background-color: #20604F;
    border-color: #20604F;
  }

  .btn-select:hover,
  .btn-select:focus,
  .btn-select:active,
  .btn-select.active,
  .open .dropdown-toggle.btn-select {
    color: #FFFFFF;
    background-color: #00896C;
    border-color: #20604F;
  }

  .btn-select:active,
  .btn-select.active,
  .open .dropdown-toggle.btn-select {
    background-image: none;
  }

  .btn-select.disabled,
  .btn-select[disabled],
  fieldset[disabled] .btn-select,
  .btn-select.disabled:hover,
  .btn-select[disabled]:hover,
  fieldset[disabled] .btn-select:hover,
  .btn-select.disabled:focus,
  .btn-select[disabled]:focus,
  fieldset[disabled] .btn-select:focus,
  .btn-select.disabled:active,
  .btn-select[disabled]:active,
  fieldset[disabled] .btn-select:active,
  .btn-select.disabled.active,
  .btn-select[disabled].active,
  fieldset[disabled] .btn-select.active {
    background-color: #20604F;
    border-color: #20604F;
  }

  .btn-select .badge {
    color: #20604F;
    background-color: #FFFFFF;
  }
</style>
