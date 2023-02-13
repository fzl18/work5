<script>
  import BaseLayer from '../BaseLayer.vue'
  import { nanoid } from 'nanoid'
  import { XYZ } from 'ol/source.js'
  import TileLayer from 'ol/layer/Tile.js'

  export default {
    name: 'VTile',
    extends: BaseLayer,
    inject: ['VMap'],
    props: {
      layerId: {
        type: String,
        default() {
          return `tile-layer-${nanoid()}`
        },
      },
      preload: {
        type: Number,
        default: 0,
      },
      tileType: {
        type: String,
        default: 'TD',
        validator: (value) => ['TD', 'TD_IMG'].includes(value.toUpperCase()),
      },
      tdVec: {
        type: String,
      },
      tdCva: {
        type: String,
      },
      tdImg: {
        type: String,
      },
      tdCia: {
        type: String,
      },
      base: {
        type: Boolean,
        default: true,
      },
      xyz: {
        type: Object,
        default() {
          return {}
        },
      },
      wms: {
        type: Object,
        default() {},
      },
    },
    data() {
      return {
        layer: null,
        layers: [],
        addForOverview: false,
      }
    },
    computed: {
      map() {
        return this.VMap.map
      },
    },
    watch: {
      tileType: {
        handler(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            this.clear(oldValue)
            this.init()
          }
        },
        immediate: false,
        deep: true,
      },
      visible: {
        handler(value) {
          this.layers.map((layer) => layer.setVisible(value))
        },
        immediate: false,
      },
      zIndex: {
        handler(value) {
          this.layers.map((layer) => layer.setZIndex(value))
        },
        immediate: false,
      },
      maxZoom: {
        handler(value) {
          this.layers.map((layer) => layer.setMaxZoom(value))
        },
        immediate: false,
      },
      minZoom: {
        handler(value) {
          this.layers.map((layer) => layer.setMinZoom(value))
        },
        immediate: false,
      },
      extent: {
        handler(value) {
          this.layers.map((layer) => layer.setExtent(value))
        },
        immediate: false,
      },
      'xyz.attributions': {
        handler(value) {
          this.layers.map((layer) => layer.getSource().setAttributions(value))
        },
        immediate: false,
        deep: true,
      },
    },
    updated() {
      this.init()
    },
    mounted() {
      this.init()
    },
    beforeUnmount() {
      this.layers.forEach((layer) => {
        layer.getSource().clear()
        this.map.removeLayer(layer)
      })
    },
    methods: {
      clear(oldValue) {
        const layers = this.map
          .getLayers()
          .getArray()
          .filter((x) => x.get('base'))
        if (layers && layers.length > 0) {
          layers.forEach((layer) => {
            if (layer.get('tileType') === oldValue || layer.get('isDefault')) {
              this.map.removeLayer(layer)
            }
          })
        }
      },
      init() {
        switch (this.tileType.toUpperCase()) {
          case 'TD':
            this.initTD()
            break
          case 'TD_IMG':
            this.initTDIMG()
            break
          default:
            this.initTD()
            break
        }
      },

      initTD() {
        const layerVec = this.initXYZbyURL(
          this.tdVec ||
            'https://t4.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=df4846bd0e93cc6c56d63869081c769f'
        )
        const layerCva = this.initXYZbyURL(
          this.tdCva ||
            'https://t3.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=df4846bd0e93cc6c56d63869081c769f'
        )
        this.layers = [layerVec, layerCva]
        if (!this.addForOverview) {
          this.layers.forEach((layer) => {
            this.map.addLayer(layer)
          })
        }
      },
      initXYZbyURL(url) {
        const xyzOpt = {
          ...{ crossOrigin: 'anonymous' },
          ...this.$props.xyz,
          ...{ url },
        }
        const source = new XYZ(xyzOpt)
        const layerOpt = { ...this.$props, ...{ source } }
        const layer = new TileLayer(layerOpt)
        layer.set('base', true)
        layer.setZIndex(0)
        return layer
      },
      initTDIMG() {
        const layerImg = this.initXYZbyURL(
          this.tdImg ||
            'https://t4.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=df4846bd0e93cc6c56d63869081c769f'
        )
        const layerCia = this.initXYZbyURL(
          this.tdCia ||
            'https://t3.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=df4846bd0e93cc6c56d63869081c769f'
        )
        this.layers = [layerImg, layerCia]
        if (!this.addForOverview) {
          this.layers.forEach((layer) => {
            this.map.addLayer(layer)
          })
        }
      },
    },
    render(createElement, context) {
      return null
    },
  }
</script>

<style scoped></style>
