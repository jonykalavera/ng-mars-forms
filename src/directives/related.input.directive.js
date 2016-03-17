(function() {
    'use strict';

    angular.module('form.widgets')
        .directive('scrolly', scrollyDirective)
        .directive('relatedInput', relatedInputDirective);

    /** ngInject */
    function scrollyDirective($log, $parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var raw = element[0];
                element.bind('scroll', function() {
                    if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                        $log.debug('loadmore...');
                        $parse(attrs.loadMore)(scope);
                    }
                });
            }
        };
    }

    function relatedInputDirective($log) {
        function deleteItems(toRemove, list) {
            var pos;
            angular.forEach(toRemove, function(item) {
                pos = getPos(list, item, 'resource_uri');
                list.splice(pos, 1);
            });
        }
        function getItem(data, uri, idField) {
            var pos = getPos(data, uri, idField);
            if (pos !== -1) {
                return data[pos];
            }
            return null;
        }
        function getPos(data, uri, idField) {
            return data.map(function(itm) {
                return itm[idField];
            }).indexOf(uri);
        }
        function copyTo(model, fromList, toList) {
            var item;
            toList = toList || [];
            angular.forEach(model, function(uri) {
                item = getItem(fromList, uri, 'resource_uri');
                toList.push(item);
            });
            return {to: toList, from: fromList};
        }
        function RelatedInputCtrl($scope, $log, $http) {
            var vm = this;
            vm.busy = false;
            vm.loadMore = function() {
                if (vm.meta.next !== null && !vm.busy) {
                    vm.busy = true;
                    $http.get(vm.meta.next).then(function(res) {
                        $log.debug('More objects', res);
                        vm.objects = vm.objects.concat(res.data.objects);
                        vm.meta = res.data.meta;
                        vm.busy = false;
                    }, function(err) {
                        $log.error('Err loading more objects', err);
                    });
                }
            };
            vm.fakeContent = vm.fakeContent || [];
            vm.idField = vm.idField || 'resource_uri';
            vm.master = vm.master || [];
            vm.leftDisabled = vm.rightDisabled = true;
            $scope.$watch(function() { return vm.fakeContent; }, function(newV) {
                if (angular.isDefined(newV) && newV.length > 0) {
                    vm.leftDisabled = false;
                } else {
                    vm.leftDisabled = true;
                }
            });
            $scope.$watchCollection(function() { return vm.master; }, function(newV) {
                if (angular.isDefined(newV) && newV.length > 0) {
                    vm.rightDisabled = false;
                } else {
                    vm.rightDisabled = true;
                }
            });
        }
        return {
            restrict: 'E',
            require: ['^form', 'ngModel'],
            templateUrl: function(elem, attr) {
                return attr.templateUrl || 'directives/partials/related.input.html';
            },
            bindToController: true,
            controller: RelatedInputCtrl,
            controllerAs: 'related',
            link: function(scope, element, attrs, ctrls) {
                scope.form = ctrls[0];

                element.on('click', function(e) {
                    var target = angular.element(e.target);
                    var copyToRight = scope.related.master.length > 0;
                    var copyToLeft = angular.isDefined(scope.related.fakeContent) && scope.related.fakeContent.length > 0;
                    var isRigthClick = (target[0].className || '') === 'btn btn-link glyphicon glyphicon-circle-arrow-right';
                    var isLeftClick = (target[0].className || '') === 'btn btn-link glyphicon glyphicon-circle-arrow-left';

                    if (angular.isDefined(target[0].className)) {
                        var result;
                        if (isRigthClick && copyToRight) {
                            $log.debug('isRigthClick', copyToRight);
                            result = copyTo(scope.related.master, scope.related.objects, scope.related.content);
                            $log.debug('R', result);
                            scope.$apply(function() {
                                scope.related.content = result.to;
                                scope.related.objects = result.from;

                                deleteItems(scope.related.master, scope.related.objects);
                                scope.related.master = [];
                            });
                        }
                        if (isLeftClick && copyToLeft) {
                            $log.debug('isLeftClick', copyToLeft);
                            result = copyTo(scope.related.fakeContent, scope.related.content, scope.related.objects);
                            $log.debug('L', result);
                            scope.$apply(function() {
                                scope.related.content = result.from;
                                scope.related.objects = result.to;

                                deleteItems(scope.related.fakeContent, scope.related.content);
                                scope.related.fakeContent = [];
                            });

                        }
                    }
                });
            },
            scope: {
                caption: '@caption',
                meta: '=',
                objects: '=objects',
                content: '=ngModel',
                name: '@name',
                helpText: '@helpText',
                multiple: '=',
                idField: '@'
            }
        };
    }

})();
