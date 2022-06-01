<template>
  <div id="forgeViewer"></div>
</template>

<script>
export default {
  props: {
    urn: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      viewer: null,
      options: {
        env: 'AutodeskProduction2',
        api: 'streamingV2',
        getAccessToken: function (onTokenReady) {
          fetch('https://localhost:44348/token')
            .then(res => res.json())
            .then(json => {
              onTokenReady(json.accessToken, json.expiresIn)
            })
        }
      }
    }
  },
  mounted () {
    this.loadViewer()
  },
  methods: {
    onDocumentLoadSuccess (viewerDocument) {
      const defaultModel = viewerDocument.getRoot().getDefaultGeometry()
      this.viewer.loadDocumentNode(viewerDocument, defaultModel)
    },
    onDocumentLoadFailure () {
      console.error('onDocumentLoadFailure()')
    },
    loadViewer () {
      const urnEncoded = 'urn:' + btoa(this.urn)
      Autodesk.Viewing.Initializer(this.options, () => {
        const htmlDiv = document.getElementById('forgeViewer')
        this.viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv)
        const startedCode = this.viewer.start()
        if (startedCode > 0) {
          console.error('Failed to start viewer')
          return
        }
        console.log('Initialization complete, loading a model ...')
      })
      Autodesk.Viewing.Document.load(urnEncoded, this.onDocumentLoadSuccess, this.onDocumentLoadFailure)
    }
  },
  watch: {
    urn: function (newVal, oldVal) {
      console.log('Prop changed: ' + newVal + 'was: ' + oldVal)
      this.viewer.finish()
      this.loadViewer()
    }
  }
}
</script>

<style lang="scss">
#forgeViewer {
  position: absolute;
  width: 90%;
  height: 90%;
}
</style>
