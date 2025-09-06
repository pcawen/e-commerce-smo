var app = angular.module('somnioApp', []);

app.controller('MainController', MainController);

MainController.$inject = ['$scope', 'ProductsService'];

function MainController($scope, ProductsService) {
    $scope.productsService = ProductsService;
    $scope.newProduct = {};

    $scope.submitNewProduct = function() {
        ProductsService.addProduct($scope.newProduct).then(function() {
            $scope.newProduct = {};
        });
    };

    $scope.uploadBulkProducts = function() {
        const productCount = 10;
        const productsToUpload = [];
        for (let i = 1; i <= productCount; i++) {
            productsToUpload.push({
                name: `Product ${i}`,
                price: Math.floor(Math.random() * 100) + 1,
                description: `Product ${i} desc`,
            });
        }
        
        $scope.bulkUploadMessage = 'Uploading... Please wait.';

        ProductsService.addProductBulk(productsToUpload)
        .then(function(response) {
            console.log(response)
            $scope.bulkUploadMessage = response.data.message;
        })
        .catch(function(error) {
            $scope.bulkUploadMessage = 'Bulk upload failed.';
            console.error('Error during bulk upload:', error);
        });
    };
}