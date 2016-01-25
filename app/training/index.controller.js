//(function () {
//    'use strict';

    var app = angular
        .module('app')
        .controller('Training.IndexController', Controller);

    function Controller(TrainingService,UserService,$scope, FlashService) {
        //alert("$$$ in controller ::" + $scope.date);
        var vm = this;
        
        vm.users = null;
        vm.trainings = null;
        vm.data = null;
        vm.currentPage = null;
        vm.pageSize = null;
        vm.createTraining = createTraining;
        vm.approveTraining = approveTraining;
        vm.applyTraining = applyTraining;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.users = user;
                $scope.users = user;

                if(user.userType== 1){
                    TrainingService.GetAll().then(function (training){
                        vm.trainings = training;
                        vm.trainings.timings = training.timingsFrom + " - " + training.timingsTo;
                        console.log("++++++++++++++++++++++++++++++" + JSON.stringify(vm.trainings));
                        vm.currentPage = 0;
                        vm.pageSize = 10;
                        vm.data = vm.trainings;
                        vm.numberOfPages=function(){
                            return Math.ceil(vm.data.length/vm.pageSize);
                        }
                    });
                }else if(user.userType!= 1){
                    TrainingService.GetAllApproved().then(function (training) {
                        vm.trainings = training;
                        vm.trainings.timings = training.timingsFrom + " - " + training.timingsTo;
                        console.log("++++++++++++++++++++++++++++++" + JSON.stringify(vm.trainings));
                        vm.currentPage = 0;
                        vm.pageSize = 10;
                        vm.data = vm.trainings;
                        vm.numberOfPages=function(){
                            return Math.ceil(vm.data.length/vm.pageSize);
                        }
                    });
                }
            });
        }

        function applyTraining (_id){
            console.log(_id);
            TrainingService.applyTraining(_id).then(function (training){
                vm.trainings = training;
            });
        }

        function approveTraining(_id){
            console.log("===================="+_id);


            TrainingService.GetById(_id).then(function (training) {
                //console.log("############" + JSON.stringify(training));
                TrainingService.Update(training).then(function (training) {
                    FlashService.Success('Training Approved');
                    TrainingService.GetAll().then(function (training) {
                        vm.trainings = training;
                    });
                });
            });
        }

        function createTraining(training){
            //alert("#####################" + JSON.stringify($scope));
            console.log("############>>>>>>>>>." + JSON.stringify($scope.date));
            training.dates = $scope.date;
            TrainingService.Create(training).then(function (training) {
                FlashService.Success('Training Created');
                TrainingService.GetAllApproved().then(function (training) {
                    vm.trainings = training;
                });
            });
        }

        test= function(date) { $scope.date = date }
    }

    /*app.filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });*/

    app.directive('jqdatepicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                $(element).datepicker({
                    dateFormat: 'DD, d  MM, yy',
                    onSelect: function (date) {
                        //alert("this is the date>>" + date);
                        scope.date = date;
                        scope.$apply();
                        test(date);
                        //alert("#####################1" + JSON.stringify(scope));
                    }
                });
            }
        };
    });

//})();