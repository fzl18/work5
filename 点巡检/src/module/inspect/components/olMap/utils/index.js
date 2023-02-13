import 'ol/ol.css'
import { Feature, Map, View } from 'ol'
import {
  defaults as defaultInteraction,
  DragRotateAndZoom,
} from 'ol/interaction'
import {
  Attribution,
  FullScreen,
  Rotate,
  ScaleLine,
  Zoom,
  ZoomSlider,
} from 'ol/control'

import {
  containsCoordinate,
  containsExtent,
  getHeight,
  getWidth,
  getCenter,
} from 'ol/extent.js'
import { Circle, LineString, Point, Polygon } from 'ol/geom'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import { nanoid } from 'nanoid'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import ImageCanvasSource from 'ol/source/ImageCanvas'
import { getVectorContext } from 'ol/render'
/**
 * @description 是否手机端
 * @returns {Boolean}
 */
export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile/i.test(userAgent)
  return isMobile
}

/**
 * Map扩展
 */
const e = function (t, r, s, i, a, n) {
  t.getSource()._forEachFeatureAtCoordinate &&
    t.getSource()._forEachFeatureAtCoordinate(
      r,
      s,
      function (e) {
        return i(e, t)
      },
      a,
      n
    )
}
Map.prototype.forEachSmFeatureAtPixel = function (t, r, s, i) {
  const a =
    s && s.layerFilter
      ? s.layerFilter
      : function () {
          return !0
        }
  const n = this.getLayers().getArray()
  const o = this.getView().getResolution()
  const l = this.getCoordinateFromPixel(t)
  for (let ss = 0; ss < n.length; ss++) {
    const h = n[ss]
    // console.log(h)
    // eslint-disable-next-line no-useless-call
    h.getVisible() && a.call(null, h) && e(h, l, o, r, t, i)
  }
  return this.forEachFeatureAtPixel(t, r, s)
}
const getGraphicsInExtent = function (source, e) {
  const t = []
  // eslint-disable-next-line multiline-ternary
  return e
    ? (source.get('graphics').map(function (r) {
        // eslint-disable-next-line no-sequences
        return containsExtent(e, r.getGeometry().getExtent()) && t.push(r), r
      }),
      t)
    : (source.get('graphics').map(function (e) {
        // eslint-disable-next-line no-sequences
        return t.push(e), e
      }),
      t)
}
ImageCanvasSource.prototype._forEachFeatureAtCoordinate = function (
  e,
  r,
  s,
  i,
  a
) {
  const n = getGraphicsInExtent(this)
  for (let o = n.length - 1; o >= 0; o--) {
    const l = n[o]._style
    if (!l) return
    const h = n[o]._coordinates
    const u = l.getImage()
    let c = !1

    const _t = []
    // eslint-disable-next-line no-unused-expressions,no-sequences
    // console.log(u)
    if (u.getAnchor()) {
      _t[0] = h[0] - u.getAnchor()[0] * r
      _t[2] = h[0] + u.getAnchor()[0] * r
      _t[1] = h[1] - u.getAnchor()[1] * r
      _t[3] = h[1] + u.getAnchor()[1] * r
    }
    containsCoordinate(_t, e) && (c = !0)
    // eslint-disable-next-line no-unused-expressions
    !0 !== c
      ? _t.isHighLight && _t._highLightClose()
      : (_t.isHighLight && _t._highLight(h, u, n[o], i), s && s(n[o], a))
  }
}

/**
 * 对Feature扩展
 */
export class FeatureExt extends Feature {
  /**
   * 更新元素位置
   * @param coordinates
   */
  setPosition(coordinates) {
    setPosition(this, coordinates)
  }

  getPosition() {
    return this.getGeometry().getCoordinates()
  }

  setRotateAngle(angle) {
    this.getStyle().getImage().setRotation(angle)
  }

  /**
   * 更新元素属性
   * @param key
   * @param value
   */
  update(key, value) {
    if (key === 'style') {
      this.setStyle(setStyle(value))
    }
    if (key === 'position') {
      setPosition(this, value)
    }
  }
}

/**  utils */

/**
 * 判断对象有效key
 * @param obj
 * @param key
 * @returns {*|boolean}
 */
export const validObjKey = (obj, key) => {
  if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
    // return !((typeof obj[key] === 'undefined') || (!obj[key] && obj[key] !== 0))
    if (typeof obj[key] === 'object') {
      return Object.keys(obj[key]).length > 0
    } else if (typeof obj[key] === 'boolean') {
      return obj[key]
    } else {
      return true
    }
  } else {
    return false
  }
}

/**
 * 设置元素位置
 * @param feature
 * @param coordinates
 */
export const setPosition = (feature, coordinates) => {
  feature.getGeometry().setCoordinates(coordinates)
}

/** styles */

export const setCircleStyle = (option) => {
  const optionCircle = {
    radius: option.radius || 2,
    fill: new Fill(option.fill || { color: 'blue' }),
    stroke: new Stroke(option.stroke || { color: 'white' }),
  }
  return new CircleStyle(optionCircle)
}

/** styles */

export const setPointStyle = (option) => {
  const optionPoint = {
    radius: option.radius || 2,
    fill: new Fill(option.fill || { color: 'blue' }),
    stroke: new Stroke(option.stroke || { color: 'white' }),
  }
  return new CircleStyle(optionPoint)
}

/**
 * 设置文本样式
 * @param option
 * @returns {Text}
 */
export const setText = (option) => {
  const defaultParam = {
    font: '14px sans-serif',
    padding: [2, 5, 2, 5], // [top, right, bottom, left].
  }
  const defaultOption = { ...defaultParam, ...option }
  const textStyle = new Text(defaultOption)
  if (validObjKey(option, 'fill')) {
    const fillStyle = new Fill(option.fill)
    textStyle.setFill(fillStyle)
  }
  if (validObjKey(option, 'backgroundFill')) {
    const backgroundFillStyle = new Fill(option.backgroundFill)
    textStyle.setBackgroundFill(backgroundFillStyle)
  }
  if (validObjKey(option, 'stroke')) {
    const strokeStyle = new Stroke(option.stroke)
    textStyle.setStroke(strokeStyle)
  }
  if (validObjKey(option, 'backgroundStroke')) {
    const backgroundStrokeStyle = new Stroke(option.backgroundStroke)
    textStyle.setBackgroundStroke(backgroundStrokeStyle)
  }
  return textStyle
}

/**
 * 设置样式
 * @param option
 */
export const setStyle = (option) => {
  const style = new Style()
  if (validObjKey(option, 'fill')) {
    style.setFill(new Fill(option.fill))
  } else {
    style.setFill(
      new Fill({
        color: 'rgba(67,126,255,0.15)',
      })
    )
  }
  if (validObjKey(option, 'stroke')) {
    style.setStroke(new Stroke(option.stroke))
  } else {
    style.setStroke(
      new Stroke({
        color: 'rgba(67,126,255,1)',
        width: 1,
        // lineDash: [20, 10, 20, 10]
      })
    )
  }
  if (validObjKey(option, 'icon')) {
    style.setImage(new Icon(option.icon))
  }
  if (validObjKey(option, 'circle')) {
    const circle = setCircleStyle(option.circle)
    style.setImage(circle)
  }
  if (validObjKey(option, 'text')) {
    const optionText = option.text
    const textStyle = setText(optionText)
    style.setText(textStyle)
  }
  return style
}

export const featureStyle = {
  LineString: [
    setStyle({
      fill: {
        color: 'rgba(67,126,255,0.15)',
      },
      stroke: {
        color: 'rgba(235, 254, 255,0.6)',
        width: 15,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
    setStyle({
      fill: {
        color: 'rgba(158, 180, 182,0.3)',
      },
      stroke: {
        color: 'rgba(91, 113, 120,0.6)',
        width: 10,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
  ],
  Polygon: [
    setStyle({
      fill: {
        color: 'rgba(24, 127, 165,0.3)',
      },
      stroke: {
        color: 'rgba(36, 127, 212,0.8)',
        width: 5,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
  ],
  Point: [
    setStyle({
      icon: {
        scale: 0.7,
        src: require('@/assets/img/point_2.png'),
      },
    }),
  ],

  Circle: [
    setStyle({
      fill: {
        color: 'rgba(24, 127, 165,0.3)',
      },
      stroke: {
        color: 'rgba(36, 127, 212,0.8)',
        width: 5,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
  ],
}
export const selectFeatureStyle = {
  LineString: [
    setStyle({
      fill: {
        color: 'rgba(67,126,255,0.15)',
      },
      stroke: {
        color: 'rgba(32, 232, 203,0.9)',
        width: 15,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
    setStyle({
      fill: {
        color: 'rgba(158, 180, 182,0.3)',
      },
      stroke: {
        color: 'rgba(11, 123, 111,0.7)',
        width: 10,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
  ],
  Polygon: [
    setStyle({
      fill: {
        color: 'rgba(158, 180, 182,0.5)',
      },
      stroke: {
        color: 'rgba(32, 232, 203,1)',
        width: 5,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
  ],
  Point: [
    setStyle({
      icon: {
        scale: 0.7,
        src: require('@/assets/img/point_1.png'),
      },
    }),
  ],

  Circle: [
    setStyle({
      fill: {
        color: 'rgba(24, 127, 165,0.3)',
      },
      stroke: {
        color: 'rgba(36, 127, 212,0.8)',
        width: 5,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
  ],
  HeightLightLineString: [
    setStyle({
      fill: {
        color: 'rgba(67,126,255,0.15)',
      },
      stroke: {
        color: 'rgba(32, 232, 203,0.9)',
        width: 15,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
    setStyle({
      fill: {
        color: 'rgba(158, 180, 182,0.3)',
      },
      stroke: {
        color: 'rgba(11, 123, 111,0.7)',
        width: 10,
        // lineDash: [20, 10, 20, 10],
        lineCap: 'square',
      },
    }),
  ],
}

export const arrowStyle = (feature, map, styleType) => {
  let styles
  styles = featureStyle[feature.getGeometry().getType()]
  const resolution = map.getView().getResolution()
  const geometry = feature.getGeometry()
  const length = geometry.getLength()
  const radio = (60 * resolution) / length
  const dradio = 10000
  for (let i = 0; i <= 1; i += radio) {
    let arrowLocation = geometry.getCoordinateAt(i)
    geometry.forEachSegment((start, end) => {
      if (start[0] == end[0] || start[1] == end[1]) return
      let dx1 = end[0] - arrowLocation[0]
      let dy1 = end[1] - arrowLocation[1]
      let dx2 = arrowLocation[0] - start[0]
      let dy2 = arrowLocation[1] - start[1]
      if (dx1 != dx2 && dy1 != dy2) {
        if (Math.abs(dradio * dx1 * dy2 - dradio * dx2 * dy1) < 0.001) {
          let dx = end[0] - start[0]
          let dy = end[1] - start[1]
          let rotation = Math.atan2(dy, dx)
          // arrowLocation.splice(0, 1)
          styles = styles.concat(
            new Style({
              geometry: new Point(arrowLocation),
              image: new Icon({
                src: styleType
                  ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAMCAYAAABm+U3GAAACQ0lEQVQ4T62TTUjTcRjHP89/EzMNCToEJoQ6tOxguTpEp0DUlYfaZq7yhYwMPOQlyA6ih94uSpcK7ZCzmm1FhNkUg6CCDpIbYS5zlyCIqA4JapbbExtu/Rfe6jk98H1+H57f93keARj3NuZWNw0tJPL/FXL/bkuZSnwa6HN7vGf/BkdCjklgpiz2+aTYX/8y6zpHB7APg1Yp5rtZE7/fbZFYzjDgEhiYni063d3dHU8VRUKOiwqdQHDDplxnYWFgKaXpHI0It4AwSo3Y+JLSJJEk4EYsp1/hhMC9b/PrGtva+tPdRaZqu1SkR+C5NU/rbLbgfBoepRnlJhAFqsTGx4SWBK+GBIabe1HtABlVy6K7vv5PdzMhxxkRelEJGTGjptQ+8tUEP4TiQ/iUhJcQNYOTdQFf0wXgPMI1d4O33exbJORoURgQCG/b+WR3ht/vqQIeYpD4TUUG2O9350ks5xGwX4QOV4P36lpgRN5srxitzADPUoCFZyhFWNmRBj++c3TjkmENAnuATrfHe8X8MGEFaB9IOEu12rYrmB6UzlEMTAAFwHGxEVgdXstmicfHNc4OQ7Td5Rm6kdHp1IEuFe1B5GX2yvLBYvvT9GrpB8pZZgKDfMApJYwlh+f3n8o3Yj8mFbaKIc2uI4M+M/Rt2HFJlHMijC2sWJx2+8iiaWiVKOOAlTh1UsqL9CY8uH1sS9xi8RnIZadncHStA1GRd5q1vrW8PPAzw9co11EOA7ViYyrjQP7lhFUxeEW27CV9NCneb++A1gRvjxw1AAAAAElFTkSuQmCC'
                  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAMCAYAAABm+U3GAAACJklEQVQ4T62TPWhTURTHf+fF4OCDInQQtCBKQEiHtD6dnIRiBTtodTO5wQoVOrQUBHWQdvBrURyqokJt6IfGQRxKLQ6Cugl5QUQcCl0EB7Mo6AvmvRy5oXm8hi6CZ7qX/7k/zjn/cwWgVCrtKBQKv+z5f4UsLi4eaDQan4A7xpiLnWDf9z8An6MoOu95XiOpq+oEcAQYEZEfSU3K5XIqCIKnwGng0fr6+oWpqalmO8n3/evAZWClu7t7uKenJ2hrqpoHngBVYFBEvrc1sQcLr9frD1X1HPCsXq/nR0dH4+oqlcpVEZkG3rquO5TJZH4m4AZ4DKwBAyLy1Wot8EZIqVS6bdsTkeVarXZmcnIyrs73/XERsbofRdGg53m1BPwksAR824CvJcGtvLm5uWvAFeCeMWYsOTff94t2XLb1vr6+Qx3zHgBeALab3CbwzMyM67ruS+AoMGGMubsVWEQ+5nK5gx3g3cAbYB/QG4MXFhZ2hmG4Ahy2ZhljbnVAx+3m2GpV9Vh/f39slKruB14DFn5WRJ63wLOzs7tSqdRqs9nsdRxnrFAoPEhC2+aJyPswDE94nhevlqpmN6BdwLCIvGqZVy6Xu4IgsLu613Eck8/nrQlxVKvVG6p6yT4Iw3DY87zfCdPsOFaBbcCQiLyLN2F+fn5PFEVLqnqzWCwub/VBRORLOp0eyWazfzrmeh84BRwXkcqmD9IJ+pe7qjrAdhGJ17L9/i87MudFMMyfiwAAAABJRU5ErkJggg==',
                anchor: [-0.8, 0.5],
                scale: 0.6,
                rotateWithView: false,
                rotation: -rotation,
              }),
            })
          )
        }
      }
    })
  }
  return styles
}

export const setFeatureStyle = (feature, style, map) => {
  const featureStyle = setStyle(style)
  feature.setStyle(featureStyle)
  if (validObjKey(style, 'styleFunction')) {
    feature.setStyle(function (feature, resolution) {
      return style.styleFunction(feature, resolution, map, featureStyle)
    })
  } else {
    feature.setStyle(featureStyle)
  }
}

// 动画箭头
export const arrowAnimation = (map, layer, feature, defaultOffset = 0.0001) => {
  let offset = defaultOffset
  layer.on('postrender', (evt) => {
    const vct = getVectorContext(evt)
    const resolution = map.getView().getResolution()
    const geometry = feature.getGeometry()
    if (geometry.getType() == 'LineString') {
      const length = geometry.getLength()
      const numArr = Math.ceil(length / resolution / 100)
      var points = []
      for (var i = 0; i <= numArr; i++) {
        let fracPos = i / numArr + offset
        if (fracPos > 1) fracPos -= 1
        let pf = new Feature(new Point(geometry.getCoordinateAt(fracPos)))
        points.push(pf)
      }
      geometry.forEachSegment((start, end) => {
        points.forEach((item) => {
          let line = new LineString([start, end])
          let coord = item.getGeometry().getFirstCoordinate()
          let cPoint = line.getClosestPoint(coord)
          if (
            Math.abs(cPoint[0] - coord[0]) < 1 &&
            Math.abs(cPoint[1] - coord[1]) < 1
          ) {
            var myImage = new Image(117, 71)
            myImage.src =
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAMCAYAAABm+U3GAAACQ0lEQVQ4T62TTUjTcRjHP89/EzMNCToEJoQ6tOxguTpEp0DUlYfaZq7yhYwMPOQlyA6ih94uSpcK7ZCzmm1FhNkUg6CCDpIbYS5zlyCIqA4JapbbExtu/Rfe6jk98H1+H57f93keARj3NuZWNw0tJPL/FXL/bkuZSnwa6HN7vGf/BkdCjklgpiz2+aTYX/8y6zpHB7APg1Yp5rtZE7/fbZFYzjDgEhiYni063d3dHU8VRUKOiwqdQHDDplxnYWFgKaXpHI0It4AwSo3Y+JLSJJEk4EYsp1/hhMC9b/PrGtva+tPdRaZqu1SkR+C5NU/rbLbgfBoepRnlJhAFqsTGx4SWBK+GBIabe1HtABlVy6K7vv5PdzMhxxkRelEJGTGjptQ+8tUEP4TiQ/iUhJcQNYOTdQFf0wXgPMI1d4O33exbJORoURgQCG/b+WR3ht/vqQIeYpD4TUUG2O9350ks5xGwX4QOV4P36lpgRN5srxitzADPUoCFZyhFWNmRBj++c3TjkmENAnuATrfHe8X8MGEFaB9IOEu12rYrmB6UzlEMTAAFwHGxEVgdXstmicfHNc4OQ7Td5Rm6kdHp1IEuFe1B5GX2yvLBYvvT9GrpB8pZZgKDfMApJYwlh+f3n8o3Yj8mFbaKIc2uI4M+M/Rt2HFJlHMijC2sWJx2+8iiaWiVKOOAlTh1UsqL9CY8uH1sS9xi8RnIZadncHStA1GRd5q1vrW8PPAzw9co11EOA7ViYyrjQP7lhFUxeEW27CV9NCneb++A1gRvjxw1AAAAAElFTkSuQmCC'
            let dx = end[0] - start[0]
            let dy = end[1] - start[1]
            var rotation = Math.atan(dx / dy)
            rotation = dy > 0 ? rotation : Math.PI + rotation
            vct.setStyle(
              new Style({
                image: new Icon({
                  img: myImage,
                  imgSize: [117, 71],
                  scale: 0.8,
                  anchor: [0.1, 0.1],
                  rotation: rotation - Math.PI / 2,
                }),
              })
            )
            vct.drawGeometry(item.getGeometry())
          }
        })
      })
      offset = offset + 0.00003
      //复位
      if (offset >= 1) offset = 0.0001
      map.render()
    }
  })
}

/** features */

/**
 * 设置多元素
 * @param features
 * @param map
 * @param hasStyle
 * @returns {*[]}
 */
export const setFeatures = (features, map, hasStyle = false) => {
  const output = []
  features.forEach((val) => {
    output.push(setFeature(val, map, hasStyle))
  })
  return output
}

/**
 * 设置元素
 * @param option
 * @param map
 * @param hasStyle
 * @returns {FeatureExt}
 */
export const setFeature = (option, map, hasStyle = false) => {
  if (validObjKey(option, 'type')) {
    const type = option.type
    console.log(type)
    switch (type) {
      case 'point':
        // return setPointFeature(option, map, hasStyle)
        return setCircle(option, map)
      case 'polygon':
        return setPolygon(option)
      case 'polyline':
        return setPolyline(option)
      case 'circle':
        return setCircle(option, map)
      default:
        return setPointFeature(option, map, hasStyle)
    }
  } else {
    return setPointFeature(option, map, hasStyle)
  }
}

/**
 * 设置点类型元素
 * @param option
 * @param map
 * @param hasStyle
 * @returns {FeatureExt}
 */
export const setPointFeature = (option, map, hasStyle = false) => {
  const coordinates = convertCoordinate(option.coordinates, option.convert)
  const feature = new FeatureExt({
    geometry: new Point(coordinates),
  })
  // newFeaturePrototype(feature)
  if (validObjKey(option, 'style')) {
    setFeatureStyle(feature, option.style, map)
  } else if (!hasStyle) {
    feature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 4,
          fill: new Fill({
            color: 'blue',
          }),
        }),
      })
    )
  }
  if (validObjKey(option, 'id')) {
    feature.setId(option.id)
  } else {
    feature.setId(`feature-${nanoid()}`)
  }
  if (typeof option === 'object') {
    for (const i in option) {
      if (Object.prototype.hasOwnProperty.call(option, i)) {
        feature.set(i, option[i])
      }
    }
  }
  if (validObjKey(option, 'coordinates') && validObjKey(option, 'convert')) {
    feature.set('coordinates', coordinates)
  }
  return feature
}

/**
 * 设置多边形类型元素
 * @param option
 * @returns {FeatureExt}
 */
export const setPolygon = (option) => {
  let coordinates = []
  if (validObjKey(option, 'convert') && option.convert) {
    option.coordinates.forEach((coordinate) => {
      coordinates.push(convertCoordinate(coordinate, option.convert))
    })
  } else {
    coordinates = option.coordinates
  }
  const feature = new FeatureExt({
    geometry: new Polygon([coordinates]),
  })
  feature.setId(option.id || `polygon-${nanoid()}`)
  if (typeof option === 'object') {
    for (const i in option) {
      if (Object.prototype.hasOwnProperty.call(option, i)) {
        feature.set(i, option[i])
      }
    }
  }
  return feature
}

/**
 * 设置折线类型元素
 * @param option
 * @returns {FeatureExt}
 */
export const setPolyline = (option) => {
  let coordinates = []
  if (validObjKey(option, 'convert') && option.convert) {
    option.coordinates.forEach((coordinate) => {
      coordinates.push(convertCoordinate(coordinate, option.convert))
    })
  } else {
    coordinates = option.coordinates
  }
  const feature = new FeatureExt({
    geometry: new LineString(coordinates),
  })
  feature.setId(option.id || `polyline-${nanoid()}`)
  feature.set('style', option.style || null)
  feature.set('type', option.type || 'polyline')
  feature.set('properties', option.properties || null)
  if (typeof option === 'object') {
    for (const i in option) {
      if (Object.prototype.hasOwnProperty.call(option, i)) {
        feature.set(i, option[i])
      }
    }
  }
  return feature
}

/**
 * 设置圆形类型元素
 * @param option
 * @param map
 * @returns {FeatureExt}
 */
export const setCircle = (option, map) => {
  const coordinates = convertCoordinate(option.center, option.convert)
  const feature = new FeatureExt({
    geometry: new Circle(coordinates, getRadiusByUnit(map, option.radius)),
  })
  feature.setId(option.id || `circle-${nanoid()}`)
  feature.set('style', option.style || null)
  feature.set('type', option.type || 'circle')
  feature.set('properties', option.properties || null)
  return feature
}

/**
 * 获取以米为单位的半径
 * @param map
 * @param radius
 * @returns {number}
 */
export const getRadiusByUnit = (map, radius) => {
  const metersPerUnit = map.getView().getProjection().getMetersPerUnit()
  return radius / metersPerUnit
}

/** source */

export const addVectorSource = (option, map) => {
  let features = []
  if (validObjKey(option, 'features')) {
    features = option.features
  }
  const source = { ...option, ...{ features: setFeatures(features, map) } }
  return new VectorSource(source)
}

/**
 * 设置聚合样式
 * @param style
 * @param text
 */
export const clusterFeatureStyle = (style, text) => {
  const textStyle = { ...style.text, ...{ text } }
  return { ...style, ...{ text: textStyle } }
}

/**
 * 添加聚合图层
 * @param option
 * @param map
 * @returns {VectorLayer<VectorSourceType>}
 */
export const addClusterLayer = (option, map) => {
  const clusterSource = option.source
  const total = option.source.getSource().getFeatures().length
  const styleCache = {}
  const clusterOptions = {
    source: clusterSource,
    style: function (feature) {
      const size = feature.get('features').length
      let style = styleCache[size]
      if (size > 1) {
        if (!style) {
          let styleOptions = {}
          if (!validObjKey(option, 'style') || !option.style) {
            // 无style属性设置默认样式
            styleOptions = {
              image: new CircleStyle({
                radius: 20,
                stroke: new Stroke({
                  color: '#fff',
                }),
                fill: new Fill({
                  color: '#3399CC',
                }),
              }),
              text: new Text({
                font: '16px sans-serif',
                text: size.toString(),
                fill: new Fill({
                  color: '#fff',
                }),
              }),
            }
            style = new Style(styleOptions)
          } else {
            if (option.style instanceof Array) {
              option.style.forEach((e) => {
                let min = 0
                let max = 0
                if (validObjKey(e, 'min') || validObjKey(e, 'max')) {
                  min = e.min || 0
                  max = e.max || total
                  if (min < size && size <= max) {
                    styleOptions = clusterFeatureStyle(e, size.toString())
                  }
                } else {
                  if (total > 0) {
                    const average = total / option.style.length
                    for (let i = 0; i < option.style.length; i++) {
                      min = i * average
                      max = average * (i + 1)
                      if (min < size && size <= max) {
                        styleOptions = clusterFeatureStyle(
                          option.style[i],
                          size.toString()
                        )
                      }
                    }
                  }
                }
              })
              style = setStyle(styleOptions)
            }
          }
          styleCache[size] = style
        }
      } else {
        // style = setStyle(feature.get('features')[0].get('style'))
        const styleOption = feature.get('features')[0].get('style')
        if (styleOption && Object.keys(styleOption).length > 0) {
          style = setStyle(styleOption)
        } else {
          style = new Style({
            image: new CircleStyle({
              radius: 4,
              fill: new Fill({
                color: 'blue',
              }),
            }),
          })
        }
      }
      return style
    },
  }
  return new VectorLayer(clusterOptions)
}

export const setImage = (option) => {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = option.src
    image.onload = () => {
      return resolve(
        new Style({
          image: new Icon({
            img: image,
            imgSize: [34, 37],
          }),
        })
      )
    }
  })
}

/**
 * 地图移动中心点
 * @param map
 * @param param
 */
export const panTo = (map, param) => {
  map.getView().animate(param)
}

export const flyTo = (map, param) => {
  const duration = param.duration || 2000
  const view = map.getView()
  const zoom = param.zoom || view.getZoom()
  let parts = 2
  let called = false
  function callback() {
    --parts
    if (called) {
      return
    }
    if (parts === 0) {
      called = true
    }
  }
  view.animate(
    {
      center: param.center,
      duration,
    },
    callback
  )
  view.animate(
    {
      zoom: param.flyZoom || zoom - 1,
      duration: duration / 2,
    },
    {
      zoom,
      duration: duration / 2,
    },
    callback
  )
}

export const setCenter = (map, center) => {
  map.getView().setCenter(center)
}

export const setZoom = (map, zoom) => {
  map.getView().setZoom(zoom)
}

export const setConstrainResolution = (map, enabled) => {
  map.getView().setConstrainResolution(enabled)
}

export const setMaxZoom = (map, zoom) => {
  map.getView().setMaxZoom(zoom)
}

export const setMinZoom = (map, zoom) => {
  map.getView().setMinZoom(zoom)
}

export const exportPNG = (map, downLoadId) => {
  map.once('rendercomplete', function () {
    const mapCanvas = document.createElement('canvas')
    const size = map.getSize()
    mapCanvas.width = size[0]
    mapCanvas.height = size[1]
    const mapContext = mapCanvas.getContext('2d')
    Array.prototype.forEach.call(
      map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
      function (canvas) {
        if (canvas.width > 0) {
          const opacity =
            canvas.parentNode.style.opacity || canvas.style.opacity
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity)

          const backgroundColor = canvas.parentNode.style.backgroundColor
          if (backgroundColor) {
            mapContext.fillStyle = backgroundColor
            mapContext.fillRect(0, 0, canvas.width, canvas.height)
          }

          let matrix
          const transform = canvas.style.transform
          if (transform) {
            // Get the transform parameters from the style's transform matrix
            matrix = transform
              // eslint-disable-next-line no-useless-escape
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number)
          } else {
            matrix = [
              parseFloat(canvas.style.width) / canvas.width,
              0,
              0,
              parseFloat(canvas.style.height) / canvas.height,
              0,
              0,
            ]
          }
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          )
          mapContext.drawImage(canvas, 0, 0)
        }
      }
    )
    mapContext.globalAlpha = 1
    if (navigator.msSaveBlob) {
      // link download attribute does not work on MS browsers
      navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png')
    } else {
      const link = document.getElementById(downLoadId)
      link.href = mapCanvas.toDataURL()
      link.click()
    }
  })
  map.renderSync()
}

// export const getDistancePoint = (from, to, units = "kilometers") => {
//   const fromPoint = point(from);
//   const toPoint = point(to);
//   const options = { units };

//   return distance(fromPoint, toPoint, options);
// };

export const calculateCenter = (geometry) => {
  let center, coordinates, minRadius
  const type = geometry.getType()
  if (type === 'Polygon') {
    let x = 0
    let y = 0
    let i = 0
    coordinates = geometry.getCoordinates()[0].slice(1)
    coordinates.forEach(function (coordinate) {
      x += coordinate[0]
      y += coordinate[1]
      i++
    })
    center = [x / i, y / i]
  } else if (type === 'LineString') {
    center = geometry.getCoordinateAt(0.5)
    coordinates = geometry.getCoordinates()
  } else {
    center = getCenter(geometry.getExtent())
  }
  let sqDistances
  if (coordinates) {
    sqDistances = coordinates.map(function (coordinate) {
      const dx = coordinate[0] - center[0]
      const dy = coordinate[1] - center[1]
      return dx * dx + dy * dy
    })
    minRadius = Math.sqrt(Math.max.apply(Math, sqDistances)) / 3
  } else {
    minRadius =
      Math.max(
        getWidth(geometry.getExtent()),
        getHeight(geometry.getExtent())
      ) / 3
  }
  return {
    center,
    coordinates,
    minRadius,
    sqDistances,
  }
}

export const setControl = (map, control, options, controlOptions) => {
  if (control === 'zoom') {
    const zoom = OlMap.map.mapControlsZoom
    if (zoom) {
      map.removeControl(OlMap.map.mapControlsZoom)
    }
    if (options) {
      OlMap.map.mapControlsZoom = new Zoom(
        controlOptions || OlMap.map.mapControlsZoomOptions
      )
      map.addControl(OlMap.map.mapControlsZoom)
    }
  } else if (control === 'rotate') {
    const rotate = OlMap.map.mapControlsRotate
    if (rotate) {
      map.removeControl(OlMap.map.mapControlsRotate)
    }
    if (options) {
      OlMap.map.mapControlsRotate = new Rotate(
        controlOptions || OlMap.map.mapControlsRotateOptions
      )
      map.addControl(OlMap.map.mapControlsRotate)
    }
  } else if (control === 'attribution') {
    const attribution = OlMap.map.mapControlsAttribution
    if (attribution) {
      map.removeControl(OlMap.map.mapControlsAttribution)
    }
    if (options) {
      OlMap.map.mapControlsAttribution = new Attribution(
        controlOptions || OlMap.map.mapControlsAttributionOptions
      )
      map.addControl(OlMap.map.mapControlsAttribution)
    }
  } else if (control === 'FullScreen') {
    const fullScreen = OlMap.map.mapControlsFullScreen
    if (fullScreen) {
      map.removeControl(OlMap.map.mapControlsFullScreen)
    }
    if (options) {
      OlMap.map.mapControlsFullScreen = new FullScreen(
        OlMap.map.mapControlsFullScreen
      )
      map.addControl(OlMap.map.mapControlsFullScreen)
    }
  } else if (control === 'ScaleLine') {
    const scaleLine = OlMap.map.mapControlsScaleLine
    if (scaleLine) {
      map.removeControl(OlMap.map.mapControlsScaleLine)
    }
    if (options) {
      OlMap.map.mapControlsScaleLine = new ScaleLine(
        OlMap.map.mapControlsScaleLine
      )
      map.addControl(OlMap.map.mapControlsScaleLine)
    }
  } else if (control === 'ZoomSlider') {
    const zoomSlider = OlMap.map.mapControlsZoomSlider
    if (zoomSlider) {
      map.removeControl(OlMap.map.mapControlsZoomSlider)
    }
    if (options) {
      OlMap.map.mapControlsZoomSlider = new ZoomSlider(
        OlMap.map.mapControlsZoomSlider
      )
      map.addControl(OlMap.map.mapControlsZoomSlider)
    }
  }
}

export class OlMap {
  map = OlMap
  controls = {
    zoom: undefined,
    zoomOptions: undefined,
    attribution: undefined,
    attributionOptions: undefined,
    rotate: undefined,
    rotateOptions: undefined,
    FullScreen: undefined,
    ScaleLine: undefined,
    ZoomSlider: undefined,
  }

  interactions = {
    DragRotateAndZoom: undefined,
  }

  constructor(option = {}) {
    // view
    const viewOptDefault = {
      center: [108.5525, 34.3227],
      zoom: 5,
      constrainResolution: true,
      projection: 'EPSG:4326',
    }
    const viewOption = { ...viewOptDefault, ...option.view }

    const view = new View(viewOption)

    // controls
    const controlsDefault = {
      zoom: false,
      zoomOptions: undefined,
      rotate: false,
      rotateOptions: undefined,
      attribution: false,
      attributionOptions: undefined,
    }
    const controlsOption = { ...controlsDefault, ...option.controls }
    // const controls = defaultControls(controlsOption).extend([])

    this.map = new Map({
      target: option.target,
      view,
      controls: [],
      interactions: defaultInteraction(option.interactions),
    })

    // 动态controls
    for (const control in controlsOption) {
      if (control === 'zoom') {
        this.controls[control] = new Zoom(controlsOption.zoomOptions)
        if (controlsOption[control]) {
          this.map.addControl(this.controls[control])
        } else {
          this.map.removeControl(this.controls[control])
        }
      } else if (control === 'attribution') {
        this.controls[control] = new Attribution(
          controlsOption.attributionOptions
        )
        if (controlsOption[control]) {
          this.map.addControl(this.controls[control])
        } else {
          this.map.removeControl(this.controls[control])
        }
      } else if (control === 'rotate') {
        this.controls[control] = new Rotate(controlsOption.rotateOptions)
        if (controlsOption[control]) {
          this.map.addControl(this.controls[control])
        } else {
          this.map.removeControl(this.controls[control])
        }
      } else if (control === 'FullScreen') {
        this.controls[control] = new FullScreen(controlsOption[control])
        if (controlsOption[control]) {
          this.map.addControl(this.controls[control])
        } else {
          this.map.removeControl(this.controls[control])
        }
      } else if (control === 'ScaleLine') {
        this.controls[control] = new ScaleLine(controlsOption[control])
        if (controlsOption[control]) {
          this.map.addControl(this.controls[control])
        } else {
          this.map.removeControl(this.controls[control])
        }
      } else if (control === 'ZoomSlider') {
        this.controls[control] = new ZoomSlider(controlsOption[control])
        if (controlsOption[control]) {
          this.map.addControl(this.controls[control])
        } else {
          this.map.removeControl(this.controls[control])
        }
      }
    }

    for (const interaction in option.interactions) {
      if (interaction === 'DragRotateAndZoom') {
        this.interactions[interaction] = new DragRotateAndZoom(
          option.interactions[interaction]
        )
        if (option.interactions[interaction]) {
          this.map.addInteraction(this.interactions[interaction])
        } else {
          this.map.removeInteraction(this.interactions[interaction])
        }
      }
    }
  }

  static panTo(param) {
    return panTo(OlMap.map.map, param)
  }

  static flyTo(param) {
    return flyTo(OlMap.map.map, param)
  }

  static setCenter(center) {
    return setCenter(OlMap.map.map, center)
  }

  static setZoom(zoom) {
    return setZoom(OlMap.map.map, zoom)
  }

  static setConstrainResolution(enabled) {
    return setConstrainResolution(OlMap.map.map, enabled)
  }

  static setMaxZoom(zoom) {
    return setMaxZoom(OlMap.map.map, zoom)
  }

  static setMinZoom(zoom) {
    return setMinZoom(OlMap.map.map, zoom)
  }

  static exportPNG(downLoadId) {
    return exportPNG(OlMap.map.map, downLoadId)
  }

  // static getDistancePoint(from, to, units) {
  //   return getDistancePoint(from, to, units);
  // }

  static calculateCenter(geometry) {
    return calculateCenter(geometry)
  }

  static getControl(control) {
    return OlMap.map.controls[control]
  }

  static setControl(control, options, controlOptions) {
    return setControl(OlMap.map.map, control, options, controlOptions)
  }

  get mapControlsZoom() {
    return OlMap.map.controls.zoom
  }

  set mapControlsZoom(value) {
    OlMap.map.controls.zoom = value
  }

  get mapControlsRotate() {
    return OlMap.map.controls.rotate
  }

  set mapControlsRotate(value) {
    OlMap.map.controls.rotate = value
  }

  get mapControlsAttribution() {
    return OlMap.map.controls.attribution
  }

  set mapControlsAttribution(value) {
    OlMap.map.controls.attribution = value
  }

  get mapControlsZoomOptions() {
    return OlMap.map.controls.zoomOptions
  }

  set mapControlsZoomOptions(value) {
    OlMap.map.controls.zoomOptions = value
  }

  get mapControlsRotateOptions() {
    return OlMap.map.controls.rotateOptions
  }

  set mapControlsRotateOptions(value) {
    OlMap.map.controls.rotateOptions = value
  }

  get mapControlsAttributionOptions() {
    return OlMap.map.controls.attributionOptions
  }

  set mapControlsAttributionOptions(value) {
    OlMap.map.controls.attributionOptions = value
  }

  get mapControlsFullScreen() {
    return OlMap.map.controls.FullScreen
  }

  set mapControlsFullScreen(value) {
    OlMap.map.controls.FullScreen = value
  }

  get mapControlsScaleLine() {
    return OlMap.map.controls.ScaleLine
  }

  set mapControlsScaleLine(value) {
    OlMap.map.controls.ScaleLine = value
  }

  get mapControlsZoomSlider() {
    return OlMap.map.controls.ZoomSlider
  }

  set mapControlsZoomSlider(value) {
    OlMap.map.controls.ZoomSlider = value
  }
}
