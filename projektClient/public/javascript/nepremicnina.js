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
        let nepremicnina = response.data;
        let lokacija = response.data.lokacija;
        $scope.nepremicnina = nepremicnina;
        $scope.lokacija = lokacija;
    }, function myError(response) {
        $scope.nepremicnina = response.statusText;
        $scope.lokacija = response.statusText;
    });
});

app.controller('nepCtrl', function($scope, $http) {
    $scope.posredovanje= "prodaja";
    $scope.vrsta= "stanovanje";
    $scope.velikost= 100;
    $scope.cena= 100000;
    $scope.opis= "Podroben opis nepremičnine.";
    $scope.lokacija= 0;

    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener("load", onLoad);
    document.getElementById("sin").addEventListener("click", onClick);
    document.getElementById("dodaj").addEventListener("click", addItem);

    function addItem(){
        let objektNepremicnine = localStorage.getItem('nepremicnine');
        let localNepremicnine = JSON.parse(objektNepremicnine);
        var nepremicnina = {
            id: 0,
			posredovanje : $scope.posredovanje,
			vrsta : $scope.vrsta,
            velikost: $scope.velikost,
            cena: $scope.cena,
            opis: $scope.opis,
            lokacija_id: $scope.lokacija
		};
        localNepremicnine.push(nepremicnina);
        nepremicnineJSON = JSON.stringify(localNepremicnine);
        localStorage.setItem('nepremicnine', nepremicnineJSON);
        let refreshNepremicnine = localStorage.getItem('nepremicnine');
        $scope.myData = JSON.parse(refreshNepremicnine);
    };

    function getLocalData(){
        let localNepremicnine = localStorage.getItem('nepremicnine');
        let localLokacije = localStorage.getItem('lokacije');
        //if(localNepremicnine.id == 0) pridobi lokacijo glede na lokacija_id
        $http({
            method : "GET",
            url : "http://localhost:3000/lokacija"
        }).then(function mySucces(response) {          
            $scope.myData = JSON.parse(localNepremicnine);
            $scope.chooseLokacija = JSON.parse(localLokacije);
        });
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
        }, function myError(response) {
            $scope.myData = response.statusText;
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
			        $scope.message = data;
		        });
		        res.error(function(data, status, headers, config) {
			        alert( "failure message: " + JSON.stringify({data: data}));
		        });
                syncGet();
            };
        };
    };

    function onOnline(){
        document.getElementById("status").innerHTML = "User is online";
        syncPost();
        syncGet();   
    };

    function onOffline(){
        document.getElementById("status").innerHTML = "User is offline";
        getLocalData();
    };

    function onLoad(){
        document.getElementById("status").innerHTML = "User is ready";
        getLocalData();
    };

    function onClick(){
        document.getElementById("status").innerHTML = "Button is clicked";
        syncPost();
        syncGet();      
    };   
  
});
