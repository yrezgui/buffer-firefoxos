(function () {
  'use strict';

  var mod = angular.module('components.notifications', []);

  mod.factory('Notifications', ['$window', function Notifications($window) {

    function create(title, body, icon) {

      return new Notification(title, {
        body: body,
        icon: icon || '/img/buffer-icon-32.png'
      });
    }

    return {
      create: create
    };
  }]);

}());