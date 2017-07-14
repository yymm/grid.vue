let vgridBox = {
  template: `
    <div class='vgrid-box'>
      <div class='content flex'></div>
      <div
        class='handler vertical'
        :class='{ "pusher": handlerState, "resizer": !handlerState}'
        >+</div>
    </div>
  `,
  props: {
    pushItem: Function
  },
  data: function() {
    return {
      handlerState: true, // true=>pusher, false=>resizer
      handleEl: null,
      targetEl: null,
    }
  },
  mounted: function() {
    // EventListenerの追加削除を行うのでEventを自前管理する
    this.targetEl = this.$el.querySelector('.content')
    this.handleEl = this.$el.querySelector('.vertical')
    this.handleEl.addEventListener('click', this.push)
  },
  methods: {
    push: function(event) {
      this.pushItem(event);
      this.handlerState = false
      this.handleEl.innerHTML = ""
      this.handleEl.removeEventListener('click', this.push)
      this.handleEl.addEventListener('mousedown', this.resize)
    },
    resize: function(event) {
      event.preventDefault()
      let initialSize = this.targetEl.getBoundingClientRect().width
      let startDrag = event.clientX
      const direction = 'vertical'
      let dragTarget
      if (this.handleEl.setCapture != null) {
        dragTarget = this.handleEl
        dragTarget.setCapture()
      } else {
        dragTarget = window
      }
      this.targetEl.classList.remove('flex')
      this.targetEl.classList.add('not-flex')
      document.documentElement.classList.add('handle-dragging', direction)
      let onMouseMove = (event) => {
        let size = initialSize - startDrag
        size += event.clientX
        this.targetEl.style.width = `${size}px`
        console.log(size)
      }
      let onMouseUp = (event) => {
        if (dragTarget.releaseCapture != null) dragTarget.releaseCapture()
        this.targetEl.classList.remove('not-flex')
        this.targetEl.classList.add('flex')
        document.documentElement.classList.remove("handle-dragging", direction)
        dragTarget.removeEventListener('mousemove', onMouseMove)
        dragTarget.removeEventListener('mouseup', onMouseUp)
      }
      dragTarget.addEventListener('mousemove', onMouseMove)
      dragTarget.addEventListener('mouseup', onMouseUp)
    }
  },
}

let vgrid = {
  template: `
    <div class='vgrid'>
      <vgridBox
        v-for="item in items"
        :key="item"
        :pushItem=pushItem
      ></vgridBox>
    </div>
  `,
  data: function() {
    return {
      items: [0]
    }
  },
  methods: {
    pushItem: function(event) {
      let items = this.items
      const newValue = items[items.length-1] + 1
      items.push(newValue)
    }
  },
  components: {
    'vgridBox': vgridBox
  }
}

let hgridBox = {
  template: `
    <div class="hgrid-box">
      <vgrid></vgrid>
      <div
        class='handler horizontal'
        :class='{ "pusher": handlerState, "resizer": !handlerState}'
        @click="push($event)">+</div>
    </div>
  `,
  props: {
    pushItem: Function
  },
  data: function() {
    return {
      handlerState: true // true=>pusher, false=>resizer
    }
  },
  methods: {
    push: function(event) {
      if (this.handlerState) {
        this.pushItem(event)
        this.handlerState = false
        this.$el.querySelector('.horizontal').innerHTML = ""
      }
    }
  },
  components: {
    'vgrid': vgrid
  }
}

let hgrid = {
  template: `
    <div class='hgrid'>
      <hgridBox
        v-for="item in items"
        :key="item"
        :pushItem=pushItem
      ></hgridBox>
    </div>
  `,
  data: function() {
    return {
      items: [0]
    }
  },
  methods: {
    pushItem: function(event) {
      let items = this.items
      const newValue = items[items.length-1] + 1
      items.push(newValue)
    }
  },
  components: {
    'hgridBox': hgridBox
  }
}

new Vue({
  el: '#app',
  components: {
    'grid': hgrid
  }
})
