'use strict';

angular.module('somnioApp').factory('ProductsService', ProductsService);

ProductsService.$inject = ['$http'];

function ProductsService($http) {
    const ITEMS_PER_PAGE = 3;
    const API_BATCH_SIZE = 5;
    const BASE_URL = 'http://localhost:3000/products'

    const service = {
        displayedProducts: [],
        query: {
            search: '',
            offset: 0,
            sortBy: '',
            sortOrder: 'asc'
        },
        hasMoreData: true,
        
        loadMoreProducts: loadMoreProducts,
        resetAndFetch: resetAndFetch,
        addProduct: addProduct,
        addProductBulk: addProductBulk
    };

    let currentBatch = [];
    let batchOffset = 0;

    return service;

    function loadMoreProducts() {
        if (batchOffset < currentBatch.length) {
            const nextItems = currentBatch.slice(batchOffset, batchOffset + ITEMS_PER_PAGE);
            service.displayedProducts = service.displayedProducts.concat(nextItems);
            batchOffset += ITEMS_PER_PAGE;
        }

        if (batchOffset >= currentBatch.length) {
            fetchNewBatch().then(function(newBatch) {
                if (newBatch.length > 0) {
                    loadMoreProducts();
                }
            });
        }
    }

    function resetAndFetch() {
        service.query.offset = 0;
        service.displayedProducts = [];
        service.hasMoreData = true;
        currentBatch = [];
        batchOffset = 0;
        return fetchNewBatch().then(function() {
                loadMoreProducts();
        });
    }
    
    function addProduct(newProduct) {
        return $http.post(BASE_URL, newProduct)
            .then(function(response) {
                return resetAndFetch();
            })
            .catch(function(error) {
                console.error('Error adding product:', error);
                return error;
            });
    }

    function addProductBulk(productsToUpload) {
        return $http.post(`${BASE_URL}/bulk`, productsToUpload)
    }

    function fetchNewBatch() {
        const url = buildQueryUrl();
        
        return $http.get(url)
            .then(function(response) {
                currentBatch = response.data;
                service.query.offset += currentBatch.length;
                
                if (currentBatch.length < API_BATCH_SIZE) {
                    service.hasMoreData = false;
                } else {
                    service.hasMoreData = true;
                }
                
                batchOffset = 0;
                return currentBatch;
            })
            .catch(function(error) {
                console.error('Error fetching products:', error);
                service.hasMoreData = false;
                return [];
            });
    }

    function buildQueryUrl() {
        let url = BASE_URL;
        const params = [];

        if (service.query.search) {
            params.push('search=' + encodeURIComponent(service.query.search));
        }
        if (service.query.sortBy) {
            params.push('sortBy=' + encodeURIComponent(service.query.sortBy));
        }
        if (service.query.sortOrder) {
            params.push('sortOrder=' + encodeURIComponent(service.query.sortOrder));
        }
        
        params.push('limit=' + API_BATCH_SIZE);
        params.push('offset=' + service.query.offset);

        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        return url;
    }
}