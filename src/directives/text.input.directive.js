(function() {
    'use strict';

    angular.module('form.widgets')
        .directive('textInput', textInputDirective);

    function textInputDirective() {
        return {
            restrict: 'E',
            require: ['^form', 'ngModel'],
            link: function(scope, element, attrs, ctrls) {
                scope.form = ctrls[0];
            },
            bindToController: true,
            controller: InputController,
            controllerAs: 'textInput',
            scope: {
                caption: '@caption',
                maxLength: '@maxlength',
                textArea: '=textArea',
                helpText: '@helpText',
                name: '@name',
                content: '=ngModel',
                regexValidator: '=regexValidator',
                requires: '=requires',
                type: '@type'
            },
            templateUrl: 'directives/partials/text.input.html'
        };
    }

    /** @ngInject */
    function InputController() {
        var vm = this;
        vm.getClass = function (element, validators) {
            if (angular.isUndefined(element)) {
                return '';
            }
            validators = validators || [];
            if (vm.requires) {
                validators.push('required');
            }
            var className = '';
            if (angular.isDefined(validators)) {
                angular.forEach(validators, function(validator) {
                    if (element.$error[validator]) {
                        className = 'has-error';
                    }
                });
            }
            return (element.$touched && !element.$valid) ? 'has-error' : className;
        };
        vm.openDatepicker = function($event) {
            if (angular.isDefined($event)) {
                vm._opened = true;
            }
            return vm._opened === true;
        };
        vm.minDate = function() {
            if (angular.isUndefined(vm._minDate) && !vm.dateInPast) {
                vm._minDate = new Date();
            }
            return vm._minDate;
        };
    }

})();
