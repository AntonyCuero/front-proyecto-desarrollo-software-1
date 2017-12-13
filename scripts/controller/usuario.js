(function () {
    'use strict';
    angular.module('controller')
        .controller('usuario', usuario);
    function usuario($http, LxNotificationService, $state) {
        let vm = this;
        vm.add = anadirUsuario;
        vm.home = inicio;
        vm.input = {};
        vm.dataTableTbody = []
        vm.roles = ['admin', 'vendedor']
        $http.get('http://localhost:8585/api/usuarios').then(response => {
            vm.dataTableTbody = response.data;
        })
        vm.dataTableThead = [
            { name: 'nombre', label: 'Nombre' },
            { name: 'usuario', label: 'Nombre de Usuario' },
            { name: 'rol', label: 'Tipo' }
        ]
        function inicio() {
            $state.go('app');
        }
        function anadirUsuario() {
            if ((typeof vm.input.nombre === 'undefined' || vm.input.nombre === null)
                && (typeof vm.input.usuario === 'undefined' || vm.input.usuario === null)
                && (typeof vm.input.contrasena === 'undefined' || vm.input.contrasena === null)) {
                LxNotificationService.warning('Completa los Campos')
                return;
            }
            $http({ method: 'POST', url: 'http://localhost:8585/api/usuario', data: angular.copy(vm.input) }).then(response => {
                vm.dataTableTbody.push(response.data);
                vm.input = {};
            });
        }
    }
})();