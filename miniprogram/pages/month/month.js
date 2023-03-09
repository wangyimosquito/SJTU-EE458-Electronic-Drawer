
const DB = wx.cloud.database().collection("items");
var wxCharts = require('../../utils/wxcharts.js');
var typeDic = {"食品": 0, "药品": 1, "服饰": 2, "数码": 3, "化妆品": 4, "书籍": 5, "证件": 6, "宠物": 7, "运动": 8};
var type = ['食品', '药品','服饰','数码','化妆品','书籍','证件','宠物','运动'];
var Month_item = [];//存放某月份物品
var totalExpense = null; //总月消费金额
var Month_item_num = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: [],
    total_expense: 0,
    month_item: [],
    month_item_date: [],
    Month_item_num: 0,
    select:false,
    grade_name:'最近1个月',
    grades: [
      '最近1个月',
      '最近3个月',
      '最近半年'
     ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  //日期格式转换
    getDate(wxDate){
      var timestamp = Date.parse(wxDate);
      timestamp = timestamp / 1000;
      var n = timestamp * 1000;
      var date = new Date(n);
      var y = date.getFullYear();
      var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return [Number(y), Number(m), Number(d)];
    },
    //获取某一月份购买物品
    getItem(month, year){
      var that = this
      var item = []
      for(var i=0;i<that.data.userData.length;i++){
        let y,m,d;
        [y,m,d] = that.getDate(that.data.userData[i].purchase_day)
        if(m == month && y == year){
          item.push(that.data.userData[i])
        }
      }
      return item
    },
    //统计当前月份消费总金额
    getExpense(itemList){
      var sum = 0
      for(var i=0;i<itemList.length;i++){
        sum += itemList[i].price
      }
      return sum
    },

    //下拉框选择
    bindShowMsg() {
      this.setData({
      select: !this.data.select
      })
    },

    //已选下拉框
    mySelect(e) {
      //e.detail.value是选择的index
      // console.log("这是e值:", e)
      var name = this.data.grades[e.detail.value]
      this.setData({
      grade_name: name,
      select: false
      })
       //更新选中列表
       let Y, M, D 
       [Y,M,D] = this.getDate(new Date())
       switch(this.data.grade_name){
         case '最近1个月' : Month_item = this.getItem(Number(M), Number(Y)); break;
         case '最近3个月' : Month_item = []; 
                           for (let i =0;i<3;i++){
                             if(Number(M) - i > 0){
                             let tmp = Month_item ;
                             Month_item = tmp.concat(this.getItem(Number(M)-i ,  Number(Y)));}
                             else{
                            let tmp = Month_item
                             Month_item = tmp.concat(this.getItem(12-(Number(M)-i) ,  Number(Y)-1));}
                             }
                           break;
         case '最近半年' : Month_item = [];
                           for (let i =0;i<6;i++){
                             if(Number(M) - i > 0){
                            let tmp = Month_item;
                             Month_item = tmp.concat(this.getItem(Number(M)-i ,  Number(Y)));}
                             else{
                            let tmp = Month_item;
                             Month_item = tmp.concat(this.getItem(12-(Number(M)-i) ,  Number(Y)-1));}
                             }
                           break;
       }
       // Month_item = that.getItem(Number(M))
       // totalExpense = that.getExpense(Month_item)
       totalExpense = this.getExpense(Month_item)
       this.setData({
         total_expense: totalExpense,
         month_item: Month_item,
         Month_item_num: Month_item.length
       })
      //  console.log("month item: ", this.data.month_item)
      //  console.log("total expense: ", this.data.total_expense)
       //刷新页面
       this.onLoad()
    },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var that = this
    DB.get({
      success(res) {
        //console.log("success", res.data)
        that.setData({
          userData: res.data
        })
        console.log("success", that.data.userData)
      },
      fail(res) {
        console.log("fail", res)
      }
    })
    //获取当前月份
    let Y, M, D 
    [Y,M,D] = that.getDate(new Date())
    //等待数据库读取
    setTimeout(function () {
      Month_item = that.getItem(Number(M), Y)
      totalExpense = that.getExpense(Month_item)
      that.setData({
        total_expense: totalExpense,
        month_item: Month_item,
        Month_item_num: Month_item.length
      })
   }, 500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  //初始化所有物品
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})