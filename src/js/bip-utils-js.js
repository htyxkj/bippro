import axios from 'axios'
import qs from 'qs'
// import $ from 'jquery'
export default {
  install (Vue, options) {
    Vue.prototype.getDataByAPI = function (posParams) {
      var returnobj = null
      axios.post(global.BIPAPIURL, qs.stringify(posParams))
        .then(function (res) {
          if (res.data.id === 0) {
            returnobj = res.data
            console.log(returnobj)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
      return returnobj
    }

    Vue.prototype.getDataByAPINew = function (posParams,success,error) {
      var returnobj = null
      axios.post(global.BIPAPIURL, qs.stringify(posParams))
        .then(success)
        .catch(error)
      return returnobj
    }

    Vue.prototype.getUserInfo = function () {
      return JSON.parse(window.localStorage.getItem('user'))
    }

    Vue.prototype.tableDataRef = function (layoutCel, vdatas) {
      for (var i = 0; i < layoutCel.cels.length; i++) {
        var cel = layoutCel.cels[i]
        if (cel.refValue) {
          var assits = this.tableAssist(cel.refValue, '')
          if (assits.code === 1) {
            for (var j = 0; j < vdatas.celData.length; j++) {
              var data = vdatas.celData[j]
              var _indata = data[i]
              for (var k = 0; k < assits.values.length; k++) {
                var _refdata = assits.values[k]
                if (_indata === _refdata[0]) {
                  data[i] = _refdata[1]
                  vdatas.celData[j] = data
                }
              }
            }
          }
        }
      }
      return vdatas
    }

    Vue.prototype.tableAssist = function (assistid, cont) {
      console.log(assistid)
      if (assistid.indexOf(';') >= 0) {
        var strs = assistid.split(';')
        var assistObj = { 'code': 1, 'values': [] }
        for (var i = 0; i < strs.length; i++) {
          var val = strs[i].split(':')
          assistObj.values.push(val)
        }
        return assistObj
      }
      var returnobj = JSON.parse(window.localStorage.getItem(assistid))
      // if (!returnobj && returnobj !== '{&DATETIME}') {
      //   var usercode = JSON.parse(window.localStorage.getItem('user')).userCode
      //   $.ajax({
      //     type: 'post',
      //     url: global.BIPAPIURL,
      //     data: {'dbid': global.DBID, 'usercode': usercode, 'apiId': 'assist', 'assistid': assistid, 'cont': cont},
      //     contentType: 'application/x-www-form-urlencoded',
      //     dataType: 'json',
      //     async: false,
      //     success: function (data) {
      //       returnobj = data
      //       if (data.code > -1) {
      //         window.localStorage.setItem(assistid, JSON.stringify(returnobj))
      //       }
      //     }
      //   })
      // }
      return returnobj
    }

    Vue.prototype.getAssist = function (rfid,code,success,error){
      var data1 = {
        'dbid': global.DBID,
        'usercode': JSON.parse(window.localStorage.getItem('user')).userCode,
        'apiId': global.APIID_AID,
        'assistid': rfid,
        'cont': code
      };
      this.getAssistBySync(data1,success,error);
    }
    Vue.prototype.getAssistBySync = function (posParams,success,error) {
      var returnobj = null
      axios.post(global.BIPAPIURL, qs.stringify(posParams))
        .then(success)
        .catch(error)
      return returnobj;
    }

    Vue.prototype.base64Encode = function (password) {
      var pwd = encodeURIComponent(password)
      pwd = unescape(pwd)
      pwd = window.btoa(pwd)
      return pwd
    }

    Vue.prototype.uuid = function () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    }
  }
}
