(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
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