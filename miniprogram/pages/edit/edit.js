// pages/edit/edit.js
const DB = wx.cloud.database().collection("items")

Page({

  /**
   * 页面的初始数据
   */

  data: {
    name: "",
    price: 0,
    purchase_day: "2016-09-01",
    needExpiration: false,
    produce_day: "2016-09-01",
    expiration_date: 0,
    photo_path: "",

    types: ["服饰", "食品", "药品", "数码", "化妆品", "书籍", "证件", "宠物", "运动"],
    typeIndex: 0,

    positions: ["客厅", "卧室", "卫生间", "书房", "厨房", "阳台"],
    positionIndex: 0,

    files: [],
    notes: "",
    id: "",
  },

  // 名称变更事件
  inputNameChange(e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },

  // 价格变更事件
  inputPriceChange(e) {
    console.log(e)
    this.setData({
      price: e.detail.value
    })
  },

  // 保质期变更事件
  inputExpirationDateChange(e) {
    console.log(e)
    this.setData({
      expiration_date: e.detail.value
    })
  },

  // 备注变更事件
  inputNotesChange(e) {
    console.log(e)
    this.setData({
      notes: e.detail.value
    })
  },

  // 生产日期绑定事件
  bindProduceDayChange: function (e) {
    this.setData({
      produce_day: e.detail.value
    })
  },

  // 购买日期绑定事件
  bindPurchaseDayChange: function (e) {
    this.setData({
      purchase_day: e.detail.value
    })
  },

  // 类别变化事件
  bindTypeChange: function (e) {
    console.log('picker type 发生选择改变，携带值为', e.detail.value);
    this.setData({
      typeIndex: e.detail.value
    })
    if (e.detail.value == 1 || e.detail.value == 2 || e.detail.value == 4) {
      this.setData({
        needExpiration: true
      })
    } else {
      this.setData({
        needExpiration: false
      })
    }
  },

  // 位置变化事件
  bindPositionChange: function (e) {
    console.log('picker position 发生选择改变，携带值为', e.detail.value);
    this.setData({
      positionIndex: e.detail.value
    })
  },

  // 修改
  editHandler() {
    if (this.data.name != "") {
      if (!this.data.needExpiration) {
        this.setData({
          expiration_date: -1
        })
      }
      console.log(this.data.id)
      DB.doc(this.data.id).update({
        data: {
          name: this.data.name,
          price: parseFloat(this.data.price),
          type: this.data.types[this.data.typeIndex],
          position: this.data.positions[this.data.positionIndex],
          purchase_day: new Date(this.data.purchase_day),
          produce_day: new Date(this.data.produce_day),
          expiration_date: parseInt(this.data.expiration_date),
          photo_path: this.data.photo_path,
          needExpiration: this.data.needExpiration,
          typeIndex: parseInt(this.data.typeIndex),
          positionIndex: parseInt(this.data.positionIndex),
          purchase_day_str: this.data.purchase_day,
          produce_day_str: this.data.produce_day,
          notes: this.data.notes
        },
        success(res) {
          console.log("success", res)
        },
        fail(res) {
          console.log("fail", res)
        }

      })
    }
    wx.navigateBack({
      delta: 2
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.data)
    var data = JSON.parse(options.data)
    this.setData({
      name: data.name,
      price: data.price,
      purchase_day: data.purchase_day_str,
      needExpiration: data.needExpiration,
      produce_day: data.produce_day_str,
      expiration_date: data.expiration_date,
      photo_path: data.photo_path,
      typeIndex: data.typeIndex,
      positionIndex: data.positionIndex,
      id: data._id,
      notes: data.notes
    })
    if (data.photo_path != "") {
      this.setData({
        files: [{
          url: data.photo_path,
        }]
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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