(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService, $scope, uiGridConstants) {
        var vm = this;

        vm.users = null;
        vm.trainings = null;
        vm.creditPoints = creditPoints;
        initController();

        function initController() {
            // get current user
            var currentUser;
            UserService.GetCurrent().then(function (user) {
                vm.users = user;
                if (vm.users.userType == 1) {
                    //Need to get all the users from user's db
                    UserService.GetAllUsers().then(function (allUsers) {
                        vm.allUsers = allUsers;
                        $scope.gridOptions.data = vm.allUsers;
                    });
                }
            });

            // // get trainings
            // TrainingService.GetAll().then(function (training) {
            //     console.log("training",training);
            //     vm.training = training;
            // });
        }

        function creditPoints(user) {
            var _id = user._id;
            console.log("credit points accessed!");
            //            if (confirm("Are you sure you want to credit points to " + user.firstName)) {
            //                UserService.CreditPointsToUser(_id).then(function (creditedUser) {
            //                    console.log(creditedUser);
            //                    console.log($scope.gridOptions.data);
            //                    var listLength = $scope.gridOptions.data.length;
            //                    for (var i = 0; i < listLength; i++) {
            //                        var user = $scope.gridOptions.data[i];
            //                        if (user._id === creditedUser._id) {
            //                            console.log("user found!");
            //                            $scope.gridOptions.data[i] = creditedUser;
            //                            for (var i = 0; i < listLength; i++) {
            //                                console.log($scope.gridOptions.data[i])
            //                            }
            //                            $scope.gridApi.core.refresh();
            //                            break;
            //                        }
            //                    }
            //                });
            //            }
            swal({
                title: "Are you sure?",
                text: "Credit points to " + user.firstName,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#77ee77",
                confirmButtonText: "Yes, go ahead!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    swal("Credited!", "Successfully Credited Points.", "success");
                    UserService.CreditPointsToUser(_id).then(function (creditedUser) {
                        console.log(creditedUser);
                        console.log($scope.gridOptions.data);
                        var listLength = $scope.gridOptions.data.length;
                        for (var i = 0; i < listLength; i++) {
                            var user = $scope.gridOptions.data[i];
                            if (user._id === creditedUser._id) {
                                console.log("user found!");
                                $scope.gridOptions.data[i] = creditedUser;
                                for (var i = 0; i < listLength; i++) {
                                    console.log($scope.gridOptions.data[i])
                                }
                                $scope.gridApi.core.refresh();
                                break;
                            }
                        }
                    });
                } else {
                    swal("Cancelled", "No Points Credited", "error");
                }
            });
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
                    displayName: "Points",
                    type: Number
                }, {
                    displayName: "Action",
                    name: "action",
                    enableFiltering: false,
                    enableSorting: false,
                    cellTemplate: '<div align="center"><button type="button" class="button-mod" ng-click="grid.appScope.creditPoints(row.entity)"><span aria-hidden="true">Credit points</span></button></div>'
                }
                 ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };

        $scope.creditPoints = vm.creditPoints;
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
