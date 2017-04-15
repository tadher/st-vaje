var app = angular.module('nepApp', ["ngRoute"]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/:id', {
                templateUrl: './nepremicninaPodrobnosti.html',
                controller: 'podrobnostiCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

app.controller('podrobnostiCtrl', function($scope, $routeParams, $http) {

	let idNep = $routeParams.id;
    $http({
        method : "GET",
        url : "http://localhost:3000/nepremicnina/" + idNep
    }).then(function mySucces(response) {
        $scope.nepremicnina = response.data;
        $scope.lokacija = response.data.lokacija;
    }, function myError(response) {
        let nepremicnine = JSON.parse(localStorage.getItem('nepremicnine'));
        let lokacije = JSON.parse(localStorage.getItem('lokacije'));
        let idLok = 0;
        for(var i = 0; i < Object.keys(nepremicnine).length; i++){
             if(nepremicnine[i].id == idNep){
                $scope.nepremicnina = nepremicnine[i];
                idLok = nepremicnine[i].lokacija_id;
             };
        };
        for(var i = 0; i < Object.keys(lokacije).length; i++){
             if(lokacije[i].id == idLok){
                $scope.lokacija = lokacije[i];
             };
        };
        console.log(JSON.stringify(nepremicnine));
    });
});

app.controller('nepCtrl', function($scope, $http) {
    $scope.posredovanje= "prodaja";
    $scope.vrsta= "stanovanje";
    $scope.velikost= 100;
    $scope.cena= 100000;
    $scope.opis= "Podroben opis nepremičnine.";
    $scope.lokacija= 0;
    $scope.message= "";

    $scope.getLocalData = function(){
        $scope.myData = JSON.parse(localStorage.getItem('nepremicnine'));
        $scope.chooseLokacija = JSON.parse(localStorage.getItem('lokacije'));
    };

    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', $scope.getLocalData());
    window.addEventListener("load", $scope.getLocalData());
    document.getElementById("sin").addEventListener("click", onClick);
    document.getElementById("dodaj").addEventListener("click", addItem);

    function addItem(){
        let localNepremicnine = JSON.parse(localStorage.getItem('nepremicnine'));
        let lokacije = JSON.parse(localStorage.getItem('lokacije'));
        let idLok = $scope.lokacija;
        let lokacija = '{}';
        for(var i = 0; i < Object.keys(lokacije).length; i++){
             if(lokacije[i].id == idLok){
                lokacija = lokacije[i];
                console.log(lokacija);
             };
        };
        var nepremicnina = {
            id: 0,
			posredovanje : $scope.posredovanje,
			vrsta : $scope.vrsta,
            velikost: $scope.velikost,
            cena: $scope.cena,
            opis: $scope.opis,
            lokacija_id: $scope.lokacija,
            lokacija: lokacija
		};
        localNepremicnine.push(nepremicnina);
        nepremicnineJSON = JSON.stringify(localNepremicnine);
        localStorage.setItem('nepremicnine', nepremicnineJSON);
        let refreshNepremicnine = localStorage.getItem('nepremicnine');
        $scope.myData = JSON.parse(refreshNepremicnine);
    };

    function syncGet(){
         $http({
            method : "GET",
            url : "http://localhost:3000/nepremicnina/lokacija"
        }).then(function mySucces(response) {
            let nepremicnine = response.data.nepremicnine;
            nepremicnineJSON = JSON.stringify(nepremicnine);
            localStorage.setItem('nepremicnine', nepremicnineJSON);
            let localNepremicnine = localStorage.getItem('nepremicnine');
            $scope.myData = JSON.parse(localNepremicnine);
            $scope.message = "Sinhronizacija izvedena.";
        }, function myError(response) {
            $scope.myData = JSON.parse(localStorage.getItem('nepremicnine'));
            $scope.message = "Ni povezave s strežnikom.";
        });
    };

    function syncPost(){
        let objektNepremicnine = localStorage.getItem('nepremicnine') || '{}';
        let localNepremicnine = JSON.parse(objektNepremicnine);
        for(var i = 0; i < Object.keys(localNepremicnine).length; i++){
            if(localNepremicnine[i].id == 0){
                console.log(localNepremicnine[i].opis);
                var res = $http.post('http://localhost:3000/nepremicnina', localNepremicnine[i]);
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
