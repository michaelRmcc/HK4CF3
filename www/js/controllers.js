angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {


  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');
  $scope.reservation = {};
	
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
		$localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
	
	
	$ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });
	
	// Triggered in the reserve modal to  close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };
	
	// Open the reserve modal
	$scope.reserve = function() {
 		$scope.reserveform.show();		
	};
	
	$scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this&replace with your 
    // reservation code if using a reservation system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);		
	};
	
	
})


	 .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate' ,function($scope, menuFactory,favoriteFactory,baseURL, $ionicListDelegate) {

		 		$scope.baseURL = baseURL;
				$scope.tab = 1;
				$scope.filtText = '';
				$scope.showDetails = false;
				$scope.showMenu = false;
				$scope.message = "Loading ...";

		 		//see wk3-exercise1 vid: 3:06/12:04-left for the 'getdishes() removal.
				$scope.dishes = menuFactory.query(
						function(response) {
								$scope.dishes = response;
								$scope.showMenu = true;
						},
						function(response) {
								$scope.message = "Error: "+response.status + " " + response.statusText;
						});


				$scope.select = function(setTab) {
						$scope.tab = setTab;

						if (setTab === 2) {
								$scope.filtText = "appetizer";
						}
						else if (setTab === 3) {
								$scope.filtText = "mains";
						}
						else if (setTab === 4) {
								$scope.filtText = "dessert";
						}
						else {
								$scope.filtText = "";
						}
				};

				$scope.isSelected = function (checkTab) {
						return ($scope.tab === checkTab);
				};

				$scope.toggleDetails = function() {
						$scope.showDetails = !$scope.showDetails;
				};
		 
		 		$scope.addFavorite = function(index) {
					console.log("addFavorite index is "+index);
					
					favoriteFactory.addToFavorites(index);
					$ionicListDelegate.closeOptionButtons();
				};
		 
		}])

		.controller('ContactController', ['$scope', function($scope) {

				$scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

				var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

				$scope.channels = channels;
				$scope.invalidChannelSelection = false;

		}])

		.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

				$scope.sendFeedback = function() {

						console.log($scope.feedback);
						//jshint errors-warns to use '===' 
						if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
								$scope.invalidChannelSelection = true;
								console.log('incorrect');
						}
						else {
								$scope.invalidChannelSelection = false;
								feedbackFactory.save($scope.feedback);
								$scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
								$scope.feedback.mychannel="";
								$scope.feedbackForm.$setPristine();
								console.log($scope.feedback);
						}
				};
		}])

		.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory','baseURL','$ionicPopover','$ionicModal',function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal)  {
				$scope.baseURL = baseURL;
				$scope.dish = {};
			
				$scope.showDish = false;
				$scope.message="Loading ...";
			
				$scope.dish = dish;
				$scope.commentdata = {};
			

				//--- for dish-detail popover usage
			
				$ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
					scope: $scope
				}).then(function(popover) {
					$scope.popover = popover;
				});

				$scope.openCmntFavPopup = function($event) {
					$scope.popover.show($event);				
				};


				$scope.closePopover = function() {
					$scope.popover.hide();
				}

				$scope.addToFavorites = function(id) {

					favoriteFactory.addToFavorites(id); 

				};
			
			
				//--- for dish-comments modal usage
			
				$ionicModal.fromTemplateUrl('templates/dish-comment.html', {
					scope: $scope					
				}).then(function(modal) {
					scope: $scope,
					$scope.commentForm = modal;
				});	
			
				$scope.closeCommentModal = function() {
					$scope.commentForm.hide();
				};

				$scope.addCommentModal = function(id) {
					$scope.commentForm.show();
				};
			
					
				$scope.submitComment = function (an_id) {
					
					//note the $stateParams.id value is equal to id index passed in to the function ...
					//    so, do not need to 'pass' it in.
					var anid = an_id;
					//var theId = $stateParams.id;
					
					var temp_d = new Date().toISOString();
				  $scope.commentdata.date = temp_d;
					$scope.dish.comments.push($scope.commentdata);		
					//menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
					menuFactory.update({id:$scope.dish.id},$scope.dish);
				
					$scope.commentForm.$setPristine();  //this throwing fits in debugger

					$scope.commentdata = {rating:5, comment:"", author:"", date:""};
					
				};  //added submitComment func semicolon jshint error warning					
			

		}])

		.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
				
				//$scope.mycomment = {rating:5, comment:"", author:"", date:""};

				//$scope.submitComment = function () {

				//		$scope.mycomment.date = new Date().toISOString();
				//		console.log($scope.mycomment);

				//		$scope.dish.comments.push($scope.mycomment);
				//		menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);

				//		$scope.commentForm.$setPristine();

				//		$scope.mycomment = {rating:5, comment:"", author:"", date:""};
				//};  //submit-function. added semicolon because of jshint error warning
		}])

		// implement the IndexController and About Controller here

		.controller('IndexController', ['$scope', '$stateParams', 'dish', 'leader', 'promotion', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', function($scope, $stateParams, dish, leader, promotion, menuFactory, promotionFactory, corporateFactory, baseURL) {
		

				$scope.baseURL = baseURL;
				//$scope.leader = corporateFactory.get({id:3});
				$scope.leader = leader;
			
				$scope.showDish = false;
				$scope.message="Loading ...";
			
				$scope.dish = dish;
				$scope.showDish = true;  //think i should set it to true now ... resolve approach happening in app.js			
			
				//$scope.promotion = promotionFactory.get({id:0});
				$scope.promotion = promotion;

		}])

		.controller('AboutController', ['$scope', '$stateParams', 'leaders','corporateFactory', 'baseURL', function($scope, $stateParams, leaders, corporateFactory, baseURL) {

						$scope.baseURL = baseURL; 
						//$scope.leaders = corporateFactory.query();
			
						$scope.leaders = leaders;
						console.log("in AboutController. leaders: "+$scope.leaders);

						}])

		.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'menuFactory',
																				'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ( $scope, dishes, favorites, favoriteFactory, menuFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {
	
			$scope.baseURL = baseURL;
			$scope.shouldShowDelete = false;
			
			$scope.favorites = favorites;
			$scope.dishes = dishes;
			
			
			$scope.toggleDelete = function() {
				$scope.shouldShowDelete = !$scope.shouldShowDelete;
				console.log($scope.shouldShowDelete);
			};
			
			$scope.deleteFavorite = function(index) { 
				
					var confirmPopup = $ionicPopup.confirm({
							title: 'Confirm Delete',
							template: 'Are you sure you want to delete this item?'

					});				
					confirmPopup.then(function(res) {
						if (res) {
							console.log('Ok to delete');
							favoriteFactory.deleteFromFavorites(index);
						} else {
							console.log('Canceled delete');	
						}

					});
					$scope.shouldShowDelete = false;				
			};
					
			
		}])

		.filter('favoriteFilter', function() {
				
				return function(dishes, favorites) {
					
					var out = [];
					//slow linear search ... focus ionic not algorithm
					for (var i = 0; i < favorites.length; i++) {
						for (var j = 0; j < dishes.length; j++) {
							if (dishes[j].id === favorites[i].id)
								out.push(dishes[j]);
						}
					}
					
					return out;
				}
				
				
		})

;

