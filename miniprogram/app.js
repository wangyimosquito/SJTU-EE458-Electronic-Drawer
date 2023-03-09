// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1-4g0ps31k24288460',
      traceUser: true,
    });

    this.globalData = {};
  }
});