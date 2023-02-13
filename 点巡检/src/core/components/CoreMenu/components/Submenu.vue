<template>
  <el-submenu
    ref="subMenu"
    :index="item.fullPath"
    :popper-append-to-body="false"
  >
    <template slot="title">
      <!-- <remix-icon
        v-if="item.meta && item.meta.remixIcon"
        :is-svg="item.meta.isCustomSvgIcon"
        :icon-class="item.meta.remixIcon"
        class="remix-icon"
    ></remix-icon> -->
      <img
        v-if="item.meta && item.meta.imgUrl"
        :src="getUrl(item)"
        class="grayImgShowClass"
        alt=""
        style="width: 20px; height: 20px; margin-right: 10px"
      >
      <img
        v-if="item.meta && item.meta.imgUrl"
        :src="getClickUrl(item)"
        class="imgShowClass"
        alt=""
        style="width: 20px; height: 20px; margin-right: 10px"
      >
      <div
        ref="subMenuTitle"
        class="subMenuTitle"
        :class="['subMenuTitle', isAnimation ? 'animation' : '']"
      >
        <span ref="title" class="title">
          {{ translateTitle(item.meta.title) }}
        </span>
      </div>
    </template>
    <slot />
  </el-submenu>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Submenu',
    props: {
      item: {
        type: Object,
        default() {
          return null
        },
      },
      routeChildren: {
        type: Object,
        default() {
          return null
        },
      },
    },
    data() {
      return {
        isAnimation: false,
      }
    },
    computed: {
      ...mapGetters({
        language: 'coreSettings/language',
      }),
    },
    watch: {
      language() {
        this.$nextTick(() => {
          this.isAnimation = this.$refs['title'].clientWidth > 100
        })
      },
    },
    mounted() {
      this.isAnimation = this.$refs['title'].clientWidth > 100
    },
    methods: {
      translateTitle,
      getUrl(val) {
        // console.log(val)
        return require(`@/static/icon/${val.meta.imgUrl}.png`)
      },
      getClickUrl(val) {
        // console.log(val)
        return require(`@/static/icon/click${val.meta.imgUrl}.png`)
      },
    },
  }
</script>
