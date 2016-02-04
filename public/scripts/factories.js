var Factories = angular.module('Factories', ['ngResource']);

Factories.factory('Passage', ['$resource', function ($resource) {
  return $resource('/api/passages/:id', { id: '@_id' });
}]);

Factories.factory('Response', ['$resource', function ($resource) {
  return $resource('/api/responses/:id', { id: '@_id' });
}]);

Factories.factory('Score', ['$resource', function ($resource) {
  return $resource('/api/scores/:id', { id: '@_id' });
}]);
