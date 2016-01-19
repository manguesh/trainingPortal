(function () {
    'use strict';

    angular
        .module('app')
        .factory('TrainingService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetCurrent() {
            return $http.get('/api/training/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/training/all').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/training/' + _id).then(handleSuccess, handleError);
        }
        function Create(training) {
            return $http.post('/api/training', training).then(handleSuccess, handleError);
        }

        function Update(training) {
            return $http.put('/api/training/' + training._id, training).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/training/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
