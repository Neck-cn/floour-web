<template>
  <div>
    <van-row style="width: 100%;z-index: 2;position: fixed;height: 40px;">
      <van-col span="8">
        <van-field  style="padding: 0;text-align: center; margin: 10px auto;" v-model="start_time" label-width="56px" label="开始时间"  @click="time_status='start';show=true"/>
      </van-col>
      <van-col span="8">
        <van-field style="padding: 0;text-align: center; margin: 10px auto;" v-model="end_time" label-width="56px" label="结束时间" @click="time_status='end';show=true"/>
      </van-col>
      <van-col span="5">
        <van-field style="padding: 0;text-align: center; margin: 10px auto;" v-model="type" label-width="28px" label="类型"  @click="showPicker=true"/>
      </van-col>
      <van-col span="3">
        <van-button plain hairline type="info" @click="getGoodsRecordCountByTime" round size="mini"
                    style="padding:0;width: 90%;text-align: center; display: block; margin: 10px auto;">搜索
        </van-button>
      </van-col>
    </van-row>
    <div style="padding-top: 40px;width: 100%;position: fixed;z-index: 1">
      <hr/>
      <table style="width: 100%">
        <tr>
          <th>面粉/斤</th>
          <th>数量/袋</th>
          <th>小计/元</th>
        </tr>
        <tr v-for="item in goodsRecordCount">
          <td class="td-center">{{ item.goods }}</td>
          <td class="td-center">{{ item.quantity }}</td>
          <td class="td-center">{{ item.account }}</td>
        </tr>
        <tr>
          <td class="td-center">总计</td>
          <td class="td-center">{{ total.quantity }}</td>
          <td class="td-center">{{ total.account }}</td>
        </tr>
      </table>
    </div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="padding-top:90px;margin-bottom: 50px;"
                      ref="list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group v-for="item in list" :key="item.gid">
          <van-cell title="名称" :value="item.sname"/>
          <van-cell title="单价" :value="item.price"/>
          <van-cell title="数量" :value="item.quantity"/>
          <van-cell title="时间" :value="item.time"/>
          <van-cell title="付款方式" :value="item.type"/>
          <van-cell title="小计" :value="item.account"/>
          <hr/>
        </van-cell-group>
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
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import {reqGetGoodsRecordByTime, reqGetGoodsRecordCountByTime} from "../api";
import formatDate from "../global/formatDate";
import {Toast} from "vant";

export default {
  name: "Account",
  data() {
    return {
      start_time: formatDate(new Date()),
      end_time: formatDate(new Date()),
      show: false,
      currentDate: new Date(),
      time_status: 'start',
      list: [],
      goodsRecordCount: [],
      loading: false,
      finished: false,
      refreshing: false,
      columns: ['全部', '现结', '月结'],
      showPicker: false,
      type: '全部',
      page: 1,
      pageSize: 20,
      totalPage: 1,
      total: {
        quantity: 0,
        account: 0
      }
    }
  },
  methods: {
    setTime() {
      if (this.time_status === 'start') {
        this.start_time = formatDate(this.currentDate);
      } else if (this.time_status === 'end') {
        this.end_time = formatDate(this.currentDate);
      }
      this.show = false;
    },
    getGoodsRecordCountByTime() {
      let that = this;
      reqGetGoodsRecordCountByTime(this.start_time, this.end_time, this.type).then(res => {
        that.goodsRecordCount = res;
        res.forEach(value => {
          that.total.quantity += Number(value.quantity);
          that.total.account += Number(value.account);
        });
        this.$refs.list.$el.style = "margin-bottom: 50px;padding-top:" + (90 + 28 * res.length) + "px;";
      });
      this.onRefresh();
    },
    async onLoad() {
      if (this.page > this.totalPage) {
        this.finished = true;
        Toast({
          message: '没有更多了',
          position: 'bottom',
        });
        return;
      }
      let res = await reqGetGoodsRecordByTime(this.start_time, this.end_time, this.type, this.page, this.pageSize);
      this.list = this.list.concat(res.records);
      this.page++;
      this.totalPage = res.pages;
      this.loading = false;
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.list = [];
      this.totalPage = 1;
      this.page = 1;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    onConfirm(value) {
      this.type = value;
      this.showPicker = false;
    }
  }
}
</script>

<style scoped>
.td-center {
  text-align: center;
  margin: auto;
}

tr {
  height: 24px;
}
</style>
