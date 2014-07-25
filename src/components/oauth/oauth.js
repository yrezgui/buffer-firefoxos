(function () {
  'use strict';

  var mod = angular.module('components.oauth', []);

  mod.factory('OAuth', ['Config', '$http', '$window', 'LocalStorage', 'Utils', '$state', function OAuth(Config, $http, $window, LocalStorage, Utils, $state) {

    function isConnected() {
      return !!LocalStorage.get(Config.TOKEN_KEY);
    }

    function authorize() {
      if(isConnected()) {
        return $state.go('profile');
      }
    }

    function getConnectUrl() {
      return Config.CONNECT_URL +
              '?client_id=' + Config.BUFFER_CLIENT_ID +
              '&redirect_uri=' + Config.REDIRECT_URI +
              '&response_type=code';
    }

    function exchangeAccessToken(code) {
      return $http({
        method: 'POST',
        url: Config.EXCHANGE_OAUTH_CODE_URL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: Utils.stringify({code: code})
      }).then(
        function success(response) {
          LocalStorage.set(Config.TOKEN_KEY, response.data.access_token);
          return response;
        },
        function fail(response) {
          return response;
        }
      );
    }

    function getCode() {
      var uriArguments = ($window.location.search || $window.location.hash).split('=') || [];

      if(uriArguments.length && uriArguments[0] !== '') {
        return uriArguments[uriArguments.length - 1];
      } else {
        return null;
      }
    }

    function getAccessToken() {
      return LocalStorage.get('accessToken');
    }

    function logout() {
      if($window.confirm('Do you want to sign out?')) {
        return LocalStorage.clear();
      }
    }

    return {
      isConnected: isConnected,
      authorize: authorize,
      getConnectUrl: getConnectUrl,
      exchangeAccessToken: exchangeAccessToken,
      getCode: getCode,
      getAccessToken: getAccessToken,
      logout: logout
    };
  }]);

}());