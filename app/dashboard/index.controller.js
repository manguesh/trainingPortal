(function(){
    'use strict';

    angular
        .module('app')
        .controller('Dashboard.IndexController', Controller);

    function Controller(TrainingService, UserService, $scope){
        var vm = this;
        vm.allUsers = null;
        vm.allTrainings = null;
        vm.chartData = {};
        initController();
        function initController(){
            console.log("Controller initiated Index");
            UserService.GetCurrent().then(function (user) {
                vm.currentUser = user;
                $scope.currentUser = user;
                UserService.GetAllUsers().then(function (allUsers) {
                    vm.allUsers = allUsers;
                    vm.chartData.labels = extractArray(vm.allUsers,"firstName");
                    vm.chartData.data = extractArray(vm.allUsers,"creditPoints");
                });
                if (user.userType == 1) {

                } else if (user.userType != 1) {

                }
            });
        }

        //LINE CHART
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        //BAR CHART
        $scope.labelsBar = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        $scope.seriesBar = ['Series A', 'Series B'];

        $scope.dataBar = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];


        //PIE-POLAR AREA DYNAMIC CHART, TOGGLE BETWEEN THE TWO ON TRIGGERING toggle fn
        vm.chartData.type = 'PolarArea';
        vm.chartData.toggle = function () {
            vm.chartData.type = vm.chartData.type === 'PolarArea' ?
                'Pie' : 'PolarArea';
        };
    }
    //constructs an array of a particular field <field> from an array of objects
    function extractArray(objectArray,field){
        var newObjectArray = [];
        for(var i=0; i< objectArray.length ;i++){
            newObjectArray.push(objectArray[i][field]);
        }
        return newObjectArray;
    }
})();
