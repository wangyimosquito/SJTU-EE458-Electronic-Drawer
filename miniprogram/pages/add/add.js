// pages/add/add.js
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

    positions: ["客厅", "卧室", "卫生间", "书房", "厨房", "阳台", "衣帽间", "玄关", "车库", "冰箱"],
    positionIndex: 0,

    files: [],
    notes: "",

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

  // 添加物品
  addHandler() {
    if (this.data.name != "") {
      if (!this.data.needExpiration) {
        this.setData({
          expiration_date: -1
        })
      }
      DB.add({
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
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取今天的日期
    const date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const formatNumber = (n) => {
      const s = n.toString()
      return s[1] ? s : '0' + s
    }

    this.setData({
      purchase_day: [year, month, day].map(formatNumber).join('-'),
      produce_day: [year, month, day].map(formatNumber).join('-')
    })

    this.setData({
      selectFile: this.selectFile.bind(this),
      uploadFile: this.uploadFile.bind(this)
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: res.tempFilePaths
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('select files', files)
    // 返回false可以阻止某次文件上传
  },
  uploadFile(files) {
    console.log('upload files', files)
    let that = this;
    const filePath = files.tempFilePaths[0]
    const name = 'item-' + parseInt(Math.random() * 100000000);
    const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath, // 上传至云端的路径
        filePath, // 小程序临时文件路径
        success: (res) => {
          // 返回文件 ID，需要转换成 url
          wx.cloud.getTempFileURL({
            fileList: [res.fileID],
            success(res) {
              console.log("getTempFileURL: ", res);
              that.setData({
                photo_path: res.fileList[0].tempFileURL
              })
              var urls = [res.fileList[0].tempFileURL]
              resolve({
                urls
              })
            }
          })
        },
        fail: res => {
          console.error('[上传文件] 失败：', res)
        }
      })
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },

  // 图片地址: fileID 转 https
  fileIDToHttps(url) {
    let res = url;
    if (url.indexOf("cloud://") === 0) {
      const first = url.indexOf(".");
      const end = url.indexOf("/", first);
      console.log(first)
      console.log(end)
      res =
        "https://" +
        url.slice(first + 1, end) +
        ".tcb.qcloud.la/" +
        url.slice(end + 1, url.length);
    }
    return res;
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