(function () {
    'use strict';
    angular.module('controller')
        .controller('app', app);
    function app($http, $state) {
        let vm = this;
        vm.goTo = irA;
        vm.home = inicio;
        function inicio() {
            $state.go('app');
        }
        function irA(path) {
           $state.go(path)
        }
    }
})();