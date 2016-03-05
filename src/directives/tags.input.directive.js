(function() {
    'use strict';
    angular.module('form.widgets')
        .directive('tags', tagsInputDirective);

    function tagsInputDirective() {
        return {
            restrict: 'E',
            require: ['^form', 'ngModel'],
            bindToController: true,
            templateUrl: function(elem, attr) {
                return attr.templateUrl || 'directives/partials/tags.input.html';
            },
            controller: TagsInputController,
            controllerAs: 'tags',
            scope: {
                caption: '=caption',
                displayProperty: '@displayProperty',
                placeholder: '@placeholder',
                tagsModel: '=ngModel',
                objects: '=objects'
            }
        };
    }

    /** ngInject */
    function TagsInputController($scope) {
        var vm = this;
        vm.loadTags = function(query) {
            var matches = [];
            angular.forEach(vm.objects, function(topic) {
                if (angular.lowercase(topic.name).indexOf(angular.lowercase(query)) !== -1) {
                    matches.push(topic.name);
                }
            });
            return matches;
        };

        $scope.$watchCollection(function() { return vm.tagsModel; }, function(newV) {
            var topics = [];
            angular.forEach(newV, function(topic) {
                topic['protected'] = true;
                delete topic.contents_count;
                topics.push(topic);
            });
            vm.tagsModel = topics;
        });
    }

})();
