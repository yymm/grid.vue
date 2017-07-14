<script>
import Vgrid from './Vgrid.vue'
export default {
  name: 'Hgrid',
  render: function(createElement) {
    let renderItems = []
    for (let item in this.items) {
      renderItems.push(item)
      renderItems.push('handler')
    }
    let createHBox = () => {
      return createElement(
        'div',
        {
          'class': { 'hgrid-box': true, 'hflex': true }
        },
        [
          createElement('vgrid')
        ]
      )
    }
    let createPusher = () => {
      return createElement(
        'div',
        {
          'class': { 'handler': true, 'horizontal': true, 'pusher': true },
          on: {
            click: this.push
          },
          domProps: {
            innerHTML: '+'
          }
        }
      )
    }
    let createResizer = () => {
      return createElement(
        'div',
        {
          'class': { 'handler': true, 'horizontal': true, 'resizer': true },
          on: {
            mousedown: this.resize
          }
        }
      )
    }
    return createElement(
      'div',
      {
        'class': { 'hgrid': true }
      },
      renderItems.map((el, index) => {
        if (index%2 == 0) {
          return createHBox()
        } else if (index == renderItems.length-1){
          return createPusher()
        } else {
          return createResizer()
        }
      })
    )
  },
  data: function() {
    return {
      items: [0]
    }
  },
  methods: {
    push: function(event) {
      let items = this.items
      const newValue = items[items.length-1] + 1
      items.push(newValue)
    },
    resize: function(event) {
      event.preventDefault()
      let handleEl = event.target;
      // handleの直前のDOMサイズを変更する
      let targetEl = handleEl.previousElementSibling
      let initialSize = targetEl.getBoundingClientRect().height
      let startDrag = event.clientY
      const direction = 'horizontal'
      let dragTarget
      if (handleEl.setCapture != null) {
        dragTarget = handleEl
        dragTarget.setCapture()
      } else {
        dragTarget = window
      }
      // サイズ変更するとflexじゃなくなる
      targetEl.classList.remove('hflex')
      targetEl.classList.add('not-hflex')
      document.documentElement.classList.add('handle-dragging', direction)
      let onMouseMove = (event) => {
        let size = initialSize - startDrag
        size += event.clientY
        targetEl.style.height = `${size}px`
      }
      let onMouseUp = (event) => {
        if (dragTarget.releaseCapture != null) dragTarget.releaseCapture()
        document.documentElement.classList.remove("handle-dragging", direction)
        dragTarget.removeEventListener('mousemove', onMouseMove)
        dragTarget.removeEventListener('mouseup', onMouseUp)
      }
      dragTarget.addEventListener('mousemove', onMouseMove)
      dragTarget.addEventListener('mouseup', onMouseUp)
    }
  },
  components: {
    'vgrid': Vgrid
  }
}
</script>

<style>
/* hgrid */
.hgrid {
  display: flex;
  flex-flow: column;
}
.hgrid-box {
  display: flex;
  /* vgridのために必要 */
  flex-flow: column;
  min-height: 400px;
}
.hflex {
  flex: 1;
}
.non-hflex {
  height: 100%;
}
/* pusher */
.pusher {
  /* flexを利用した文字の中央揃え */
  display: flex;
  align-items: center;
  justify-content: center;
  font: 1.2rem bold;
  color: #eee;
  background: #999;
  cursor: pointer;
}
.pusher.vertical:hover,
.pusher.horizontal:hover {
  background: #777;
}
.pusher.vertical {
  width: 1.5rem;
  min-width: 1.5rem;
}
.pusher.horizontal {
  height: 1.5rem;
}
/* resizer */
.resizer {
  background: #343436;
}
.resizer.horizontal {
  height: 1.5rem;
  cursor: ns-resize;
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid rgba(0,0,0,0.4);
}
.resizer.vertical {
  width: 1.5rem;
  min-width: 1.5rem;
  cursor: ew-resize;
  border-left: 1px solid rgba(255,255,255,0.1);
  border-right: 1px solid rgba(0,0,0,0.4);
}
html.handle-dragging * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
html.handle-dragging.vertical * { cursor: ew-resize; }
html.handle-dragging.horizontal * { cursor: ns-resize; }
html.handle-dragging iframe { pointer-events: none; }
</style>
