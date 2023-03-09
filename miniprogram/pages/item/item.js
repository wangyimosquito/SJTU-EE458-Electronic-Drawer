// pages/item/item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gridList: [
      {"id":1, "name":"服饰","url":"/images/clothes.png"},
      {"id":2, "name":"食品","url":"/images/food.png"},
      {"id":3, "name":"药品","url":"/images/medicine.png"},
      {"id":4, "name":"数码","url":"/images/3C.png"},
      {"id":5, "name":"化妆品","url":"/images/cosmetics.png"},
      {"id":6, "name":"书籍","url":"/images/book.png"},
      {"id":7, "name":"证件","url":"/images/card.png"},
      {"id":8, "name":"宠物","url":"/images/pet.png"},
      {"id":9, "name":"运动","url":"/images/sports.png"},
    ],
    buttons: [
      { text: '取消' },
      { text: '确认' }
    ]
  },

  // 跳转到添加物品页面
  gotoAdd() {
    wx.navigateTo({
      url: '/pages/add/add'
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