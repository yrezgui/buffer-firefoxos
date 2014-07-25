(function () {
  'use strict';

  var mod = angular.module('components.bufferApi', []);

  mod.factory('BufferApi', ['$http', 'Config', 'DSCacheFactory', '$q', 'OAuth', '$stateParams', '$window', 'Utils', function BufferApi($http, Config, DSCacheFactory, $q, OAuth, $stateParams, $window, Utils) {

    var dataCache = DSCacheFactory('BufferApi', {
      deleteOnExpire: 'aggressive',
      maxAge: 3600000,
      storageMode: 'localStorage'
    });

    function makeRequest(method, endpoint, forceRefresh, params, data, noCache) {

      var cachedResource = dataCache.get(method + ' ' + endpoint);

      if(cachedResource && !forceRefresh && !noCache) {
        return $q.when(cachedResource);
      }

      var defaultParameters = {
        access_token: OAuth.getAccessToken()
      };

      return $http({
        method: method,
        url: Config.BUFFER_API_URL + endpoint + '.json',
        params: _.extend(defaultParameters, params),
        data: data
      }).then(
        function success(response) {
          if(noCache) {
            return response.data;
          }

          cachedResource = dataCache.put(method + ' ' + endpoint, response.data);

          return cachedResource;
        },
        function fail() {
          if(noCache) {
            return null;
          }

          return cachedResource;
        }
      );
    }

    function getConfiguration(forceRefresh) {
      return makeRequest('GET', 'info/configuration', forceRefresh);
    }

    function getUser(forceRefresh) {
     return makeRequest('GET', 'user', forceRefresh);
    }

    function getProfiles(forceRefresh) {
     return makeRequest('GET', 'profiles', forceRefresh);
    }

    function getPendingUpdates(id, forceRefresh) {
     return makeRequest('GET', 'profiles/' + id + '/updates/pending', forceRefresh);
    }

    function getSentUpdates(id, forceRefresh) {
     return makeRequest('GET', 'profiles/' + id + '/updates/sent', forceRefresh);
    }

    function getInteractions(id, forceRefresh) {
     return makeRequest('GET', 'profiles/' + id + '/interactions', forceRefresh);
    }

    function getProfileById(id, defaultProfile, forceRefresh) {
      return getProfiles(forceRefresh).then(function success(profiles) {
        if(defaultProfile) {
          return _.find(profiles, { '_id': id }) || profiles[0];
        } else {
          return _.find(profiles, { '_id': id }) || null;
        }
      });
    }

    function getCurrentProfile(forceRefresh) {
      return getProfileById($stateParams.profileId, true, forceRefresh);
    }

    function shareNow(id) {
      return makeRequest('POST', 'updates/' + id + '/share', true, null, null, true);
    }

    function deleteStatus(id) {
      return makeRequest('POST', 'updates/' + id + '/destroy', true, null, null, true);
    }

    return {
      getConfiguration: getConfiguration,
      getUser: getUser,
      getProfiles: getProfiles,
      getPendingUpdates: getPendingUpdates,
      getSentUpdates: getSentUpdates,
      getInteractions: getInteractions,
      getProfileById: getProfileById,
      getCurrentProfile: getCurrentProfile,
      shareNow: shareNow,
      deleteStatus: deleteStatus
    };
  }]);

}());