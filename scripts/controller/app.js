(function () {
    'use strict';
    angular.module('controller')
        .controller('app', app);
    function app($http, $state, localStorageService) {
        let vm = this;
        vm.usuario = localStorageService.get('me');
        vm.cerrar = cerrarSession;
        vm.goTo = irA;
        vm.home = inicio;
        function inicio() {
            $state.go('app');
        }
        function irA(path) {
           $state.go(path)
        }
        function cerrarSession(){
            localStorageService.remove('me')
            $state.go('login')
        }
    }
})();