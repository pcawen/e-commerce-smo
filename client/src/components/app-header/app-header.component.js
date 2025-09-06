'use strict';

angular.module('somnioApp').component('appHeader', {
    templateUrl: 'src/components/app-header/app-header.template.html',
    controller: AppHeaderController
});

AppHeaderController.$inject = ['ProductsService'];

function AppHeaderController(ProductsService) {
    var ctrl = this;
    
    ctrl.searchQuery = '';
    
    ctrl.onSearchChange = function() {
        ProductsService.query.search = ctrl.searchQuery;
        ProductsService.resetAndFetch();
    };
    
    ctrl.clearSearch = function() {
        ctrl.searchQuery = '';
        ProductsService.query.search = '';
        ProductsService.resetAndFetch();
    };
}
