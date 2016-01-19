(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;
        
        vm.user = null;
        vm.training = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });

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