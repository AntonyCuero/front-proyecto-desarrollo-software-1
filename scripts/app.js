(function () {
    'use strict';
    angular.module('controller', ['LocalStorageModule','lumx']);
    angular.module('route', ['ui.router', 'controller']);

    angular.module('AnYiFa', [
        'controller',
        'route'
    ]).run(onInit);
    onInit.$inject = ['localStorageService'];
    function onInit(localStorageServiceProvider) {
        Sugar.extend();
        localStorageServiceProvider.setStorageType('localStorage');
    }
})();
