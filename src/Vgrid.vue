<script>
const text = `
# git clone & change directory<br />
git clone https://github.com/yymm/grid.vue<br />
cd grid.vue<br />
<br />
# install dependencies<br />
npm install<br />
<br />
# serve with hot reload at localhost:8080<br />
npm run dev<br />
<br />
# build for production with minification<br />
npm run build<br />
`

export default {
  name: 'Vgrid',
  render: function(createElement) {
    let renderItems = []
    for (let item in this.items) {
      renderItems.push(item)
      renderItems.push('handler')
    }
    let createVBox = () => {
      return createElement(
        'div',
        {
          'class': { 'vgrid-box': true, 'vflex': true }
        },
        [
          createElement('div', { 'class': { 'content': true }, domProps: { innerHTML: text } })
        ]
      )
    }
    let createPusher = () => {
      return createElement(
        'div',
        {
          'class': { 'handler': true, 'vertical': true, 'pusher': true },
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
          'class': { 'handler': true, 'vertical': true, 'resizer': true },
          on: {
            mousedown: this.resize
          }
        }
      )
    }
    return createElement(
      'div',
      {
        'class': { 'vgrid': true }
      },
      renderItems.map((el, index) => {
        if (index%2 == 0) {
          return createVBox()
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
      let initialSize = targetEl.getBoundingClientRect().width
      let startDrag = event.clientX
      const direction = 'vertical'
      let dragTarget
      if (handleEl.setCapture != null) {
        dragTarget = handleEl
        dragTarget.setCapture()
      } else {
        dragTarget = window
      }
      // サイズ変更するとflexじゃなくなる
      targetEl.classList.remove('vflex')
      targetEl.classList.add('not-vflex')
      targetEl.style.width = `${initialSize}px`
      document.documentElement.classList.add('handle-dragging', direction)
      let onMouseMove = (event) => {
        let size = initialSize - startDrag
        size += event.clientX
        targetEl.style.width = `${size}px`
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
  }
}
</script>

<style>
.vgrid {
  flex: 1; /* hgrid-boxのflex子要素*/
  display: flex;
  flex-flow: row;
}
.vgrid-box {
  display: flex;
  flex-flow: row;
  min-width: 100px;
}
.vflex {
  flex: 1;
}
.not-vflex {
  width: auto;
}
/* content */
.content {
  flex: 1;
  background: #1d1f20;
  color: #eee;
  padding: 0.5rem;
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
