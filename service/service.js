var app = getApp();

function getWeather(cityName, callback) {
    if (!cityName) {
        getCityName().then(cityName => {
            loadWeather(cityName, callback);
        })
    } 
    else {
        loadWeather(cityName, callback)
    }
}


// 获取城市名
function getCityName() {
    return new Promise((resolve, reject) => {
        getCurrentLocation().then((arr) => {
            var baiduApi = "https://api.map.baidu.com/geocoder/v2/";
            var cityName = "北京";
            wx.request({
                url: baiduApi,
                data: {
                    "location": arr[0] + "," + arr[1],
                    "output": "json",
                    "pois": 1,
                    "ak": "FE682f52d5170f3f11d267ec0b9ae2f1"
                },
                success: function (res) {
                    // console.log(JSON.stringify(res)+"aaaaaaaaaaaa")
                    cityName = res.data.result.addressComponent.city
                },
                complete: function () {
                    resolve(cityName);
                },
                fail: function () {
                    console.log('地点调取失败');
                }

            })
        })
    });
    
}

/* 获取位置并通过回调函数将位置信息返回
  -回调函数返回两个值：
    第一个 latitude 纬度
    第二个 longitude 经度
*/
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        var latitude = 40.1246996852;
        //经度
        var longitude = 116.673182721;
        wx.getLocation({
            success(res) {
                latitude = res.latitude
                longitude = res.longitude
            },
            complete: function () {
                resolve([latitude, longitude])
            },
            fail: function () {
                console.log('经纬度调取失败');
            }
        })
    });
}

function loadWeather(cityName,callback) {
    //根据城市名来加载天气信息
    var weAPI = "https://free-api.heweather.com/v5/weather";
    wx.request({
        url: weAPI,
        data: {
            city: cityName,
            key: "e89507ba43dc4befb6be471af22372e9"
        },
        success: function (res) {
            /*
              提取数据
              状态 status
              城市 city
              日期 date
              更新时间 upTime
              温度 temp
              描述 desc
              各种指数 suggestion
            */
            var wt = res.data.HeWeather5[0]
            var wData = {
                status: "error"
            }
            // //判断数据是否加载成功
            if (wt.status == "ok") {
                //解析数据
                wData = {
                    status: "ok",
                    city: wt.basic.city,
                    date: formatDate(),
                    upTime: wt.basic.update.loc.slice(-5),
                    temp: wt.now.tmp,
                    desc: wt.now.cond.txt,
                    suggestion: wt.suggestion
                }
            }
            // console.log(wData);
            // 回调地狱
            callback && callback(wData)

        },
        fail: function() {
            console.log('天气调取失败');
        }
    })
}
var dayArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

//创建一个函数，对指定的日期进行格式化
//需要一个日期对象作为参数，返回一个字符串
//例如10月22日 周日
function formatDate(dt) {
    //判断dt是否存在
    if (!dt) {
        dt = new Date()
    }
    //获取月份
    var m = dt.getMonth() + 1
    //获取日期
    var d = dt.getDate()
    //获取星期
    var day = dt.getDay()

    return m + "月" + d + "日" + dayArr[day]

}

//暴露接口
module.exports = { getWeather: getWeather } 

