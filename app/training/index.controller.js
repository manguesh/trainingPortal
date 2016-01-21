(function () {
    'use strict';

    angular
        .module('app')
        .controller('Training.IndexController', Controller);

    function Controller(TrainingService,UserService,$scope) {
        var vm = this;
        
        vm.users = null;
        vm.trainings = null;
        console.log($scope);
        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                
                vm.users = user;
                $scope.users = user;



            if(user.userType== 1){
                UserService.GetAll().then(function (training){
                 
                vm.trainings = training;
               
                
            }); 
        }else if(user.userType!= 1){
               UserService.GetAllApproved().then(function (training) {
                vm.trainings = training;
                
            });  
            }

        });
           

            
            
            
        }

        $scope.applyTraining = function(_id){
         console.log(_id);
          // TrainingService.applyTraining(_id).then(function (training){
          //                 vm.trainings = training;
                
          //   });

        }

        $scope.approveTraining = function(_id){
            console.log(_id);
        }

        $scope.createTodo=function(){

          TrainingService.Create($scope.formData).then(function (training) {
                TrainingService.GetAll().then(function (training) {
                vm.trainings = training;
                
            }); 
               
            });  
            
        }
    }

})();