(function () {
    'use strict';
    angular.module('controller')
        .controller('login', _login);
    function _login($state, $http, LxNotificationService, localStorageService) {
        let vm = this;
        $http.get('http://localhost:8585/api/usuarios').then(response => {
            vm.usuarios = response.data;
        })
        vm.input = {};
        ////////
        vm.login = iniciarsesion;
        ///////
        validarInicio();
        ///////
        function validarInicio() {
            if (typeof localStorageService.get('me') === 'undefined' || localStorageService.get('me') === null) {
                vm.isLogged = true;
            } else {
                $state.go('app');
            }
        }
        function iniciarsesion() {
            if (typeof vm.input.username == 'undefined' || vm.input.username == null || vm.input.username.toString().length <= 0) {
                LxNotificationService.error("Nombre de Usuario");
                return;
            }
            if (typeof vm.input.password == 'undefined' || vm.input.password == null || vm.input.password.toString().length <= 0) {
                LxNotificationService.error("Contraseña");
                return;
            }
            vm.usuarios.forEach(usuario => {
                if (usuario.usuario.toLowerCase() === vm.input.username.toLowerCase() && usuario.contrasena.toLowerCase() === vm.input.password.toLowerCase())
                    localStorageService.set('me', usuario);
            });
            if (localStorageService.get('me') && localStorageService.get('me') !== null) {
                $state.go('app');
            } else {
                vm.input = { username: vm.input.username }
                LxNotificationService.error("Usuario/Contraseña Incorrectos");
            }
        }
    }
})();