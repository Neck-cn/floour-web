<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入商铺名称"
      @search="searchData"
    />
    <van-row gutter="10">
      <van-col span="4">
        <van-pull-refresh v-model="shopsRefreshing" @refresh="onRefresh">
          <van-list
            v-model="shopsLoading"
            :finished="shopsFinished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="item in shops" :key="item" :title="item" @click="getDetail(item)"/>
          </van-list>
        </van-pull-refresh>
      </van-col>
      <van-col span="20">
        <van-row>
          <van-col span="12">
            <van-image width="100" height="100" :src="shop.image" />
          </van-col>
          <van-col span="12">
            <van-cell title="店铺名称" :value="shop.name" />
            <van-cell title="店铺位置" :value="shop.place" />
          </van-col>
        </van-row>
        <van-pull-refresh v-model="shopRecordsRefresh" @refresh="onRecordRefresh">
          <van-list
            v-model="shopRecordsLoading"
            :finished="shopRecordsFinished"
            finished-text="没有更多了"
            @load="onRecordLoad"
          >
            <van-cell-group v-for="item in shopRecords" :key="item.sid" >
              <van-cell title="名称" :value="item.sname" />
              <van-cell title="单价" :value="item.price" />
              <van-cell title="数量" :value="item.quantity" />
              <van-cell title="时间" :value="item.time" />
              <van-cell title="小计" :value="item.account" />
              <hr/>
            </van-cell-group>
          </van-list>
        </van-pull-refresh>
      </van-col>
    </van-row>
  </div>


</template>

<script>

export default {
  name: "SendGood",
  data() {
    return {
      value: "",
      shops: [],
      shopsLoading: false,
      shopsFinished: false,
      shopsRefreshing: false,
      shop:{
        sid:0,
        name:'ceshi',
        image:'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
        place:'ceshi'
      },
      shopRecords:[{
        gid:1,
        sid:1,
        sname:'ceshi',
        time:new Date().toDateString(),
        price:'ceshi',
        goods:'ceshi',
        quantity:'ceshi',
        account:'ceshi'
      }],
      shopRecordsLoading:false,
      shopRecordsFinished:false,
      shopRecordsRefresh:false,
    }
  }, methods: {
    searchData() {
      setTimeout(() => {
      }, 2500);
    },
    onLoad() {

      setTimeout(() => {
        if (this.shopsRefreshing) {
          this.shops = [];
          this.shopsRefreshing = false;
        }

        for (let i = 0; i < 10; i++) {
          this.shops.push(this.shops.length + 1);
        }
        this.shopsLoading = false;

        if (this.shops.length >= 40) {
          this.shopsFinished = true;
        }
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.shopsFinished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.shopsLoading = true;
      this.onLoad();
    },
    onRecordLoad() {
      setTimeout(() => {
        if (this.shopRecordsRefresh) {
          // this.shopRecords = [];
          this.shopRecordsRefresh = false;
        }

        for (let i = 0; i < 10; i++) {
          this.shopRecords.push(this.shopRecords[i]);
        }
        this.shopRecordsLoading = false;

        if (this.shopRecords.length >= 40) {
          this.shopRecordsFinished = true;
        }
      }, 1000);
    },
    onRecordRefresh() {
      // 清空列表数据
      this.shopRecordsFinished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.shopRecordsLoading = true;
      this.onLoad();
    },
    getDetail(item) {
      console.log(item);
    }
  }
}
</script>

<style scoped>

</style>
