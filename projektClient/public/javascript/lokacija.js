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
        $scope.lokacija = response.statusText;
    });
});

app.controller('lokCtrl', function($scope, $http) {
    $scope.kraj= "Celje";
    $scope.regija= "Savinjska";

    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener("load", onLoad);
    document.getElementById("sin").addEventListener("click", onClick);
    document.getElementById("dodaj").addEventListener("click", addItem);

    function addItem(){
        let objektLokacije = localStorage.getItem('lokacije');
        let localLokacije = JSON.parse(objektLokacije);
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
        let refreshLokacije = localStorage.getItem('lokacije');
        $scope.myData = JSON.parse(refreshLokacije);
    };

    function getLocalData(){
        $http({
            method : "GET",
            url : "http://localhost:3000/lokacija"
        }).then(function mySucces(response) {
            let localLokacije = localStorage.getItem('lokacije');
            $scope.myData = JSON.parse(localLokacije);
        });
    };

    function syncGet(){
         $http({
            method : "GET",
            url : "http://localhost:3000/lokacija"
        }).then(function mySucces(response) {
            let lokacije = response.data.lokacije;
            lokacijeJSON = JSON.stringify(lokacije);
            localStorage.setItem('lokacije', lokacijeJSON);
            let localLokacije = localStorage.getItem('lokacije');
            $scope.myData = JSON.parse(localLokacije);
        }, function myError(response) {
            $scope.myData = response.statusText;
        });
    };

    function syncPost(){
        let objektLokacije = localStorage.getItem('lokacije');
        let localLokacije = JSON.parse(objektLokacije);
        for(var i = 0; i < Object.keys(localLokacije).length; i++){
            if(localLokacije[i].id == 0){
                console.log(localLokacije[i].kraj);
                var res = $http.post('http://localhost:3000/lokacija', localLokacije[i]);
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


    





