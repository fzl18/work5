<script>
  import BaseLayer from '../BaseLayer.vue'
  import { nanoid } from 'nanoid'
  import {
    addVectorSource,
    setFeatures,
    setStyle,
    featureStyle,
    selectFeatureStyle,
  } from '../../utils'
  import { Collection } from 'ol'
  import VectorLayer from 'ol/layer/Vector'
  import Draw from 'ol/interaction/Draw'
  import { Style, Fill, Stroke } from 'ol/style'
  import { Modify, Select } from 'ol/interaction'
  import {
    never,
    platformModifierKeyOnly,
    primaryAction,
  } from 'ol/events/condition'

  export default {
    name: 'VDraw',
    extends: BaseLayer,
    inject: ['VMap'],
    props: {
      layerId: {
        type: String,
        default() {
          return `draw-layer-${nanoid()}`
        },
      },
      features: {
        type: Array,
        default() {
          return []
        },
      },
      source: {
        type: Object,
        default() {
          return { features: [] }
        },
      },
      featureStyle: {
        type: [Object, Boolean],
        default() {
          return false
        },
      },
      type: {
        type: String,
        default: '', // 'Point', 'LineString', 'Polygon'
      },
      clickTolerance: {
        type: Number,
        default: 6,
      },
      dragVertexDelay: {
        type: Number,
        default: 10,
      },
      snapTolerance: {
        type: Number,
        default: 10,
      },
      stopClick: {
        type: Boolean,
        default() {
          return true
        },
      },
      maxPoints: {
        type: Number,
        default: undefined,
      },
      minPoints: {
        type: Number,
        default: undefined,
      },
      endRight: {
        type: Boolean,
        default() {
          return false
        },
      },
      editable: {
        type: Boolean,
        default() {
          return false
        },
      },
      clear: {
        type: Boolean,
        default() {
          return false
        },
      },
      wrapX: {
        type: Boolean,
        default() {
          return false
        },
      },
      finishCondition: {
        type: Object,
      },
      geometryFunction: {
        type: Function,
      },
      geometryName: {
        type: String,
      },
      condition: {
        type: Object,
      },
      freehand: {
        type: Boolean,
        default() {
          return false
        },
      },
      freehandCondition: {
        type: Object,
      },
    },
    data() {
      return {
        layer: null,
        draw: null,
        modify: null,
        select: null,
      }
    },
    computed: {
      map() {
        return this.VMap.map
      },
    },
    watch: {
      visible: {
        handler(value) {
          this.layer.setVisible(value)
        },
        immediate: false,
      },
      zIndex: {
        handler(value) {
          this.layer.setZIndex(value)
        },
        immediate: false,
      },
      maxZoom: {
        handler(value) {
          this.layer.setMaxZoom(value)
        },
        immediate: false,
      },
      minZoom: {
        handler(value) {
          this.layer.setMinZoom(value)
        },
        immediate: false,
      },
      extent: {
        handler(value) {
          this.layer.setExtent(value)
        },
        immediate: false,
        deep: true,
      },
      type: {
        handler(value) {
          // this.dispose()
          if (value) {
            this.initDraw()
          } else {
            // this.dispose()
            // this.resetDraw()
            this.finish()
            this.setActive(false)
          }
        },
        immediate: false,
      },
      editable(val) {
        if (val) {
          this.editMode()
        }
      },
    },
    mounted() {
      this.init()
      this.keysListener()
    },
    beforeUnmount() {
      this.map.removeLayer(this.layer)
      this.dispose()
    },
    methods: {
      init() {
        const source = addVectorSource(this.source, this.map)
        if (this.source.features.length <= 0 && this.features.length > 0) {
          const features = setFeatures(this.features, this.map)
          source.addFeatures(features)
        }
        const layerOpt = { ...this.$props, ...{ source } }
        this.layer = new VectorLayer(layerOpt)
        this.layer.setStyle((feature) => {
          const geometryType = feature.getGeometry().getType()
          // console.log('geometryType:', geometryType)
          if (feature.get('style')) {
            return setStyle(feature.get('style'))
          } else {
            if (this.featureStyle) {
              return setStyle(this.featureStyle)
            } else {
              return featureStyle[geometryType]
            }
          }
        })
        this.layer.set('id', this.layerId)
        this.layer.set('type', 'draw')
        this.layer.set('users', true)
        this.layer.setZIndex(1)
        this.map.addLayer(this.layer)
        if (this.type) {
          this.initDraw()
        }
      },
      initDraw() {
        this.resetDraw()
        this.draw.set('type', 'draw')
        this.map.addInteraction(this.draw)
        // if (this.endRight) {
        //   this.map.on('contextmenu', (evt) => {
        //     // console.log(this.draw)
        //     this.draw.setActive(false)
        //   })
        // }
        if (this.clear) {
          this.draw.on('drawstart', (evt) => {
            this.layer.getSource().clear()
          })
        }
        this.draw.on('drawstart', (evt) => {
          this.$emit('drawstart', evt, this.map)
        })
        this.draw.on('drawend', (evt) => {
          this.$emit('drawend', evt, this.map)
        })
        if (this.editable) {
          this.editMode()
        }
      },
      resetDraw() {
        if (this.draw) {
          this.map.removeInteraction(this.draw)
          this.draw = null
        }
        const option = {
          source: this.layer.getSource(),
          type: this.type,
          freehand: this.freehand,
          clickTolerance: this.clickTolerance,
          features: setFeatures(this.features, this.map),
          dragVertexDelay: this.dragVertexDelay,
          snapTolerance: this.snapTolerance,
          stopClick: this.stopClick,
          maxPoints: this.maxPoints,
          minPoints: this.minPoints,
          wrapX: this.wrapX,
          geometryName: this.geometryName,
          geometryFunction: this.geometryFunction,
        }
        if (this.type === 'LineString') {
          const drawOpt = {
            ...option,
            ...{ type: 'LineString', maxPoints: 2 },
          }
          this.draw = new Draw(drawOpt)
        } else {
          this.draw = new Draw(option)
        }
      },
      dispose() {
        // this.map.removeLayer(this.layer)
        this.layer.getSource().clear()
        this.map.removeInteraction(this.draw)
        this.map.removeInteraction(this.select)
        this.map.removeInteraction(this.modify)
      },
      finish() {
        this.draw.finishDrawing()
      },
      remove() {
        this.map.removeInteraction(this.draw)
      },
      setActive(value) {
        this.draw.setActive(value)
      },
      editMode() {
        let features = []
        // if (this.select) {
        this.select = new Select({
          layers: [this.layer],
          style: (feature, map) => {
            const geometryType = feature.getGeometry().getType()
            // console.log('geometryType:', geometryType)
            let style
            style = selectFeatureStyle[geometryType]
            return style
          },
        })
        this.select.set('type', 'select')
        this.map.addInteraction(this.select)
        // return
        this.select.on('select', (evt) => {
          this.$emit('select', evt, this.map)
        })
        features = this.select.getFeatures()
        // } else {
        // features = new Collection(this.layer.getSource().getFeatures())
        // }
        // features = new Collection()
        console.log(features)

        this.modify = new Modify({
          features,
          insertVertexCondition: never,
        })
        this.modify.set('type', 'modify')
        this.map.addInteraction(this.modify)
        this.modify.on('modifystart', (evt) => {
          this.$emit('modifystart', evt, this.map)
        })
        this.modify.on('modifyend', (evt) => {
          this.$emit('modifyend', evt, this.map)
        })
      },
      keysListener() {
        document.onkeydown = (e) => {
          switch (e.which) {
            case 27:
              console.log('esc')
              this.draw.removeLastPoint()
              break

            default:
              break
          }
        }
      },
    },
    render(createElement, context) {
      return null
    },
  }
</script>

<style scoped></style>
