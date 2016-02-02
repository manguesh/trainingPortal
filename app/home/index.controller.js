(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, $scope, uiGridConstants) {
        var vm = this;

        vm.users = null;
        vm.trainings = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.users = user;
            });

            // // get trainings
            // TrainingService.GetAll().then(function (training) {
            //     console.log("training",training);
            //     vm.training = training;
            // });
        }
        $scope.gridOptions = {
            enablePaginationControls: true,
            paginationPageSizes: [2, 5, 10, 20, 50],
            paginationPageSize: 10,
            enableGridMenu: true,
            enableFiltering: true,
            columnDefs: [
                {
                    field: "_id",
                    displayName: "EmployeeId",
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 0
                    }
                 },
                {
                    field: "firstName",
                    displayName: "First Name"
                },
                {
                    field: "lastName",
                    displayName: "Last Name"
                },
                {
                    field: "creditPoints",
                    displayName: "Points"
                }
                 ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
    }
    // function Controller(TrainingService) {
    //     var vm = this;

    //     vm.training = null;

    //     initController();

    //     function initController() {


    //         // get trainings
    //         TrainingService.GetAll().then(function (training) {
    //             console.log("training",training);
    //             vm.training = training;
    //         });
    //     }
    // }

})();
