var app = angular.module('lokApp', ["ngRoute"]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/:id', {
                templateUrl: './lokacijaPodrobnosti.html',
                controller: 'podrobnostiCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

app.controller('podrobnostiCtrl', function($scope, $routeParams, $http) {

	let idLok = $routeParams.id;
    $http({
        method : "GET",
        url : "http://localhost:3000/lokacija/" + idLok
    }).then(function mySucces(response) {
        let lokacija = response.data;
        $scope.lokacija = lokacija;
    }, function myError(response) {
        let lokacije = JSON.parse(localStorage.getItem('lokacije'));
        for(var i = 0; i < Object.keys(lokacije).length; i++){
             if(lokacije[i].id == idLok){
                $scope.lokacija = lokacije[i];
             };
        };
    });
});

app.controller('lokCtrl', function($scope, $http) {
    $scope.kraj= "Celje";
    $scope.regija= "Savinjska";
    $scope.message= "";

    $scope.getLocalData = function(){
        $scope.myData = JSON.parse(localStorage.getItem('lokacije'));
    };

    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', $scope.getLocalData());
    window.addEventListener("load", $scope.getLocalData());
    document.getElementById("sin").addEventListener("click", onClick);
    document.getElementById("dodaj").addEventListener("click", addItem);

    function addItem(){
        let localLokacije = JSON.parse(localStorage.getItem('lokacije'));
        var lokacija = {
            id: 0,
			kraj : $scope.kraj,
			regija : $scope.regija,
            dolzina: 0,
            sirina: 0
		};
        localLokacije.push(lokacija);
        lokacijeJSON = JSON.stringify(localLokacije);
        localStorage.setItem('lokacije', lokacijeJSON);
        $scope.myData = JSON.parse(localStorage.getItem('lokacije'));
    };

    function syncGet(){
         $http({
            method : "GET",
            url : "http://localhost:3000/lokacija"
        }).then(function mySucces(response) {
            let lokacije = response.data.lokacije;
            lokacijeJSON = JSON.stringify(lokacije);
            localStorage.setItem('lokacije', lokacijeJSON);
            $scope.myData = JSON.parse(localStorage.getItem('lokacije'));
            $scope.message = "Sinhronizacija izvedena.";
        }, function myError(response) {
            $scope.myData = JSON.parse(localStorage.getItem('lokacije'));
            $scope.message = "Ni povezave s strežnikom.";
        });
    };

    function syncPost(){
        let localLokacije = JSON.parse(localStorage.getItem('lokacije'));
        for(var i = 0; i < Object.keys(localLokacije).length; i++){
            if(localLokacije[i].id == 0){
                console.log(localLokacije[i].kraj);
                var res = $http.post('http://localhost:3000/lokacija', localLokacije[i]);
		        res.success(function(data, status, headers, config) {
			        $scope.message = "Sinhronizacija izvedena.";
		        });
		        res.error(function(data, status, headers, config) {
			        $scope.message = "Ni povezave s strežnikom.";
		        });
                syncGet();
            };
        };
    };

    function onOnline(){
        syncPost();
        syncGet();   
    };

    function onClick(){
        syncPost();
        syncGet();      
    };   
  
});
