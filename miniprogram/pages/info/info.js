// pages/info/info.js

const DB = wx.cloud.database().collection("items")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    query: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    DB.where({
        type: options.title
      })
      .get({
        success: function (res) {
          console.log(res.data)
          that.setData({
            items: res.data
          })
        }
      })
    this.setData({
      query: options
    })
  },

  slideButtonTap(e) {
    let _this = this
    console.log('slide button tap', e.detail)
    if (e.detail.index == 0) {
      // console.log('修改');
      // console.log(e.detail.data)
      // 跳转修改页面
      var data = JSON.stringify(e.detail.data)
      wx.navigateTo({
        url: '/pages/edit/edit?data=' + data
      })
    } else if (e.detail.index == 1) {
      // console.log('删除');
      // console.log(e.detail.data._id)
      // 删除 item 条目
      DB.doc(e.detail.data._id).remove({
        success: function (res) {
          console.log(res.data)
          // 刷新页面时需要传入title，否则无法重新读取数据库
          _this.onLoad(_this.data.query)
        }
      })
    }
  },

  buttonTap(e) {
    console.log('button tap', e)
    // 跳转修改页面
    var data = JSON.stringify(e.currentTarget.dataset.product)
    wx.navigateTo({
      url: '/pages/edit/edit?data=' + data
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.query.title,
    })
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