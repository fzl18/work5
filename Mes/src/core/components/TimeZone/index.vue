<template>
  <el-dialog
    :title="$translateTitle('时区设置')"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    :before-close="close"
    width="400px"
    @open="handleOpen"
  >
    <el-form
      ref="form"
      class="form form-detail"
      :model="form"
      label-position="top"
    >
      <el-form-item
        class="span4"
        prop="timeZone"
        :label="$translateTitle('时区')"
        :rules="[{ required: true, message: $translateTitle($cws.w105) }]"
      >
        <el-select v-model="form.timeZone" class="form-i" filterable clearable>
          <el-option
            v-for="item in timeOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <bt-button type="primary" @click="submitForm">
        {{ $translateTitle($cws.w008) }}
      </bt-button>
      <bt-button @click="close">
        {{ $translateTitle($cws.w009) }}
      </bt-button>
    </span>
  </el-dialog>
</template>

<script>
  import moment from 'moment-timezone'
  import { saveTimeZone } from '@/core/api/setting'
  import { mapActions, mapGetters } from 'vuex'
  import getPageTitle from '@/utils/pageTitle'

  export default {
    name: 'TimeZone',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        form: {
          jobNum: null, //工号
          timeZone: null, //时区
        },
        timeOptions: [], //时区选项
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'coreUser/userInfo',
      }),
    },
    mounted() {
      this.timeOptions = moment.tz.names()
    },
    methods: {
      async handleOpen() {
        this.form.jobNum = this.userInfo.loginName
        if (this.userInfo.userTimeZone) {
          this.form.timeZone = this.userInfo.userTimeZone
        }
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm(this.$translateTitle(this.$cws.w101), {
              title: this.$translateTitle(this.$cws.w010),
              type: 'warning',
              center: true,
            })
              .then(async () => {
                await saveTimeZone(this.form)
                this.userInfo.userTimeZone = this.form.timeZone
                this.$store.commit('coreUser/setUserinfo', this.userInfo)
                this.$msg({
                  type: 'success',
                  message: this.$translateTitle(this.$cws.w103),
                })
                this.close()
              })
              .catch(() => {})
          }
        })
      },
      close() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>
<style lang="scss" scoped></style>
