// pages/remind/remind.js

const DB = wx.cloud.database().collection("items");
var item_res_day = {}; //存放有保质期物品和其余下能够使用的天数
var item_name_list = {}; //存放有保质期物品的名称
var item_id_list = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: [], //用户数据库数据
    Y: 0, //当前日期
    M: 0, //当前月份
    D: 0, //当前日期
    res_day: [], //剩余天数降序排列
    res_item: [] //剩余天数物品名称降序排列
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  //日期格式转换
  getDate(wxDate) {
    var timestamp = Date.parse(wxDate);
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var y = date.getFullYear();
    var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return [Number(y), Number(m), Number(d)];
  },
  // 计算某年某月天数
  diffDay(year, month) {
    if (month === 2) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
      return 30;
    } else {
      return 31;
    }
  },

  // 计算某个日期n天之后的日期
  diffDate(nDate, nDay) {
    let y = nDate.getFullYear();
    let m = nDate.getMonth() + 1;
    let d = nDate.getDate();
    while (nDay) {
      var getday = this.diffDay(y, m);
      if ((d + nDay) <= getday) {
        d += nDay;
        break;
      } else {
        m++;
        nDay = nDay - (getday - d)
        d = 0;
        if (m > 12) {
          y++;
          m = 1;
        }
      }
    }
    // 重新设置时间
    let newDate = new Date();
    newDate.setFullYear(y);
    newDate.setMonth(m - 1);
    newDate.setDate(d);
    return newDate;
  },

  slideButtonTap(e) {
    let _this = this
    console.log('slide button tap', e.detail.data.id)
    // 删除 item 条目
    DB.doc(e.detail.data.id).remove({
      success: function (res) {
        console.log(res.data)
        // 刷新页面
        _this.onShow()
      }
    })

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
    var that = this
    DB.get({
      success(res) {
        //console.log("success", res.data)
        that.setData({
          userData: res.data
        })
        console.log("success", that.data.userData)
        //获取当前日期
        let y, m, d;
        [y, m, d] = that.getDate(new Date())
        that.setData({
          Y: y,
          M: m,
          D: d
        })
        //清空变量
        item_name_list = {}
        item_res_day = {}
        item_id_list = {}

        //对数据库中所有存在保质期的物品都计算过期倒计时天数
        for (var i = 0; i < that.data.userData.length; i++) {
          if (that.data.userData[i].expiration_date != -1) {
            let CurrY, CurrM, CurrD;
            [CurrY, CurrM, CurrD] = that.getDate(that.data.userData[i].produce_day)
            let exp_date = that.diffDate(that.data.userData[i].produce_day, that.data.userData[i].expiration_date)
            let this_day = Date.parse(new Date())
            let res_day = Math.floor((exp_date - this_day) / (1000 * 60 * 60 * 24))
            // item_res_day[that.data.userData[i].name] = res_day
            item_res_day[i] = res_day
            item_name_list[i] = that.data.userData[i].name
            item_id_list[i] = that.data.userData[i]._id
            //console.log("res_day: ", res_day)
            //console.log("exp day: ", exp_day, "produce day: ", that.data.userData[i].produce_day, "exp dates:", that.data.userData[i].expiration_date)
          }
        }
        console.log(item_res_day)
        let res_day_tmp = []
        let res_item_tmp = []
        for (var key in item_res_day) {
          let ins_index = 0
          for (var i = 0; i < res_day_tmp.length; i++) {
            if (res_day_tmp[i] > item_res_day[key]) {
              break
            } else {
              ins_index += 1
            }
          }
          res_day_tmp.splice(ins_index, 0, item_res_day[key])
          res_item_tmp.splice(ins_index, 0, {
            "name": item_name_list[key],
            "id": item_id_list[key]
          })
        }
        that.setData({
          res_day: res_day_tmp,
          res_item: res_item_tmp
        })
        // console.log("res_day", that.data.res_day)
        // console.log("res_item", that.data.res_item)


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