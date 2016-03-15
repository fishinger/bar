var restApp = angular.module( 'restApp', [] )


/************************************************************
 * Main controller of whole app
 */
.factory('menuFactory', ['$http', '$q', function($http, $q){
	var menuUrl = 'menu.json'
		menu = null,
		currency = '',
		currencyItem = null,
		currencyItemStatus = 'new',
		currencyItemAmout = 1,
		currencyModifiers = [];
	return {
		getMenu: function(){
			var deferred = $q.defer();
			$http({method: 'GET', url: menuUrl}).success(function(data){
				menu = data;
				currency = data.currency;
				deferred.resolve(data);
			}).error(function(data, status){
				deferred.reject('Error!!!!!');
				console.log(data);
				console.log(status);
			})
			return deferred.promise;
		},
		getCurrency: function(){
			return currency
		},
		setCurrencyItem: function(item){
			currencyItem = item;
		},
		setCurrencyItemById: function(id){
			for (var i=0; i < menu.products.length; i++){
				if ( menu.products[i].id == id ) {
					currencyItem = menu.products[i];
					return true;
				}
			}
			return false;
		},
		getCurrencyItem: function(){
			return currencyItem
		},
		setCurrencyItemStatus: function(status){
			currencyItemStatus = status
		},
		getCurrencyItemStatus: function(){
			return currencyItemStatus
		},
		setCurrencyItemAmout: function(count){
			currencyItemAmout = count
		},
		getCurrencyItemAmout: function(){
			return currencyItemAmout
		},
		setItemModifiers: function(newModif){
			currencyModifiers = newModif
		},
		getItemModifiers: function(){
			return currencyModifiers
		}
	}
}])
.factory('cartFactory', [function(){
	var cart = [];
	return {
		getCountCart: function(){
			return cart.length
		},
		addItemToCart: function(item, amout, modifiers){
			var newItem = {};
			newItem.modifiers = [];
			newItem.name = item.name;
			newItem.id = item.id;
			newItem.price = item.price;
			newItem.amout = amout;
			if(!!modifiers && modifiers.length > 0){
				newItem.modifiers = modifiers
				console.log('okii')
			}
			cart.push(newItem);
		},
		getCart: function(){
			return cart
		},
		getTotal: function(){
			var total = 0;
			if(cart.length > 0){
				for(var i = 0; i < cart.length; i++){
					total += cart[i].price * cart[i].amout;
					if(cart[i].modifiers.length > 0){
						for(var j = 0; j < cart[i].modifiers.length; j++){
							total += cart[i].modifiers[j].price * cart[i].amout
						}
					}
				}
			}
			return total.toFixed(2)
		},
		removeItemCart: function(item){
			var id = item.id;
			for(var i = 0; i < cart.length; i++){
				if(cart[i].id === id){
					cart.splice(i, 1);
					return true
				}
			}
			return false
		}
	}
}])
.controller( 'mainCtrl', [ '$scope', function( $scope ){
	
}])
.controller( 'menuListCtrl', [ '$scope', 'menuFactory', '$rootScope', function( $scope,  menuFactory, $rootScope){
	menuFactory.getMenu().then(function(menuObj){
		$scope.products = menuObj.products;
		$scope.currency = menuObj.currency;
	});
	$scope.openProduct = function(item){
		menuFactory.setCurrencyItem(item);
		menuFactory.setCurrencyItemStatus('new');
		menuFactory.setCurrencyItemAmout(1);
		$rootScope.$broadcast('open-item');
		$.mobile.changePage('#menuItemPage', {transition: 'slideup'});
	}
}])
