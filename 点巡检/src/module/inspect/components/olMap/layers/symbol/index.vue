<script>
import BaseLayer from '../BaseLayer.vue'
import {
  addVectorSource,
  setStyle,
  featureStyle,
  selectFeatureStyle,
  calculateCenter,
  arrowStyle,
  arrowAnimation,
} from '../../utils'
import GeoJSON from 'ol/format/GeoJSON'
import { MultiPoint } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import { Style, Fill, Stroke, Circle as CircleStyle, Icon } from 'ol/style'
import { Modify, Select } from 'ol/interaction'
import { never } from 'ol/events/condition'

export default {
  name: 'VSymbol',
  extends: BaseLayer,
  inject: ['VMap'],
  props: {
    layerId: {
      type: String,
      default: `symbolLayer`,
    },
    heightLight: {
      type: String,
      default: '',
    },
    animation: {
      type: Boolean,
      default: false,
    },
    features: {
      type: String,
      default: '',
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
    heightLight(val) {
      // if (val) {
      //   console.log(val)
      this.setHeightLight(val)
      // } else {
      // }
    },

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
            if (geometryType == 'LineString') {
              let style
              style = featureStyle[geometryType]
              if (!this.animation)
                style = style.concat(arrowStyle(feature, this.map, 1))
              return style
            } else {
              return featureStyle[geometryType]
            }
          }
        }
      })

      this.layer.set('id', this.layerId)
      this.layer.set('type', this.type)
      // this.layer.set('users', true)
      this.layer.setZIndex(1)
      let feature
      if (this.features) {
        const features = new GeoJSON().readFeatures(this.features)
        source.addFeatures(features)
        feature = features[0]
        if (this.animation) {
          arrowAnimation(this.map, this.layer, feature)
        }
      }

      this.map.addLayer(this.layer)
      // this.layer.getFeatures().then((f) => {
      //   console.log(f)
      // })
      if (this.editable) {
        this.editMode()
      }
      if (this.type) {
        this.initDraw()
      }
    },

    initDraw() {
      this.resetDraw()
      this.draw.set('type', this.type)
      this.draw.set('layerId', this.layerId)
      if (this.editable) {
        this.map.addInteraction(this.draw)
      }

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
        features: this.features
          ? new GeoJSON().readFeatures(this.features)
          : [],
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
      this.select = new Select({
        layers: [this.layer],
        style: (feature, map) => {
          const geometryType = feature.getGeometry().getType()
          let style
          style = selectFeatureStyle[geometryType]
          if (geometryType == 'Point') {
            return style
          } else {
            const modifyGeometry = feature.get('modifyGeometry')
            const geometry = modifyGeometry
              ? modifyGeometry.geometry
              : feature.getGeometry()
            const result = calculateCenter(geometry)
            const coordinates = result.coordinates
            if (coordinates) {
              const minRadius = result.minRadius
              const sqDistances = result.sqDistances
              const rsq = minRadius * minRadius
              const points = coordinates.filter(function (coordinate, index) {
                return sqDistances[index] > rsq
              })

              if (geometryType == 'LineString') {
                if (!this.animation)
                  style = style.concat(arrowStyle(feature, this.map))
                style = style.concat(
                  new Style({
                    geometry: new MultiPoint(points),
                    image: new Icon({
                      scale: 0.6,
                      src: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUEBAQEBAUEBAUIBQQFCAoHBQUHCgsJCQoJCQsOCwsLCwsLDgsNDQ4NDQsRERISEREZGBgYGRwcHBwcHBwcHBz/2wBDAQYGBgsKCxUODhUXEw8TFx0cHBwcHR0cHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAeAB4DAREAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAABAUGAwf/xAAvEAACAgECBAMFCQAAAAAAAAABAgMEBQARBhIhMRMiQRQVcYHRIyQyQlFho7Hh/8QAGgEAAgMBAQAAAAAAAAAAAAAABAUCAwYBB//EAC0RAAIBAwMBBgUFAAAAAAAAAAECAwAEEQUSIVEGMUFhgfATIjNxoUKxwdHh/9oADAMBAAIRAxEAPwDruDwljPWpKteVImjTxCX37bgenx15NpmmtduVUgYGea1dzciIZNHZnhSXC1HszX4ZZEK/d13DnmO3qdG6hoZtY9xdSR4eNVW98JWwAaYUOBo78SyRZiJiVVnRF5ivMN9j5+mjbbs0JlyJV9BnH5qiXUih5U1MZKl7uyFmgX8T2d+Tn7b/AC1nr23+BK0fftNMIZN6ButNeE8vUw2RmsXWZY5ITGvKpbzFlI/rTHQr+O2lLP3FcfkUPfQNKoC9ad1Gp8dVjXsoK2crKCLijcMnbr9DpvAY9WTaw2zr+rqKEfdaHI5Q+FaW8vV4Us1MHjoWEUUiSZCYL55Ae4Xfvv8A5qc9+mnutvEDgEFjjk+/8qKQG4Bkb08qkM1cjyOWt3YkaOOdgwR+jDyj46zGpXAmnZxkBuv2pnbR7EC9KccCpG+e5JEDqYH6MNx+U6Z9mADdYPPyn+KG1P6XrT/M1rfDWHlrYSBgr/aXsnuoI3O3T1+mnWoRSWNuVgB6s/Hv+qCt2WeTLn7CjcNWtZ2nRtZuqFs1Sk1O+pXd1332I6kb+uitPie7jR51+ZcFW61VcMsTEIeDwRUVxkvLxLe/fwz/ABrrKdoRi8f0/YU10/6I9+NJq1q1Sm9opzNBNty+InQ7HvpVBO8R3ISDRToGGDyKInzGXsxtDYvzSwv+KNnJB+Wr5NRuHG1nYg+dQW3jU5AFZrkskkaxJdnSNBsiLI4AH6DY6gL2YDAdsDzNd+CnQUO8kkrmSVzJIe7sSSfmdUO5Y5PJqwADur//2Q==',
                    }),
                  })
                )
              } else if (geometryType == 'Polygon') {
                style = style.concat(
                  new Style({
                    geometry: new MultiPoint(points),
                    image: new CircleStyle({
                      radius: 5,
                      fill: new Fill({
                        color: '#33cc33',
                      }),
                      stroke: new Stroke({
                        width: 2,
                        color: '#ffffff',
                      }),
                    }),
                  })
                )
              }
              return style
            }
          }
        },
      })
      this.select.set('type', 'select')
      this.map.addInteraction(this.select)
      this.select.on('select', (evt) => {
        this.$emit('select', evt, this.map)
      })
      features = this.select.getFeatures()
      const defaultStyle = new Modify({ features })
        .getOverlay()
        .getStyleFunction()
      this.modify = new Modify({
        features,
        // condition: function (event) {
        //   return primaryAction(event) && !platformModifierKeyOnly(event)
        // },
        // deleteCondition: never,
        insertVertexCondition: () =>
          this.layer.getSource().getFeatures()[0].getGeometry().getType() ==
          'Polygon',
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
    setHeightLight(id) {
      this.layer.setStyle((feature) => {
        const geometryType = feature.getGeometry().getType()
        if (geometryType == 'LineString') {
          let style
          if (id == this.layerId) {
            style = selectFeatureStyle.HeightLightLineString
            if (!this.animation)
              style = style.concat(arrowStyle(feature, this.map))
            return style
          } else {
            style = featureStyle[geometryType]
            if (!this.animation)
              style = style.concat(arrowStyle(feature, this.map, 1))
          }
          return style
        } else {
          return featureStyle[geometryType]
        }
      })
    },

    keysListener() {
      document.onkeydown = (e) => {
        switch (e.which) {
          case 27:
            // console.log('esc')
            if (this.draw) {
              this.draw.removeLastPoint()
            }
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
