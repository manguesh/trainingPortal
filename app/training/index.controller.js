//(function () {
//    'use strict';

var app = angular
    .module('app')
    .controller('Training.IndexController', Controller);

function Controller(TrainingService, UserService, $scope, $filter, uiGridConstants, FlashService) {
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

            if (user.userType == 1) {
                TrainingService.GetAll().then(function (training) {
                    vm.trainings = training;
                    vm.trainings.timings = training.timingsFrom + " - " + training.timingsTo;
                    console.log("++++++++++++++++++++++++++++++" + JSON.stringify(vm.trainings));
                    vm.currentPage = 0;
                    vm.pageSize = 10;
                    vm.data = vm.trainings;
                    vm.numberOfPages = function () {
                        return Math.ceil(vm.data.length / vm.pageSize);
                    }
                    $scope.gridOptions.data = vm.data;
                });
            } else if (user.userType != 1) {
                TrainingService.GetAllApproved().then(function (training) {
                    vm.trainings = training;
                    vm.trainings.timings = training.timingsFrom + " - " + training.timingsTo;
                    console.log("++++++++++++++++++++++++++++++" + JSON.stringify(vm.trainings));
                    vm.currentPage = 0;
                    vm.pageSize = 10;
                    vm.data = vm.trainings;
                    vm.numberOfPages = function () {
                        return Math.ceil(vm.data.length / vm.pageSize);
                    }
                    $scope.gridOptions.data = vm.data;
                });
            }
        });
    }

    function applyTraining(_id) {
        console.log(_id);
        TrainingService.applyTraining(_id).then(function (training) {
            vm.trainings = training;
        });
    }

    function approveTraining(_id) {
        console.log("====================" + _id);


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

    function createTraining(training) {
        //alert("#####################" + JSON.stringify($scope));
        console.log("############>>>>>>>>>." + JSON.stringify($scope.date));
        training.dates = $scope.date;
        TrainingService.Create(training).then(function (training) {
            FlashService.Success('Training Created');
            TrainingService.GetAllApproved().then(function (training) {
                vm.trainings = training;
            });
            vm.training.trainingTopic = '';
            vm.training.description = '';
            vm.training.dates = '';
            vm.training.timingsFrom = '';
            vm.training.timingsTo = '';
            vm.training.trainingBy = '';
        });
    }

    test = function (date) {
        $scope.date = date
    }


    $scope.gridOptions = {
        enablePaginationControls: true,
        paginationPageSizes: [2, 5, 10, 20, 50],
        paginationPageSize: 5,
        enableGridMenu: true,
        enableFiltering: true,
        columnDefs: [{
            field: "trainingTopic",
            displayName: "Topic",
            sort: {
                direction: uiGridConstants.DESC,
                priority: 2
            }
                }, {
            name: "description",
            width: 100
                }, {
            name: "timingsFrom"
                }, {
            name: "timingsTo"
                }, {
            name: "trainingBy"
                }, {
            name: "dates",
            type: Date
                }, {
            field: "approved",
            enableCellEdit: false,
            displayName: "Action",
            sort: {
                direction: uiGridConstants.DESC,
                priority: 1
            },
            enableFiltering: false,
            cellTemplate: '<div><button class="btn-success btn-sm" ng-if="row.entity.approved ? (grid.appScope.users.userType == 2) : true" ng-click="grid.appScope.applyOrApprove(row.entity)"><span>{{(grid.appScope.users.userType == 1)?"Approve":"Apply"}}</span></button></div>'
                }],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    /*
     * Might need to include conditions to check userTypes as well 
     */
    $scope.applyOrApprove = function (training) {
        if (training.approved && ($scope.users.userType == 2)) {
            vm.applyTraining(training._id);
        } else {
            vm.approveTraining(training._id);
            training.approved = true;
        }
        console.log("refreshing gird");
        $scope.gridApi.core.refresh();
    }
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
