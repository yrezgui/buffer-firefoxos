(function () {
  'use strict';

  var mod = angular.module('components.utils', []);

  mod.factory('Utils', ['$window', function Utils($window) {

    function stringify(obj, prefix) {
      var str = [];

      for(var p in obj) {
        var k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];
        str.push(typeof v == 'object' ?
          stringify(v, k) :
          encodeURIComponent(k) + '=' + encodeURIComponent(v));
      }

      return str.join('&');
    }

    function objectToFormData(data) {
      var formData  = new $window.FormData();

      for(var i in data) {
        if(_.isArray(data[i])) {

          for(var k in data[i]) {
            formData.append(i + '[]', data[i][k]);
          }

        } else if(_.isObject(data[i])) {

          for(var j in data[i]) {
            formData.append(i + '[' + j + ']', data[i][j]);
          }

        } else {
          formData.append(i, data[i]);
        }
      }

      return formData;
    }

    return {
      stringify: stringify,
      objectToFormData: objectToFormData
    };
  }]);

}());