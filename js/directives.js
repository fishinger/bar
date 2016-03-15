restApp
.directive('menuItemPage', ['menuFactory', 'cartFactory', '$rootScope', function(menuFactory, cartFactory, $rootScope){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tmp-pages/menuItemPage.html',
		scope: {},
		controller: function($scope){
			$('#menuItemPage').page();
			$scope.$on('open-item', function(){
				$scope.currencyItem = menuFactory.getCurrencyItem();
				$scope.itemStatus = menuFactory.getCurrencyItemStatus();
				$scope.itemAmout = menuFactory.getCurrencyItemAmout();
				$scope.itemCurrency = menuFactory.getCurrency();
				$scope.countCart = cartFactory.getCountCart();
			})
			$scope.amoutItem = function(num){
				$scope.itemAmout = num;
			}
			$scope.selectItem = function(num){
				return num == $scope.itemAmout
			}
			$scope.saveMenu = function(){
				cartFactory.removeItemCart($scope.currencyItem);
				$scope.addMenu();
			}
			$scope.addMenu = function(){
				var modifierList = $('#select-modif').val();
				var modifiers = [];
				if(!!modifierList && modifierList.length > 0){
					for(var i = 0; i < modifierList.length; i++){
						var modifier = $scope.currencyItem.modifiers[modifierList[i]];
						modifier.indexID = modifierList[i];
						modifiers.push(modifier);
					}
				}
				cartFactory.addItemToCart($scope.currencyItem, $scope.itemAmout, modifiers);
				$.mobile.changePage('#cartPage', {transition: 'slideup'});
				$rootScope.$broadcast('open-cart');
			}
			$scope.removeMenu = function(){
				cartFactory.removeItemCart($scope.currencyItem);
				$rootScope.$broadcast('open-cart');
				$.mobile.changePage('#cartPage', {transition: 'slideup'});
			}
		}
	}
}])
.directive('cartPage', ['menuFactory', 'cartFactory', '$rootScope', function(menuFactory, cartFactory, $rootScope){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tmp-pages/cartPage.html',
		scope: {},
		controller: function($scope){
			$('#cartPage').page();
			$scope.$on('open-cart', function(){
				$scope.cart = cartFactory.getCart();
				$scope.total = cartFactory.getTotal();
				$scope.currency = menuFactory.getCurrency();
			});

			$scope.editItem = function(item){
				var currencyItem = menuFactory.setCurrencyItemById(item.id);
				if(currencyItem){
					menuFactory.setCurrencyItemStatus('edit');
					menuFactory.setCurrencyItemAmout(item.amout);
					menuFactory.setItemModifiers(item.modifiers);
					$rootScope.$broadcast('open-item');
					$.mobile.changePage('#menuItemPage', {transition: 'slideup'});
				}
			}
		}
	}
}])
.directive('multipleSelectWidget', ['menuFactory', '$timeout', function(menuFactory, $timeout){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tmp-widgets/multipleSelectWidget.html',
		scope: {},
		controller: function($scope){
			$('#select-modif').selectmenu();
			$scope.$on('open-item', function(){
				$scope.currencyItem = menuFactory.getCurrencyItem();
				$scope.itemStatus = menuFactory.getCurrencyItemStatus();
				$scope.itemCurrency = menuFactory.getCurrency();
				$timeout(function(){
					if($scope.itemStatus === 'new'){
						$('#select-modif').find('option').each(function(){
							$(this).removeAttr('selected');
							$('#select-modif-menu li a').removeClass('ui-checkbox-on').addClass('ui-checkbox-off')
						})
					} else {
						var currentModifiers = menuFactory.getItemModifiers();
						$( "#select-modif" ).find( 'option' ).each(function(){
							$(this).removeAttr('selected');
							for(var i=0; i < currentModifiers.length; i++){
								if( $(this).val() == currentModifiers[i].indexID ) $(this).attr('selected', 'selected');
							}
						});
					}
					$('#select-modif').selectmenu('refresh');
				}, 100)
			})
		}
	}
}])