<template>
  <div>
    <!-- <van-sticky><van-nav-bar title="持续改善建议" class="navbar" /></van-sticky> -->
    <div id="Mobile">
      <div class="userInfo">
        <div>剩余积分：{{ score }}</div>
      </div>
      <van-form
        :colon="true"
        label-align="right"
        label-width="'1rem'"
        @submit="onSubmit"
      >
        <!-- <van-field v-model="jobNumber" name="工号" label="工号">
          <template #input>
            {{ userId }}
          </template>
        </van-field> -->
        <van-field v-model="userName" name="员工姓名" label="员工姓名" disabled>
          <!-- <template #input>
            {{ userName }}
          </template> -->
        </van-field>
        <van-field
          readonly
          clickable
          name="picker"
          :value="Monitor"
          label="班长姓名"
          placeholder="请选择"
          :rules="[{ required: true }]"
          @click="showMonitorPicker = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="Master"
          label="主管姓名"
          placeholder="请选择"
          :rules="[{ required: true }]"
          @click="showMasterPicker = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="LineType"
          label="工序"
          placeholder="请选择"
          :rules="[{ required: true }]"
          @click="showLineTypePicker = true"
        />
        <van-field
          readonly
          clickable
          name="picker"
          :value="ProposeType"
          label="建议类别"
          placeholder="请选择"
          :rules="[{ required: true }]"
          @click="showProposeTypePicker = true"
        />
        <van-field name="uploader" label="目前状态">
          <template #input>
            <van-uploader
              v-model="uploader"
              max-count="1"
              :before-read="beforeRead"
            />
          </template>
        </van-field>

        <van-popup v-model="showProposeTypePicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="proposeColumns"
            @confirm="
              (val) => {
                onConfirm('ProposeType', val)
              }
            "
            @cancel="showProposeType = false"
          />
        </van-popup>
        <van-popup v-model="showMonitorPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="monitorColumns"
            @confirm="
              (val) => {
                onConfirm('Monitor', val)
              }
            "
            @cancel="showMonitorPicker = false"
          />
        </van-popup>
        <van-popup v-model="showMasterPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="masterColumns"
            @confirm="
              (val) => {
                onConfirm('Master', val)
              }
            "
            @cancel="showMasterPicker = false"
          />
        </van-popup>
        <van-popup v-model="showLineTypePicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="lineTypeColumns"
            @confirm="
              (val) => {
                onConfirm('LineType', val)
              }
            "
            @cancel="showLineTypePicker = false"
          />
        </van-popup>
        <van-field
          v-model="suggestion"
          rows="4"
          autosize
          label="建议内容"
          type="textarea"
          maxlength="50"
          placeholder="必填项，少于50字，报修不属于CI建议。"
          show-word-limit
          :rules="[{ required: true }]"
        />
        <van-field
          v-model="operatePlan"
          rows="4"
          autosize
          label="改善措施"
          type="textarea"
          maxlength="50"
          placeholder="必填项，少于50字，必须是有效改善措施。"
          show-word-limit
          :rules="[{ required: true }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
  import Compressor from 'compressorjs'
  // import { getSuggestionInfoSave } from '../api'
  import { from } from 'readable-stream'
  import { fromData } from 'ssri'
  export default {
    name: 'Mobile',
    data() {
      return {
        userName: '',
        userId: '',
        score: '',
        jobNumber: '',
        uploader: [],
        ProposeType: '', // 类别
        Master: '', // 主管
        Monitor: '', // 班长
        LineType: '', // 工序
        masterColumns: [],
        monitorColumns: [],
        lineTypeColumns: [],
        proposeColumns: [],
        showMasterPicker: false,
        showMonitorPicker: false,
        showProposeTypePicker: false,
        showLineTypePicker: false,
        suggestion: '',
        operatePlan: '',
      }
    },
    created() {},
    mounted() {
      this.userName = this.$route.query.userName || '神秘人'
      this.userId = this.$route.query.userId || 0
      // this.jobNumber = this.$route.query.jobNumber || '***'
      this.score = this.$route.query.score || 0
      if (!this.userId) {
        this.$dialog
          .alert({
            message: '未查到该用户,请联系管理员',
            theme: 'round-button',
          })
          .then(() => {
            window.location.reload()
          })
      }
      let dictionary = this.$store.state.systemIndex.dictionary
      dictionary.map((item) => {
        if (item.catalogCode == 100) {
          item.dataDictionaries.map((val) => {
            val.value = val.dataCode
            val.label = val.dataValue
            this.monitorColumns.push(val.label)
          })
          this.monitorOptions = item.dataDictionaries
        }
        if (item.catalogCode == 400) {
          item.dataDictionaries.map((val) => {
            val.value = val.dataCode
            val.label = val.dataValue
          })
          this.statusOptions = item.dataDictionaries
        }
        if (item.catalogCode == 500) {
          item.dataDictionaries.map((val) => {
            val.value = val.dataCode
            val.label = val.dataValue
          })
          this.operatorOptions = item.dataDictionaries
        }
        if (item.catalogCode == 600) {
          item.dataDictionaries.map((val) => {
            val.value = val.dataCode
            val.label = val.dataValue
            this.proposeColumns.push(val.label)
          })
          this.categoryOptions = item.dataDictionaries
        }
        if (item.catalogCode == 300) {
          item.dataDictionaries.map((val) => {
            val.value = val.dataCode
            val.label = val.dataValue
            this.lineTypeColumns.push(val.label)
          })
          this.sectionOptions = item.dataDictionaries
        }
        if (item.catalogCode == 200) {
          item.dataDictionaries.map((val) => {
            val.value = val.dataCode
            val.label = val.dataValue
            this.masterColumns.push(val.label)
          })
          this.directorOptions = item.dataDictionaries
        }
      })
    },
    methods: {
      onSubmit(values) {
        let imgData = new FormData()
        if (this.uploader && this.uploader.length) {
          imgData.append(
            'file',
            new window.File(
              [this.uploader[0].file],
              this.uploader[0].file.name,
              { type: this.uploader[0].file.type }
            )
          )
        }
        imgData.append('userId', this.userId) //
        imgData.append(
          'category',
          this.findID(this.ProposeType, this.categoryOptions)
        )
        imgData.append(
          'sectionId',
          this.findID(this.LineType, this.sectionOptions)
        )
        imgData.append(
          'monitorId',
          this.findID(this.Monitor, this.monitorOptions)
        )
        imgData.append(
          'directorId',
          this.findID(this.Master, this.directorOptions)
        )
        imgData.append('suggestion', this.suggestion)
        imgData.append('operatePlan', this.operatePlan)

        // getSuggestionInfoSave(imgData).then((res) => {
        //   this.$dialog
        //     .alert({
        //       message: '感谢您的参与！',
        //       theme: 'round-button',
        //     })
        //     .then(() => {
        //       window.location.reload()
        //     })
        // })

        // this.ProposeType //类别
        // this.LineType // 工序
        // this.Master //主管
        // this.Monitor //班长
      },
      findID(name, src) {
        let id = null
        src.map((item) => {
          if (item.label == name) {
            id = item.value
          }
        })
        return id
      },
      onConfirm(type, value) {
        this[`show${type}Picker`] = false
        this[type] = value
      },
      beforeRead(file) {
        return new Promise((resolve) => {
          new Compressor(file, {
            quality: 0.4,
            checkOrientation: false,
            success: resolve,
            error(err) {},
          })
        })
      },
    },
  }
</script>

<style lang="scss">
  #Mobile {
    width: 100%;
    height: 120vh;
    padding: 0.4rem;
    // background: #001e53 url('../../../assets/images/bg.png') no-repeat;
    // background-size: cover;
    // background-attachment: fixed;
    &::before {
      content: '';
      position: fixed;
      z-index: -1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 120vh;
      padding: 0.4rem;
      background: #001e53 url('../../../assets/images/bg.png') no-repeat;
      background-size: cover;
    }
    .userInfo {
      font-size: 0.25rem;
      text-align: center;
      line-height: 0.4rem;
      margin-bottom: 0.4rem;
      color: rgb(255, 253, 111);
    }
    .van-cell {
      background-color: hsl(0deg 0% 100% / 13%);
      .van-field__label,
      .van-field__word-limit {
        color: #d6d9de !important;
      }
      .van-field__control {
        color: #fff !important;
      }
    }
  }
</style>
