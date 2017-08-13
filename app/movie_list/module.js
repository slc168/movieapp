(function(angular) {
    'use strict';

    // 定义一个模块
    angular.module('moviecat.movie_list', ['ngRoute', 'moviecat.services.http'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/:category/:page?', {
                templateUrl: 'movie_list/view.html',
                controller: 'MovieListController'
            });
        }])

        .controller('MovieListController', [
            '$scope',
            '$route',
            '$routeParams',
            'HttpService',
            function($scope, $route, $routeParams, HttpService) {

                console.log($routeParams);
                var pageSize = 5;

                $scope.page = parseInt($routeParams.page || 1);

                var start = ($scope.page - 1) * 5;

                $scope.title = 'Loading...';
                $scope.movies = [];
                $scope.loading = true;
                $scope.totalCount = 0; // 条数
                $scope.totalPage = 0; // 页数


                HttpService
                    .jsonp(
                        'http://api.douban.com/v2/movie/' + $routeParams.category,
                        { start: start, count: pageSize, q: $routeParams.q },
                        function(data) {
                            $scope.loading = false;
                            $scope.title = data.title;
                            $scope.movies = data.subjects;
                            $scope.totalCount = data.total;
                            $scope.totalPage = Math.ceil(data.total / pageSize);
                            $scope.$apply(); // 强制同步数据到界面
                        }
                    );

                // 暴露一个翻页的行为
                $scope.go = function(page) {
                    if (0 < page && page < $scope.totalPage + 1)
                        $route.updateParams({ page: page });//更新page
                };

            }
        ]);

})(angular);
