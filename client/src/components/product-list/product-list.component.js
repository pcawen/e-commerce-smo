'use strict';

angular.module('somnioApp').component('productList', {
    templateUrl: 'src/components/product-list/product-list.template.html',
    controller: ProductListController
});

ProductListController.$inject = ['ProductsService'];

function ProductListController(ProductsService) {
    var ctrl = this;
    
    ctrl.productsService = ProductsService;
    
    ctrl.onSortChange = function() {
        ProductsService.resetAndFetch();
    };
    
    ctrl.loadMore = function() {
        ProductsService.loadMoreProducts();
    };

    ProductsService.resetAndFetch();
}
