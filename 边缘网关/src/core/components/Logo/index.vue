<template>
  <div :class="'logo-container-' + layout">
    <router-link to="/">
      <div class="logo-flex">
        <span class="logo">
          <remix-icon v-if="logo" :icon-class="logo" :class="logo" is-svg />
        </span>
        <span
          :class="{ 'hidden-xs-only': layout === 'horizontal' }"
          class="title"
        ></span>
      </div>
    </router-link>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Logo',
    computed: {
      ...mapGetters({
        logo: 'coreSettings/logo',
        logoImage: 'coreSettings/logoImage',
        title: 'coreSettings/title',
        layout: 'coreSettings/layout',
      }),
    },
  }
</script>
<style lang="scss" scoped>
  @mixin container {
    position: relative;
    height: $base-top-bar-height;
    overflow: hidden;
    line-height: $base-top-bar-height;
    background: #b2bbc4 !important;
  }

  @mixin logo {
    display: flex;
    width: 30px;
    height: 30px;
    color: $base-title-color;
    vertical-align: middle;
    justify-content: center;
    align-items: flex-start;
  }

  @mixin title {
    display: inline-block;
    overflow: hidden;
    font-size: 18px;
    line-height: 38px;
    color: $base-title-color !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .logo-container-horizontal,
  .logo-container-common {
    @include container;

    .logo {
      svg {
        @include logo;
      }
    }

    .title {
      @include title;
    }
  }

  .logo-container-cloud {
    .title {
      @include title;
    }
  }

  .logo-container-vertical,
  .logo-container-gallery,
  .logo-container-comprehensive {
    @include container;

    height: $base-logo-height;
    line-height: $base-logo-height;
    text-align: center;

    .logo {
      svg {
        @include logo;
        width: 110px;
        height: 24px;
      }
      margin-left: 15px;
      margin-top: 20px;
    }

    .title {
      @include title;
      max-width: calc(#{$base-left-menu-width} - 60px);
    }
  }

  .logo-container-gallery {
    background: $base-gallery-second-menu-background !important;

    .logo {
      position: fixed;
      top: 0;
      display: block;
      width: $base-left-menu-width-min;
      height: $base-logo-height;
      margin: 0;
      background: $base-gallery-first-menu-background;
    }

    .title {
      padding-right: 15px;
      padding-left: 15px;
      margin-left: $base-left-menu-width-min;
      color: $base-color-black !important;

      @include title;

      background: $base-gallery-second-menu-background !important;
    }
  }

  .logo-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .logo-img {
    width: 110px;
    height: 24px;
    margin-right: 10px;
  }
  .svg-icon.bt_logo {
    width: 110px;
    height: 24px;
    margin-right: 10px;
    margin-top: -5px;
    font-size: 20px;
  }
</style>
