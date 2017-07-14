const text = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mi lacus, scelerisque vel lobortis sed, viverra in velit. Aliquam molestie pellentesque convallis. Proin venenatis ullamcorper nibh quis malesuada. Donec sollicitudin pharetra finibus. Nullam rutrum molestie aliquam. Etiam leo enim, scelerisque eu lectus et, commodo sagittis dolor. Integer sollicitudin ultrices lacinia.<br />
Duis quis tortor convallis urna elementum bibendum et in tortor. Ut condimentum non libero ac rutrum. Proin posuere fermentum libero id luctus. Suspendisse pretium vulputate elit, vitae tincidunt nibh fermentum vitae. Integer magna odio, ullamcorper eu tincidunt interdum, tincidunt dignissim felis. Vestibulum ultricies tortor mi. Vivamus in finibus urna. Maecenas semper sollicitudin sapien vitae gravida.
`
// Vertical Grid
let vgrid = {
  render: function(createElement) {
    let renderItems = []
    for (item in this.items) {
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

// Horizontal Grid
let hgrid = {
  render: function(createElement) {
    let renderItems = []
    for (item in this.items) {
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
    'vgrid': vgrid
  }
}

new Vue({
  el: '#app',
  components: {
    'grid': hgrid
  }
})
