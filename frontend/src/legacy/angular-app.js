import angular from 'angular';

export const legacyApp = angular.module('legacyApp', []);

legacyApp.controller('ActivityLogCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.activities = [];
  $scope.loading = true;
  $scope.error = null;

  //this is hardcoded for userid=1 .. this is just to show angular component in react
  const apiUrl = 'http://localhost:3001/api/tasks/1';

  $http.get(apiUrl)
    .then(function(response) {
      
      $scope.activities = response.data.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.Status || task.status,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }));
      $scope.loading = false;
    })
    .catch(function(error) {
      $scope.error = 'Failed to load tasks.';
      console.error('API error:', error);
      $scope.loading = false;
    });
}]);
