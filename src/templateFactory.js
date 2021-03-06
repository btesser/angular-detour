define(['./detourModule'], function() {
  /**
   * Service. Manages loading of templates.
   * @constructor
   * @name $templateFactory
   * @requires $http
   * @requires $templateCache
   * @requires $injector
   */
  function $TemplateFactory(  $http,   $templateCache,   $injector) {

    /**
     * Creates a template from a configuration object.
     * @function
     * @name $templateFactory#fromConfig
     * @methodOf $templateFactory
     * @param {Object} config  Configuration object for which to load a template. The following
     *    properties are search in the specified order, and the first one that is defined is
     *    used to create the template:
     * @param {string|Function} config.template  html string template or function to load via
     *    {@link $templateFactory#fromString fromString}.
     * @param {string|Function} config.templateUrl  url to load or a function returning the url
     *    to load via {@link $templateFactory#fromUrl fromUrl}.
     * @param {Function} config.templateProvider  function to invoke via
     *    {@link $templateFactory#fromProvider fromProvider}.
     * @param {Object} params  Parameters to pass to the template function.
     * @param {Object} [locals] Locals to pass to `invoke` if the template is loaded via a
     *      `templateProvider`. Defaults to `{ params: params }`.
     * @return {string|Promise.<string>}  The template html as a string, or a promise for that string,
     *      or `null` if no template is configured.
     */
    this.fromConfig = function (config, params, locals) {
      return (
        angular.isDefined(config.template) ? this.fromString(config.template, params) :
        angular.isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
        angular.isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
        angular.isDefined(config.templateService) ? this.fromService(config.templateService, params, locals) :
        null
      );
    };

    /**
     * Creates a template from a string or a function returning a string.
     * @function
     * @name $templateFactory#fromString
     * @methodOf $templateFactory
     * @param {string|Function} template  html template as a string or function that returns an html
     *      template as a string.
     * @param {Object} params  Parameters to pass to the template function.
     * @return {string|Promise.<string>}  The template html as a string, or a promise for that string.
     */
    this.fromString = function (template, params) {
      return angular.isFunction(template) ? template(params) : template;
    };

    /**
     * Loads a template from the a URL via `$http` and `$templateCache`.
     * @function
     * @name $templateFactory#fromUrl
     * @methodOf $templateFactory
     * @param {string|Function} url  url of the template to load, or a function that returns a url.
     * @param {Object} params  Parameters to pass to the url function.
     * @return {string|Promise.<string>}  The template html as a string, or a promise for that string.
     */
    this.fromUrl = function (url, params) {
      if (angular.isFunction(url)) {
        url = url(params);
      }
      if (url == null) {
        return null;
      }
      else {
        return $http
          .get(url, { cache: $templateCache })
          .then(function(response) { return response.data; });
      }
    };

    /**
     * Creates a template by invoking an injectable provider function.
     * @function
     * @name $templateFactory#fromProvider
     * @methodOf $templateFactory
     * @param {Function} provider Function to invoke via `$injector.invoke`
     * @param {Object} params Parameters for the template.
     * @param {Object} [locals] Locals to pass to `invoke`. Defaults to `{ params: params }`.
     * @return {string|Promise.<string>} The template html as a string, or a promise for that string.
     */
    this.fromProvider = function (provider, params, locals) {
      return $injector.invoke(provider, null, locals || { params: params });
    };

    /**
     * Creates a template by invoking a service.
     * @function
     * @name $templateFactory#fromService
     * @methodOf $templateFactory
     * @param {Function} serviceName Service to invoke via `$injector.invoke`
     * @param {Object} params Parameters for the template.
     * @param {Object} [locals] Locals to pass to `invoke`. Defaults to `{ params: params }`.
     * @return {string|Promise.<string>} The template html as a string, or a promise for that string.
     */
    this.fromService = function (serviceName, params, locals) {
      return $injector.invoke([serviceName, function(service) { return service.getTemplate(params, locals); }]);
    };

  }
  $TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];

  angular.module('agt.detour').service('$templateFactory', $TemplateFactory);

});
