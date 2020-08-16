<template>
  <div>
    <van-row>
      <van-col span="11">
        <van-field v-model="start_time" placeholder="请选择开始时间" @click="time_status='start';show=true"/>
      </van-col>
      <van-col span="11">
        <van-field v-model="end_time" placeholder="请选择结束时间" @click="time_status='end';show=true"/>
      </van-col>
      <van-col span="2">
        <van-icon name="search" style="width: max-content;height: max-content" @click="getRecordList"/>
      </van-col>
    </van-row>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item" :title="item" @click="getDetail(item)"/>
      </van-list>
    </van-pull-refresh>
    <van-popup
      v-model="show"
      position="bottom"
      round
      :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        @confirm="setTime"
      />
    </van-popup>
  </div>
</template>

<script>
import {reqGetGoodsRecordByTime} from "../api";

export default {
  name: "Account",
  data() {
    return {
      start_time: new Date().toDateString(),
      end_time: new Date().toDateString(),
      show: false,
      currentDate: new Date().toDateString(),
      time_status: 'start',
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
    }
  },
  methods: {
    setTime() {
      if (this.time_status === 'start') {
        this.start_time = this.currentDate.toDateString();
      } else if (this.time_status === 'end') {
        this.end_time = this.currentDate.toDateString();
      }
      this.show=false;
    },
    getRecordList(){

    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;

        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  }
}
</script>

<style scoped>

</style>
