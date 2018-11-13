<template>
  <div
    :id="id"
    :class="{'blueimp-gallery-carousel': carousel}"
    class="blueimp-gallery blueimp-gallery-controls">

    <div class="slides"/>
    <h3 class="title"/>
    <p class="description"/>
    <a class="prev">
      <span id="preview-prev-btn">‹</span>
    </a>
    <a class="next">
      <span id="preview-next-btn">›</span>
    </a>
    <a
      v-if="!carousel"
      class="close">
      <span id="preview-close-btn">x</span>
    </a>
    <ol
      v-if="!carousel"
      class="indicator"/>
    <a
      v-if="carousel"
      class="play-pause"/>
  </div>
</template>

<script>
import 'blueimp-gallery/css/blueimp-gallery.min.css'
import 'blueimp-gallery/js/blueimp-gallery-fullscreen.js'
import 'blueimp-gallery/js/blueimp-gallery-video.js'
import 'blueimp-gallery/js/blueimp-gallery-youtube.js'
import blueimp from 'blueimp-gallery/js/blueimp-gallery.js'

export default {
  props: {
    images: {
      type: Array,
      default () {
        return []
      }
    },

    options: {
      type: Object,
      default () {
        return {}
      }
    },

    carousel: {
      type: Boolean,
      default: false
    },

    index: {
      type: Number,
      default: 0
    },

    id: {
      type: String,
      default: 'blueimp-gallery'
    }
  },

  data () {
    return {
      instance: null
    }
  },

  watch: {
    index (value) {
      if (this.carousel) {
        return
      }

      if (value !== null) {
        this.open(value)
      } else {
        if (this.instance) {
          this.instance.close()
        }

        this.$emit('close')
      }
    }
  },

  mounted () {
    if (this.carousel) {
      this.open()
    }
  },

  destroyed () {
    if (this.instance !== null) {
      this.instance.close()
      this.instance = null
    }
  },

  methods: {
    open (index = 0) {
      const instance = typeof blueimp.Gallery !== 'undefined' ? blueimp.Gallery : blueimp

      const options = Object.assign({
        toggleControlsOnReturn: false,
        toggleControlsOnSlideClick: false,
        closeOnSlideClick: false,
        carousel: this.carousel,
        container: `#${this.id}`,
        index,
        onopen: () => this.$emit('onopen'),
        onopened: () => this.$emit('onopened'),
        onslide: this.onSlideCustom,
        onslideend: (index, slide) => this.$emit('onslideend', { index, slide }),
        onslidecomplete: (index, slide) => this.$emit('onslidecomplete', { index, slide }),
        onclose: () => this.$emit('close'),
        onclosed: () => this.$emit('onclosed')
      }, this.options)

      if (this.carousel) {
        options.container = this.$el
      }

      this.instance = instance(this.images.map((item) => { return item.url }), options)
    },
    onSlideCustom (index, slide) {
      this.$emit('onslide', { index, slide })

      const image = this.images[index]
      if (image.url !== undefined) {
        let text = ''
        const node = this.instance.container.find('.description')
        if (image.contributor && image.contributor !== 'default') {
          text = 'By ' + image.contributor
        }
        node.empty()
        node[0].appendChild(document.createTextNode(text))
      }
    }
  }
}
</script>

<style>
  .blueimp-gallery > .description {
    position: absolute;
    top: 30px;
    left: 15px;
    color: #fff;
    display: none;
  }
  .blueimp-gallery-controls > .description {
    display: block;
  }
  #preview-prev-btn {
      color: #fff;
      font-weight: 300;
  }
  #preview-next-btn {
      color: #fff;
      font-weight: 300;
  }
  #preview-close-btn {
      color: #fff;
      opacity: 0.8;
  }
  #preview-close-btn:hover,
  #preview-close-btn:active,
  #preview-close-btn:focus,
  #preview-close-btn:active:focus {
      color: #fff;
      opacity: 1;
  }
</style>
