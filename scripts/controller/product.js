(function () {
    'use strict';
    angular.module('controller')
        .controller('producto', product);
    function product($scope, $http, LxNotificationService, $state, localStorageService) {
        let vm = this;
        vm.usuario = localStorageService.get('me');
        vm.cerrar = cerrarSession;
        vm.add = anadirProducto;
        vm.edit = editarProducto;
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
            if (vm.input._id) {
                $http({ method: 'PUT', url: 'http://localhost:8585/api/producto/' + vm.input._id, data: angular.copy(vm.input) }).then(response => {
                    vm.dataTableTbody = vm.dataTableTbody.map(el => {
                        if (el._id === response.data._id) {
                            el = angular.copy(response.data)
                            vm.selectedRows= [];
                        }
                        return el
                    })
                    vm.input = {};
                });
            } else {
                $http({ method: 'POST', url: 'http://localhost:8585/api/producto', data: angular.copy(vm.input) }).then(response => {
                    vm.dataTableTbody.push(response.data);
                    vm.input = {};
                });
            }
        }
        function editarProducto() {
            vm.input = angular.copy(vm.selectedRows[0]);
        }
        $scope.$on('lx-data-table__selected', actualizarTabla);
        $scope.$on('lx-data-table__unselected', actualizarTabla);
        function actualizarTabla(_event, _dataTableId, _selectedRows) {
            if (_selectedRows.length === 1) {
                vm.selectedRows = _selectedRows;
            } else if (_selectedRows.length > 1) {
                vm.selectedRows = [_selectedRows.reverse()[0]]
            }
        }
        function cerrarSession(){
            localStorageService.remove('me')
            $state.go('login')
        }
    }
})();