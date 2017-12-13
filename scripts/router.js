(function () {
    'use strict';
    angular.module('route')
            .config(router);
    router.$inject = ['$stateProvider', '$urlRouterProvider'];
    function router($stateProvider, $url) {
        $stateProvider.state({
            name: 'login',
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'login as vm'
        });
        $stateProvider.state({
            name: 'app',
            url: '/app',
            templateUrl: 'views/app.html',
            controller: 'app as vm'
        });
        $stateProvider.state({
            name: 'venta',
            url: '/venta',
            templateUrl: 'views/ventas.html',
            controller: 'venta as vm'
        });
        $stateProvider.state({
            name: 'producto',
            url: '/productos',
            templateUrl: 'views/productos.html',
            controller: 'producto as vm'
        });
        $stateProvider.state({
            name: 'usuario',
            url: '/usuario',
            templateUrl: 'views/usuarios.html',
            controller: 'usuario as vm'
        });
        $stateProvider.state({
            name: 'reporte',
            url: '/reportes',
            templateUrl: 'views/reportes.html',
            controller: 'reporte as vm'
        });
        $url.otherwise("/login");
    }
})();
