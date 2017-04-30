/**
 * @file 微信小程序JSAPI
 * @author 崔健 cuijian03@baidu.com 2017.01.10
 */

/**
 * 百度地图微信小程序API类
 *
 * @class
 */
class BMapWX {

    /**
     * 百度地图微信小程序API类
     *
     * @constructor
     */
    constructor(param) {
        this.ak = param["ak"];
        this.ak2 = param["ak2"];
    }

    /**
     * 使用微信接口进行定位
     *
     * @param {string} type 坐标类型
     * @param {Function} success 成功执行
     * @param {Function} fail 失败执行
     * @param {Function} complete 完成后执行
     */
    getWXLocation(type, success, fail, complete) {
        type = type || 'gcj02',
            success = success || function () { };
        fail = fail || function () { };
        complete = complete || function () { };
        wx.getLocation({
            type: type,
            success: success,
            fail: fail,
            complete: complete
        });
    }

    /**
     * POI周边检索
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     *  
     */
    search(param) {
        var that = this;
        param = param || {};
        let searchparam = {
            query: param["query"] || '生活服务$美食&酒店',
            scope: param["scope"] || 1,
            filter: param["filter"] || '',
            coord_type: param["coord_type"] || 2,
            page_size: param["page_size"] || 10,
            page_num: param["page_num"] || 0,
            output: param["output"] || 'json',
            ak: that.ak,
            sn: param["sn"] || '',
            timestamp: param["timestamp"] || '',
            radius: param["radius"] || 2000,
            ret_coordtype: 'gcj02ll'
        };
        let otherparam = {
            iconPath: param["iconPath"],
            iconTapPath: param["iconTapPath"],
            width: param["width"],
            height: param["height"],
            alpha: param["alpha"] || 1,
            success: param["success"] || function () { },
            fail: param["fail"] || function () { }
        };
        let type = 'gcj02';
        let locationsuccess = function (result) {
            searchparam["location"] = result["latitude"] + ',' + result["longitude"];
            wx.request({
                url: 'https://api.map.baidu.com/place/v2/search',
                data: searchparam,
                header: {
                    "content-type": "application/json"
                },
                method: 'GET',
                success(data) {
                    let res = data["data"];
                    if (res["status"] === 0) {
                        let poiArr = res["results"];
                        // outputRes 包含两个对象，
                        // originalData为百度接口返回的原始数据
                        // wxMarkerData为小程序规范的marker格式
                        let outputRes = {};
                        outputRes["originalData"] = res;
                        outputRes["wxMarkerData"] = [];
                        for (let i = 0; i < poiArr.length; i++) {
                            outputRes["wxMarkerData"][i] = {
                                id: i,
                                latitude: poiArr[i]["location"]["lat"],
                                longitude: poiArr[i]["location"]["lng"],
                                title: poiArr[i]["name"],
                                iconPath: otherparam["iconPath"],
                                iconTapPath: otherparam["iconTapPath"],
                                address: poiArr[i]["address"],
                                telephone: poiArr[i]["telephone"],
                                alpha: otherparam["alpha"],
                                width: otherparam["width"],
                                height: otherparam["height"]
                            }
                        }
                        otherparam.success(outputRes);
                    } else {
                        otherparam.fail({
                            errMsg: res["message"],
                            statusCode: res["status"]
                        });
                    }
                },
                fail(data) {
                    otherparam.fail(data);
                }
            });
        }
        let locationfail = function (result) {
            otherparam.fail(result);
        };
        let locationcomplete = function (result) {
        };
        if (!searchparam["location"]) {
            that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
        } else {
            let longitude = searchparam.location.split(',')[1];
            let latitude = searchparam.location.split(',')[0];
            let errMsg = 'input location';
            let res = {
                errMsg: errMsg,
                latitude: latitude,
                longitude: longitude
            };
            locationsuccess(res);
        }
    }

    /**
     * sug模糊检索
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/place-suggestion-api
     */
    suggestion(param) {
        var that = this;
        param = param || {};
        let suggestionparam = {
            query: param["query"] || '',
            region: param["region"] || '全国',
            city_limit: param["city_limit"] || false,
            output: param["output"] || 'json',
            ak: that.ak,
            sn: param["sn"] || '',
            timestamp: param["timestamp"] || '',
            ret_coordtype: 'gcj02ll'
        };
        let otherparam = {
            success: param["success"] || function () { },
            fail: param["fail"] || function () { }
        };
        wx.request({
            url: 'https://api.map.baidu.com/place/v2/suggestion',
            data: suggestionparam,
            header: {
                "content-type": "application/json"
            },
            method: 'GET',
            success(data) {
                let res = data["data"];
                if (res["status"] === 0) {
                    otherparam.success(res);
                } else {
                    otherparam.fail({
                        errMsg: res["message"],
                        statusCode: res["status"]
                    });
                }
            },
            fail(data) {
                otherparam.fail(data);
            }
        });
    }

    /**
     * rgc检索（坐标->地点描述）
     *
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
     */
    regeocoding(param) {
        var that = this;
        param = param || {};
        let regeocodingparam = {
            coordtype: param["coordtype"] || 'gcj02ll',
            pois: param["pois"] || 0,
            output: param["output"] || 'json',
            ak: that.ak,
            sn: param["sn"] || '',
            timestamp: param["timestamp"] || '',
            ret_coordtype: 'gcj02ll',
            location: param["location"] || ''
        };
        let otherparam = {
            iconPath: param["iconPath"],
            iconTapPath: param["iconTapPath"],
            width: param["width"],
            height: param["height"],
            alpha: param["alpha"] || 1,
            success: param["success"] || function () { },
            fail: param["fail"] || function () { }
        };
        let type = 'gcj02';
        let locationsuccess = function (result) {
            regeocodingparam["location"] = result["latitude"] + ',' + result["longitude"];
            wx.request({
                url: 'https://api.map.baidu.com/geocoder/v2/',
                data: regeocodingparam,
                header: {
                    "content-type": "application/json"
                },
                method: 'GET',
                success(data) {
                    let res = data["data"];
                    if (res["status"] === 0) {
                        let poiObj = res["result"];
                        // outputRes 包含两个对象，
                        // originalData为百度接口返回的原始数据
                        // wxMarkerData为小程序规范的marker格式
                        let outputRes = {};
                        outputRes["originalData"] = res;
                        outputRes["wxMarkerData"] = [];
                        outputRes["wxMarkerData"][0] = {
                            id: 0,
                            latitude: result["latitude"],
                            longitude: result["longitude"],
                            address: poiObj["formatted_address"],
                            iconPath: otherparam["iconPath"],
                            iconTapPath: otherparam["iconTapPath"],
                            desc: poiObj["sematic_description"],
                            business: poiObj["business"],
                            alpha: otherparam["alpha"],
                            width: otherparam["width"],
                            height: otherparam["height"]
                        }
                        otherparam.success(outputRes);
                    } else {
                        otherparam.fail({
                            errMsg: res["message"],
                            statusCode: res["status"]
                        });
                    }
                },
                fail(data) {
                    otherparam.fail(data);
                }
            });
        };
        let locationfail = function (result) {
            otherparam.fail(result);
        }
        let locationcomplete = function (result) {
        };
        if (!regeocodingparam["location"]) {
            that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
        } else {
            let longitude = regeocodingparam.location.split(',')[1];
            let latitude = regeocodingparam.location.split(',')[0];
            let errMsg = 'input location';
            let res = {
                errMsg: errMsg,
                latitude: latitude,
                longitude: longitude
            };
            locationsuccess(res);
        }
    }

    /**
     * 地理编码
     * （地址 --> 坐标）
     * @author ys
     * 
     * @param {Object} param 检索配置
     * 参数对象结构可以参考
     * http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding
     */
    geocoding(param) {
        var that = this;
        param = param || {};
        let geocodingparam = {
            address: param["address"] || '', // 地址
            coordtype: param["coordtype"] || 'gcj02ll',
            output: param["output"] || 'json',
            ak: that.ak,
            sn: param["sn"] || '',
            timestamp: param["timestamp"] || '',
            ret_coordtype: 'gcj02ll',
        };
        let otherparam = {
            iconPath: param["iconPath"],
            iconTapPath: param["iconTapPath"],
            width: param["width"],
            height: param["height"],
            alpha: param["alpha"] || 1,
            success: param["success"] || function () { },
            fail: param["fail"] || function () { }
        };

        //
        let startGeocoding = function (e) {
            wx.request({
                url: 'https://api.map.baidu.com/geocoder/v2/',
                data: geocodingparam,
                header: {
                    "content-type": "application/json"
                },
                method: 'GET',
                success(data) {
                    let res = data["data"];
                    if (res["status"] === 0) {
                        let result = res["result"];
                        // outputRes 包含两个对象，
                        // originalData为百度接口返回的原始数据
                        // wxMarkerData为小程序规范的marker格式
                        let outputRes = {};
                        outputRes["originalData"] = res;
                        outputRes["wxMarkerData"] = [];
                        outputRes["wxMarkerData"][0] = {
                            id: 0,
                            latitude: result["location"]['lat'],
                            longitude: result["location"]['lng'],
                            address: geocodingparam["address"],
                            iconPath: otherparam["iconPath"],
                            iconTapPath: otherparam["iconTapPath"],
                            desc: '',
                            business: '',
                            alpha: otherparam["alpha"],
                            width: otherparam["width"],
                            height: otherparam["height"]
                        }
                        otherparam.success(outputRes);
                    } else {
                        otherparam.fail({
                            errMsg: res["message"],
                            statusCode: res["status"]
                        });
                    }
                },
                fail(data) {
                    otherparam.fail(data);
                }
            });
        };

        ////
        if (geocodingparam["address"] === '') { // 地址为空
            otherparam.fail({
                errMsg: '搜索地址为空',
                statusCode: 2 // 请求参数非法
            });
        } else {
            startGeocoding();
        }
    }

    /**
     * 天气检索
     *
     * @param {Object} param 检索配置
     */
    weather(param) {
        var that = this;
        param = param || {};
        let weatherparam = {
            coord_type: param["coord_type"] || 'gcj02',
            output: param["output"] || 'json',
            ak: that.ak,
            sn: param["sn"] || '',
            timestamp: param["timestamp"] || ''
        };
        let otherparam = {
            success: param["success"] || function () { },
            fail: param["fail"] || function () { }
        };
        let type = 'gcj02';
        let locationsuccess = function (result) {
            weatherparam["location"] = result["longitude"] + ',' + result["latitude"];
            wx.request({
                url: 'https://api.map.baidu.com/telematics/v3/weather',
                data: weatherparam,
                header: {
                    "content-type": "application/json"
                },
                method: 'GET',
                success(data) {
                    let res = data["data"];
                    if (res["error"] === 0 && res["status"] === 'success') {
                        let weatherArr = res["results"];
                        // outputRes 包含两个对象，
                        // originalData为百度接口返回的原始数据
                        // wxMarkerData为小程序规范的marker格式
                        let outputRes = {};
                        outputRes["originalData"] = res;
                        outputRes["currentWeather"] = [];
                        outputRes["currentWeather"][0] = {
                            currentCity: weatherArr[0]["currentCity"],
                            pm25: weatherArr[0]["pm25"],
                            date: weatherArr[0]["weather_data"][0]["date"],
                            temperature: weatherArr[0]["weather_data"][0]["temperature"],
                            weatherDesc: weatherArr[0]["weather_data"][0]["weather"],
                            wind: weatherArr[0]["weather_data"][0]["wind"]
                        };
                        otherparam.success(outputRes);
                    } else {
                        otherparam.fail({
                            errMsg: res["message"],
                            statusCode: res["status"]
                        });
                    }
                },
                fail(data) {
                    otherparam.fail(data);
                }
            });
        }
        let locationfail = function (result) {
            otherparam.fail(result);
        }
        let locationcomplete = function (result) {
        }
        if (!weatherparam["location"]) {
            that.getWXLocation(type, locationsuccess, locationfail, locationcomplete);
        } else {
            let longitude = weatherparam.location.split(',')[0];
            let latitude = weatherparam.location.split(',')[1];
            let errMsg = 'input location';
            let res = {
                errMsg: errMsg,
                latitude: latitude,
                longitude: longitude
            };
            locationsuccess(res);
        }
    }


    /**
     * 静态图
     * 
     * @author ys
     *
     * @param {Object} param 检索配置
     * http://lbsyun.baidu.com/index.php?title=static
     */
    getStaticImage(param) {
        var that = this;
        param = param || {};
        let staticimageparam = {
            ak: that.ak2,
            width: param["width"] || 400,
            height: param["height"] || 300,
            center: param["center"] || '北京', // 地址或者经纬度
            scale: param["scale"] || 1, // 是否为高清图 返回图片大小会根据此标志调整。取值范围为1或2。 1表示返回的图片大小为size= width *height; 2表示返回图片为(width*2)*(height *2)，且zoom加1  注：如果zoom为最大级别，则返回图片为（width*2）*（height*2），zoom不变。
            zoom: param["zoom"] || 11, //高清图范围[3, 18]；0低清图范围[3,19]
            copyright: param["copyright"] || 1, // 0表示log+文字描述样式，1表示纯文字描述样式
            markers: param["markers"] || null, // 标注，可通过经纬度或地址/地名描述；多个标注之间用竖线分隔
        };
        return "http://api.map.baidu.com/staticimage/v2?" + "ak=" + staticimageparam["ak"] + "&width=" + staticimageparam["width"] + "&height=" + staticimageparam["height"] + "&center=" + staticimageparam["center"] + "&zoom=" + staticimageparam["zoom"] + "&scale=" + staticimageparam["scale"] + "&copyright=" + staticimageparam["copyright"];
    }
}

module.exports.BMapWX = BMapWX;