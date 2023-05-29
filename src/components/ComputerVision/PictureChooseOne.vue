<template>
  <div style="width: 100%; max-height: 100%">
    <a-table
      ref="multipleTable"
      :data-source="fileList"
      height="320"
      style="width: 100%"
      :rowSelection='{selectedRowKeys: selectedRowKeys, onChange: updateSelect }'
    >
      <a-table-column
        align="center"
        dataIndex="fileName"
        title="图片名称">
      </a-table-column>
      <a-table-column
        align="center"
        dataIndex="fileType"
        title="图片类型">
      </a-table-column>
      <a-table-column
        align="center"
        title="图片预览"
        min-width="50%">
        <template slot-scope="title">
<!--          <a-popover title="" trigger="hover">-->
            <tiff :path="title.filePath" :types="title.fileType" @onChangeUrl="getSrc"></tiff>
  <!-- <img :id="`img${title.fileId}`" :src="getImageView(title.fileId, title.fileName, title.filePath, title.fileType)" alt="" style="width: 150px; height:auto"> -->
<!--            <img slot="content" :src="getImageView(title.fileName, title.fileType)" style="width: 70px; height: auto">-->
<!--          </a-popover>-->
        </template>
      </a-table-column>
    </a-table>
    <a-button @click="freshData()" style="margin-top: 15px; margin-left: 15px">刷新</a-button>
  </div>
</template>

<script>
import { getFileAccessHttpUrl } from '@api/manage'
import tiff from '@/components/ComputerVision/tiff'

export default {
  name: "PictureChooseOne",
  components:{tiff},
  data() {
    return {
      fileList: [],
      multipleSelection: [],
      selectedRowKeys: [],
    }
  },
  created() {
    this.fileList = this.fileMaintain.curFileList()
  },
  methods: {

    freshData() {
      this.fileList = this.fileMaintain.curFileList()
    },
    updateSelect (selectedRowKeys, selectedRows) {
      console.log('selectedRows', selectedRows)
      this.multipleSelection = []
      this.selectedRowKeys = selectedRowKeys
      for (let i = 0; i < selectedRows.length; i ++) {
        // this.multipleSelection.push({'fileName': selectedRows[i].fileName, 'fileUrl': this.constant.data().OriFileBaseUrl + selectedRows[i].fileName})
        this.multipleSelection.push({'fileName': selectedRows[i].fileName, 'filePath': selectedRows[i].filePath, 'fileType': selectedRows[i].fileType, 'fileUrl': getFileAccessHttpUrl(selectedRows[i].filePath)})
      }
      // this.$emit('change', selectedRowKeys, selectedRows)
    },
    getSrc(){}
  },
  computed: {
  }
}
</script>

<style scoped>

</style>