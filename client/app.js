var app = angular.module('myApp', []);

app.controller('MainController', function($scope, $http) {
    $scope.newProduct = {};
    $scope.products = [];

    $scope.fetchProducts = function() {
        $http.get('http://localhost:3000/products')
            .then(function(response) {
                $scope.products = response.data;
            })
            .catch(function(error) {
                console.error('Error fetching products:', error);
            });
    };

    $scope.addProduct = function() {
        $http.post('http://localhost:3000/products', $scope.newProduct)
            .then(function(response) {
                $scope.newProduct = {};
                $scope.fetchProducts();
            })
            .catch(function(error) {
                console.error('Error adding product:', error);
            });
    };

    $scope.fetchProducts();
});