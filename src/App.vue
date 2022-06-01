<template>
  <div id="app">
    <div class="content">
      <div class="header d-flex justify-content-between">
        <div class="file-manager d-flex">
          <div class="file-manager-box d-flex">
            <p>Buckets:</p>
            <b-form-select
              v-model="currentBucket"
              id="bucket-select"
              v-on:change="selectBucket()"
            >
              <b-form-select-option :value="null" disabled
                >Please select an option</b-form-select-option
              >
              <b-form-select-option
                v-for="bucket in bucketOptions"
                v-bind:key="bucket"
                :value="bucket"
                >{{ bucket }}</b-form-select-option
              >
            </b-form-select>
          </div>
          <div class="file-manager-box d-flex">
            <p>Files:</p>
            <b-form-select
              v-model="currentFile"
              :disabled="currentBucket == null"
              id="file-select"
              v-on:change="selectFile()"
            >
              <b-form-select-option :value="null" disabled
                >Please select an option</b-form-select-option
              >
              <b-form-select-option
                v-for="file in fileOptions"
                v-bind:key="file"
                :value="file"
                >{{ file.objectKey }}</b-form-select-option
              >
            </b-form-select>
          </div>
        </div>
        <div class="action-buttons d-flex">
          <b-button variant="success" @click="downloadXlsx()">Download .xlsx</b-button>
        </div>
      </div>
      <ForgeViewer
        v-if="this.currentFile != null"
        v-bind="this.currentFile.objectId"
        :urn="this.currentFile.objectId"
        class="forge-viewer"
      />
    </div>
  </div>
</template>

<script>
import ForgeViewer from '@/components/ForgeViewer.vue'
import downloadExcel from '@/assets/excelDownload.js'
export default {
  name: 'App',
  components: {
    ForgeViewer
  },
  data () {
    return {
      currentToken: '',
      currentBucket: null,
      currentFile: null,
      bucketOptions: [],
      fileOptions: []
    }
  },
  methods: {
    async getBuckets () {
      const res = await fetch('https://localhost:44348/buckets')
      const json = await res.json()
      return json
    },
    async getItemsFromBucket (bucketKey) {
      const res = await fetch(`https://localhost:44348/files/${bucketKey}`)
      const json = await res.json()
      return json
    },
    async selectBucket () {
      this.fileOptions = await this.getItemsFromBucket(this.currentBucket)
    },
    downloadXlsx () {
      downloadExcel(this.currentFile.objectId, this.currentFile.objectKey)
    }
  },

  created () {
    this.getBuckets().then((buckets) => {
      this.bucketOptions = buckets
    })
  },
  mounted () {
    const autodeskScript = document.createElement('script')
    autodeskScript.setAttribute(
      'src',
      'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js'
    )
    document.head.appendChild(autodeskScript)
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    width: 90%;
    .forge-viewer {
      margin-top: 20px;
    }
    .header {
      margin-top: 10px;
      .action-buttons {
        gap: 10px;
      }
      .file-manager {
        gap: 30px;
        .file-manager-box {
          align-items: center;
          gap: 20px;
          width: 100%;
          p {
            margin-top: 0;
            margin-bottom: 0;
          }
          #bucket-select, #file-select {
            width: 20em;
          }
        }
      }
    }
  }
}
</style>
