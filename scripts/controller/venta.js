(function () {
    'use strict';
    angular.module('controller')
        .controller('venta', venta);
    function venta($scope, $http, LxNotificationService, $state, localStorageService) {
        let vm = this;
        vm.usuario = localStorageService.get('me');
        vm.edit = editarProducto;
        vm.cerrar = cerrarSession;
        vm.add = anadirProducto;
        vm.sell = generarVenta;
        vm.home = inicio;
        vm.products = []
        $http.get('http://localhost:8585/api/productos').then(response => {
            vm.products = response.data;
        })
        $http.get('http://localhost:8585/api/ventas').then(response => {
            vm.dataTableTbodyVenta = response.data.filter(el => {
                return el.usuario && el.usuario !== null && el.usuario._id === vm.usuario._id && new Date(el.createdAt).toLocaleDateString() === new Date().toLocaleDateString();
            }).map(el => {
                return {
                    _id: el._id,
                    productos: el.productos,
                    hora: new Date(el.createdAt).getHours() + ':' + new Date(el.createdAt).getMinutes(),
                    total: el.productos.sum((item) => {
                        return item.producto.precio * item.cantidad;
                    }),
                }
            });
        })
        vm.dataTableThead = [
            { name: 'nombre', label: 'Producto' },
            { name: 'cantidad', label: 'Cantidad' }
        ]
        vm.dataTableTheadVenta = [
            { name: 'hora', label: 'Hora' },
            { name: 'total', label: 'Total' },
        ]
        vm.dataTableTbody = []
        function inicio() {
            $state.go('app');
        }
        function generarVenta() {
            if (vm.selectedRows.length >= 1) {
                $http({
                    method: 'PUT', url: 'http://localhost:8585/api/venta/' + vm.selectedRows[0]._id,
                    data: {
                        productos: angular.copy(vm.dataTableTbody)
                    }
                }).then(response => {
                    LxNotificationService.success('Venta Actualizada!');
                    vm.dataTableTbodyVenta = vm.dataTableTbodyVenta.map(el => {
                        if (response.data._id === el._id)
                            el.total = vm.dataTableTbody.sum((item) => {
                                return item.valor * item.cantidad;
                            })
                        return el
                    })
                    vm.dataTableTbody = []
                    vm.total = 0;
                    vm.selectedRows = []
                });
            } else {
                $http({
                    method: 'POST', url: 'http://localhost:8585/api/venta',
                    data: {
                        productos: angular.copy(vm.dataTableTbody),
                        usuario: localStorageService.get('me')._id
                    }
                }).then(response => {
                    LxNotificationService.success('Venta Generada!');
                    vm.dataTableTbody = []
                });
                vm.total = 0;
            }
        }
        function anadirProducto(p, value) {
            if (vm.dataTableTbody.find(producto => { return producto.producto === p._id })) {
                vm.dataTableTbody = vm.dataTableTbody.map(producto => {
                    if (producto.producto === p._id)
                        producto.cantidad += value;
                    return producto;
                }).filter(producto => {
                    return producto.cantidad > 0;
                });
            } else {
                vm.dataTableTbody.unshift({ producto: p._id, cantidad: 1, nombre: p.nombre, valor: p.precio });
            }
            vm.total = vm.dataTableTbody.sum(function (producto) {
                return producto.valor * producto.cantidad;
            });
        }
        function editarProducto() {
            vm.dataTableTbody = vm.selectedRows[0].productos.map(el => {
                return { producto: el.producto._id, cantidad: el.cantidad, nombre: el.producto.nombre, valor: el.producto.precio }
            })
            vm.total = vm.dataTableTbody.sum(function (producto) {
                return producto.valor * producto.cantidad;
            });
        }
        $scope.$on('lx-data-table__selected', actualizarTabla);
        $scope.$on('lx-data-table__unselected', actualizarTabla);
        function actualizarTabla(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === "ventas") {
                if (_selectedRows.length === 1) {
                    vm.selectedRows = _selectedRows;
                } else if (_selectedRows.length > 1) {
                    vm.selectedRows = [_selectedRows.reverse()[0]]
                }
            }
        }
        function cerrarSession() {
            localStorageService.remove('me')
            $state.go('login')
        }
    }
})();