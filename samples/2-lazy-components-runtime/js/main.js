require.config({
  baseUrl: 'js',
  paths: {
    'angular-detour': '/dist/angular-detour.amd',
    'angular': '/dist/dependencies/angular'
  }
});

require( [
  'app'
], function(app) {
  'use strict';
  angular.element(document).ready(function() {
    angular.bootstrap(document, [app['name'], function(){
    }]);
  });
});
