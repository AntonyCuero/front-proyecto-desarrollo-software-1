(function () {
    'use strict';
    angular.module('controller')
        .controller('reporte', reporte);
    function reporte($http, LxNotificationService, $state) {
        let vm = this;
        vm.filter = alterarFecha;
        vm.home = inicio;
        vm.sales = [];
        $http.get('http://localhost:8585/api/ventas').then(response => {
            vm.sales = response.data;
            vm.dataTableTbody = vm.sales.map(venta => {
                let data = {
                    fecha: new Date(venta.createdAt),
                    cantidad: venta.productos.sum((item) => {
                        return item.cantidad;
                    }),
                    total: venta.productos.sum((item) => {
                        return item.producto.precio * item.cantidad;
                    }),
                    productos: venta.productos.map(p => { return { nombre: p.producto.nombre, cantidad: p.cantidad } })
                };
                return data;
            });
            mostrarGraficos()
            mostrarTorta()
        })
        vm.input = {}
        vm.dataTableThead = [
            { name: 'fecha', label: 'Fecha', format: (row) => { return (row.fecha).format('{dd} {Mon} {yyyy}', 'es'); } },
            { name: 'cantidad', label: 'Cantidad Productos' },
            { name: 'total', format: (row) => { return (row.total).format(); }, label: 'Total' }
        ]
        function inicio() {
            $state.go('app');
        }
        function mostrarGraficos() {
            let labels = Number.range(0, 23).toArray().map(number => Date.create(`${number}:00:00`).format('{h}{t}'))
            let data = labels.map(label => {
                return vm.dataTableTbody.count(function (n) {
                    return n.fecha.format('{h}{t}') === label;
                });
            })
            let ctx = document.getElementById('horarios').getContext('2d');
            let myLineChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        backgroundColor: '#7baaf7',
                        data: data,
                    }]
                },
                options: {
                    legend: { display: false },
                    scales: {
                        xAxes: [{ gridLines: { display: false } }],
                        yAxes: [{ ticks: { display: false }, gridLines: { display: false } }]
                    }
                }
            });
        }
        function mostrarTorta() {
            if (vm.productos) {
                let labels = vm.productos.map(p => p.nombre)
                let data = labels.map(label => {
                    return vm.dataTableTbody.sum(function (n) {
                        let pr = n.productos.find(e => e.nombre === label)
                        return pr ? pr.cantidad : 0;
                    });
                });
                crearTorta(labels, data);
            } else {
                $http.get('http://localhost:8585/api/productos').then(response => {
                    vm.productos = response.data;
                    let labels = vm.productos.map(p => p.nombre)
                    let data = labels.map(label => {
                        return vm.dataTableTbody.sum(function (n) {
                            let pr = n.productos.find(e => e.nombre === label)
                            return pr ? pr.cantidad : 0;
                        });
                    });
                    crearTorta(labels, data);
                });
            }
        }
        function crearTorta(labels, data) {
            let ctx = document.getElementById('productos').getContext('2d');
            let myLineChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        backgroundColor: data.map(() => randomColor()),
                        data: data,
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{ ticks: { display: false }, gridLines: { display: false } }],
                        yAxes: [{ ticks: { display: false }, gridLines: { display: false } }]
                    }
                }
            });
        }
        function randomColor() {
            var r = Number.random(50, 255);
            var g = Number.random(50, 255);
            var b = Number.random(50, 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        };
        function alterarFecha(newDate) {
            let data = newDate ? vm.sales.filter(venta => Date.create(venta.createdAt).short() === newDate.short()) : vm.sales;
            vm.dataTableTbody = data.map(venta => {
                let data = {
                    fecha: new Date(venta.createdAt),
                    cantidad: venta.productos.sum((item) => {
                        return item.cantidad;
                    }),
                    total: venta.productos.sum((item) => {
                        return item.producto.precio * item.cantidad;
                    }),
                    productos: venta.productos.map(p => { return { nombre: p.producto.nombre, cantidad: p.cantidad } })
                };
                return data;
            });
            mostrarTorta();
            mostrarGraficos();
        }
    }
})();