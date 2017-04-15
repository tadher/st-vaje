var app = angular.module('pmApp', ['ngRoute']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/lokacija', {
                templateUrl: './lokacija.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);