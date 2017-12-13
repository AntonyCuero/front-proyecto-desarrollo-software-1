(function () {
    'use strict';
    angular.module('controller')
        .controller('producto', product);
    function product($http, LxNotificationService, $state) {
        let vm = this;
        vm.add = anadirProducto;
        vm.home = inicio;
        vm.input = {};
        vm.dataTableTbody = []
        vm.total = 0;
        $http.get('http://localhost:8585/api/productos').then(response => {
            vm.dataTableTbody = response.data;
        })
        vm.dataTableThead = [
            {
                name: 'imagen',
                format: function (row) {
                    return '<img src="' + row.imagen + '" width="40" height="40">';
                }
            },
            { name: 'nombre', label: 'Producto' },
            {
                name: 'precio',
                format: function (row) {
                    return (row.precio).format();
                }, label: 'Precio'
            }
        ]
        function inicio() {
            $state.go('app');
        }
        function anadirProducto() {
            if ((typeof vm.input.nombre === 'undefined' || vm.input.nombre === null)
                && (typeof vm.input.precio === 'undefined' || vm.input.precio === null)
                && (typeof vm.input.imagen === 'undefined' || vm.input.imagen === null)) {
                LxNotificationService.warning('Completa los Campos')
                return;
            }
            $http({ method: 'POST', url: 'http://localhost:8585/api/producto', data: angular.copy(vm.input) }).then(response => {
                vm.dataTableTbody.push(response.data);
                vm.input = {};
            });
        }
    }
})();