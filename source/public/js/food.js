angular.module('foodynoms', []).controller('FoodController', ['$scope', '$http', function($scope, $http){

    $scope.foodData = [];

    var foodURL = '/public/json/food.json';
    $http.get(foodURL).then(
        function(foodResponse){ $scope.foodData = foodResponse.data; },
        function(error) { console.log('error fetching ' +foodURL+ ' -- ', error.statusText + ', ' + error.status); }
    );

    $scope.selectedElement = { id:'none' };

    $scope.clearElement = function(element) {
        element.e.innerHTML = '';
        element.id = 'none';
    };

    $scope.moreInfo = function( id ) {
        var divId = 'info'+id;

        if( $scope.selectedElement.id == divId ){
            $scope.clearElement($scope.selectedElement);
            return;
        }

        if( $scope.selectedElement.id != 'none' )
            $scope.clearElement($scope.selectedElement);


        var food = $scope.foodData[id];

        $scope.selectedElement.id = divId;
        $scope.selectedElement.e = document.getElementById(divId);

        $scope.selectedElement.e.innerHTML = '<hr>';
        $scope.selectedElement.e.innerHTML += '<div> Beskrivelse: <br/>' + food.description + '</div>';
        $scope.selectedElement.e.innerHTML += '<hr><div> Ingredienser: <br/>' + food.ingredients + '</div>';
    };
}]);