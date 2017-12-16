(function () {
    'use strict';
    angular.module('controller')
        .controller('venta', venta);
    function venta($http, LxNotificationService, $state, localStorageService) {
        let vm = this;
        vm.usuario = localStorageService.get('me');
        vm.cerrar = cerrarSession;
        vm.add = anadirProducto;
        vm.sell = generarVenta;
        vm.home = inicio;
        vm.products = []
        $http.get('http://localhost:8585/api/productos').then(response => {
            vm.products = response.data;
        })
        vm.dataTableThead = [
            { name: 'nombre', label: 'Producto' },
            { name: 'cantidad', label: 'Cantidad' }
        ]
        vm.dataTableTbody = []
        function inicio() {
            $state.go('app');
        }
        function generarVenta() {
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
        function cerrarSession(){
            localStorageService.remove('me')
            $state.go('login')
        }
    }
})();