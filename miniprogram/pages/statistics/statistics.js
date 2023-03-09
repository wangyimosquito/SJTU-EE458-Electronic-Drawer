// pages/statistics/statistics.js

const DB = wx.cloud.database().collection("items");
var wxCharts = require('../../utils/wxcharts.js');
var pieChart = null;
var lineChart = null;
var typeDic = {"食品": 0, "药品": 1, "服饰": 2, "数码": 3, "化妆品": 4, "书籍": 5, "证件": 6, "宠物": 7, "运动": 8};
var type = ['食品', '药品','服饰','数码','化妆品','书籍','证件','宠物','运动'];
var itemNum = [];//存放每种物品件数统计
var pieItem = []; //饼状图所需数据
var itemExpense = []; //每种物品消费金额

Page({
  data: {
    userData: [], //用户所有物品数据Handler
  },
    // 跳转到添加物品页面
    gotoMonth() {
      wx.navigateTo({
        url: '../../pages/month/month'
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log("static onReady...")
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("static onShow...")
    var that = this
    DB.get({
      success(res) {
        //更新读取数据
        that.setData({
          userData: res.data
        })
        console.log("success", that.data.userData)
        itemNum = []
        itemExpense = []
        for (var i = 0; i < 9; i++) {
          itemNum.push(0)
          itemExpense.push(0)
        }
        //统计各类物品件数和总消费金额
        for(var i = 0; i<that.data.userData.length;i++){
          itemNum[typeDic[that.data.userData[i].type]] += 1
          itemExpense[typeDic[that.data.userData[i].type]] += that.data.userData[i].price
        }

      //获取最高物品金额
      var max_item_Expense = 0
      for(var i=0;i<itemExpense.length;i++){
        if(itemExpense[i] > max_item_Expense){
          max_item_Expense = itemExpense[i]
        }
      }
      //获取屏幕数据
      var windowWidth = '', windowHeight='';    //定义宽高
      try {
        var res = wx.getSystemInfoSync();    //试图获取屏幕宽高数据
        windowWidth = res.windowWidth / 750 * 690;   //以设计图750为主进行比例算换
        windowHeight = res.windowWidth / 750 * 550;
        // windowWidth = res.windowWidth ;   //以设计图750为主进行比例算换
        // windowHeight = res.windowHeight/2;
        console.log("屏幕宽度：", windowWidth)    //以设计图750为主进行比例算换
      } catch (e) {
        console.error('getSystemInfoSync failed!');   //如果获取失败
      }
    //物品总金额柱状图
    lineChart = new wxCharts({     //定义一个wxCharts图表实例
      canvasId: 'lineCanvas',     //输入wxml中canvas的id
      type: 'column',       //图标展示的类型有:'line','pie','column','area','ring','radar'
      categories: type,    //模拟的x轴横坐标参数
      animation: true,  //是否开启动画
      series: [{   //具体坐标数据
        name: '物品总金额',  //名字
        data: itemExpense,  //数据点
        format: function (val, name) {  //点击显示的数据注释
          return val;
        }
      }
      ],
      xAxis: {   //是否隐藏x轴分割线
        disableGrid: true,
      },
      yAxis: {      //y轴数据
        title: '金额',  //标题
        format: function (val) {  //返回数值
          return val;
        },
        min: 0,   //最小值
        max: max_item_Expense + 10,   //最大值
        gridColor: '#60c0dd'
      },
      width: windowWidth,  //图表展示内容宽度
      height: windowHeight,  //图表展示内容高度
      dataLabel: true,  //是否在图表上直接显示数据
      dataPointShape: true, //是否在图标上显示数据点标志
    });

    // setTimeout(function () {
    //饼状图所需数据
    pieItem = []
    for(var i = 0;i<itemNum.length;i++){
      pieItem.push({
        name:type[i], 
        data: itemNum[i]})
    }
    console.log("pie Item: ", pieItem)
    //物品总件数饼状图
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: pieItem,
      width: windowWidth,
      height: 300,
      dataLabel: true})
    },
    fail(res) {
      console.log("fail", res)
    }
    })
},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("static onHide...")
    pieChart = null;
    lineChart = null;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log("static onUnload...")
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