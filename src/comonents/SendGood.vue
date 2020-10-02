<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入商铺名称"
      @search="searchData"
      style="position: fixed;z-index:1;width: 100%;height: 50px;top:0;"
    />
    <van-row style="padding-top: 50px;padding-bottom:90px">
      <van-col span="6">
        <van-pull-refresh v-model="shopsRefreshing" @refresh="onRefresh">
          <van-list
            v-model="shopsLoading"
            :finished="shopsFinished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="item in shops" :key="item.sid" :title="item.name" @click="getDetail(item)"/>
          </van-list>
        </van-pull-refresh>
      </van-col>
      <van-col span="18">
        <van-row>
          <van-col span="12">
            <van-image width="100" height="100" :src="shop.image"/>
          </van-col>
          <van-col span="12">
            <van-cell title="店铺名称" :value="shop.name"/>
            <van-cell title="店铺位置" :value="shop.place"/>
          </van-col>
        </van-row>
        <van-pull-refresh v-model="shopRecordsRefresh" @refresh="onRecordRefresh">
          <van-list
            v-model="shopRecordsLoading"
            :finished="shopRecordsFinished"
            finished-text="没有更多了"
            @load="onRecordLoad"
          >
            <van-cell-group v-for="item in shopRecords" :key="item.gid">
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
      </van-col>
    </van-row>
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-model="time"
        type="date"
        @confirm="formatter"
        @cancel="showPicker = false"
      />
    </van-popup>
    <van-popup v-model="isAddGoodsRecord" :close-on-click-overlay="false">
      <van-form @submit="addGoodsRecord">
        <van-field
          v-model="goodRecord.goods"
          type="number"
          name="面粉规格"
          label="面粉规格"
          placeholder="请输入面粉规格(斤数)"
          :rules="[{ required:'true',patternNumber, message: '必须为大于0的数字' }]"
        />
        <van-field
          type="number"
          v-model="goodRecord.price"
          name="单价"
          label="单价/元"
          placeholder="请输入单价"
          @input="calAccount"
          :rules="[{ required:'true',patternNumber, message: '必须为大于0的数字' }]"
        />
        <van-field
          v-model="goodRecord.quantity"
          type="number"
          name="袋数"
          label="袋数"
          placeholder="请输入袋数"
          @input="calAccount"
          :rules="[{ required:'true',pattern, message: '必须为大于0的整数' }]"
        />
        <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="goodRecord.time"
          label="时间选择"
          placeholder="点击选择时间"
          @click="showPicker = true"
        />
        <van-field
          v-model="goodRecord.account"
          type="number"
          name="小记"
          label="小记/元"
          placeholder="请输入小计"
          :rules="[{ required:'true',patternNumber, message: '必须为大于0的数字' }]"
        />
        <van-field>
          <template #input>
            <van-radio-group v-model="goodRecord.type" direction="horizontal">
              <van-radio name="现结">现结</van-radio>
              <van-radio name="月结">月结</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
          <van-button round block type="default" style="margin-top: 6px" @click="isAddGoodsRecord=false">
            取消
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <van-popup v-model="isAddShop" :close-on-click-overlay="false">
      <van-form @submit="insertShop">
        <van-field
          v-model="addShop.name"
          name="店铺名称"
          label="店铺名称"
          placeholder="请输入店铺名称"
          :rules="[{ required:'true', message: '请输入店铺名称' }]"
        />
        <!--          <van-field-->
        <!--            v-model="addShop.image"-->
        <!--            name="店铺照片"-->
        <!--            label="请输入店铺照片"-->
        <!--            placeholder="店铺照片"-->
        <!--          />-->
        <van-field
          v-model="addShop.place"
          name="店铺地点"
          label="店铺地点"
          placeholder="请输入店铺地点"
        />

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
          <van-button round block type="default" style="margin-top: 6px" @click="isAddShop=false">
            取消
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <van-row style="position:fixed;width:100%;bottom: 64px;z-index: 1">
      <van-col span="6">
        <van-button type="primary" size="small" style="width: 80%;text-align: center; display: block; margin:auto;"
                    @click="isAddShop=true">添加店铺
        </van-button>
      </van-col>
      <van-col span="18">
        <van-button size="small" type="info" style="width: 80%;text-align: center; display: block; margin:auto;"
                    closeable @click="isAddGoodsRecord=true">添加送货记录
        </van-button>
      </van-col>
    </van-row>
  </div>


</template>

<script>

import {reqAddGoodsRecord, reqAddShop, reqFindGoodsRecord, reqFindShops, reqGetShopBySid} from "../api";
import {Toast} from "vant";
import formatDate from "../global/formatDate";

export default {
  name: "SendGood",
  data() {
    return {
      showPicker: false,
      value: "",
      shops: [],
      shopsLoading: false,
      shopsFinished: false,
      shopsRefreshing: false,
      shopsCurrentPage: 1,
      shopsPageSize: 20,
      shopsTotalPage: 1,
      shop: {
        sid: 0,
        name: '',
        image: '',
        place: ''
      },
      shopRecords: [],
      shopRecordsLoading: false,
      shopRecordsFinished: false,
      shopRecordsRefresh: false,
      shopRecordsCurrentPage: 1,
      shopRecordsPageSize: 20,
      shopRecordsTotalPage: 1,
      isAddGoodsRecord: false,
      goodRecord: {
        goods: '',
        price: '',
        quantity: '',
        time: formatDate(new Date()),
        type: '现结',
        account: ''
      },
      isAddShop: false,
      addShop: {
        name: '',
        image: '',
        place: ''
      },
      time: new Date(),
      patternNumber: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|[1-9]\d*$/,
      pattern: /^[1-9]\d*$/
    }
  }, methods: {
    searchData() {
      console.log(this.value);
      this.onRefresh();
    },
    async onLoad() {
      if (this.shopsCurrentPage > this.shopsTotalPage) {
        this.shopsFinished = true;
        Toast({
          message: '没有更多了',
          position: 'bottom',
        });
        return;
      }
      let res = await reqFindShops(this.shopsCurrentPage, this.shopsPageSize, this.value);
      this.shops = this.shops.concat(res.records);
      this.shopsCurrentPage++;
      this.shopsTotalPage = res.pages;
      this.shopsLoading = false;
    },
    onRefresh() {
      // 清空列表数据
      this.shops = [];
      // 重新加载数据
      this.shopsCurrentPage = 1;
      this.shopsTotalPage = 1;
      this.shopsFinished = false;
      // 将 loading 设置为 true，表示处于加载状态
      this.shopsLoading = true;
      this.onLoad();
    },
    async onRecordLoad() {
      if (this.shopRecordsCurrentPage > this.shopRecordsTotalPage) {
        this.shopRecordsFinished = true;
        Toast({
          message: '没有更多了',
          position: 'bottom',
        });
        return;
      }
      let res = await reqFindGoodsRecord(this.shop.sid, this.shopRecordsCurrentPage, this.shopRecordsPageSize);
      console.log(res);
      this.shopRecords = this.shopRecords.concat(res.records);
      this.shopRecordsCurrentPage++;
      this.shopRecordsTotalPage = res.pages;
      this.shopRecordsLoading = false;
    },
    onRecordRefresh() {
      // 清空列表数据
      this.shopRecords = [];
      // 重新加载数据
      this.shopRecordsCurrentPage = 1;
      this.shopRecordsTotalPage = 1;
      this.shopRecordsFinished = false;
      // 将 loading 设置为 true，表示处于加载状态
      this.shopRecordsLoading = true;
      this.onRecordLoad();
    },
    async getDetail(item) {
      this.shop = await reqGetShopBySid(item.sid);
      this.onRecordRefresh();
    },
    async addGoodsRecord() {
      console.log(this.goodRecord);
      let res = await reqAddGoodsRecord(this.shop.sid, this.shop.name, this.goodRecord.time, this.goodRecord.goods, this.goodRecord.quantity, this.goodRecord.account, this.goodRecord.type);
      console.log(res);
      this.goodRecord.account = '';
      this.goodRecord.price = '';
      this.goodRecord.quantity = '';
      this.goodRecord.goods = '';
      this.isAddGoodsRecord = false;
    },
    formatter() {
      this.showPicker = false;
      this.goodRecord.time = formatDate(this.time);
    },
    async insertShop() {
      console.log(this.addShop);
      let res = await reqAddShop(this.addShop.name, this.addShop.image, this.addShop.place);
      console.log(res);
      this.addShop.name = '';
      this.addShop.place = '';
      this.addShop.image = '';
      this.isAddShop = false;
    },
    calAccount() {
      if (this.goodRecord.price > 0 && this.goodRecord.quantity > 0) {
        this.goodRecord.account = this.goodRecord.price * this.goodRecord.quantity;
      }
    }
  }
}
</script>

<style scoped>

</style>
