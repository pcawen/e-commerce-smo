'use strict';

angular.module('somnioApp').component('productCard', {
    bindings: {
        product: '<'
    },
    templateUrl: 'src/components/product-card/product-card.template.html'
});