(function() {
    'use strict';

    angular.module('form.widgets')
        .directive('fileOnChange', FileOnChange)
        .directive('imageInput', imageInputDirective);

    // image input directive
    /** @ngInject */
    function imageInputDirective($parse, $log) {
        return {
            restrict: 'E',
            require: ['^form', 'ngModel'],
            replace: false,
            bindToController: true,
            controller: ImageInputController,
            controllerAs: 'imageInput',
            link: function(scope, element, attrs, ctrls) {
                scope.form = ctrls[0];

                scope.$watch(function() {
                    return scope.imageInput.theImageContent;
                }, function(newV) {
                    var imageIsValid = true;
                    if (angular.isDefined(newV) && newV instanceof File) {
                        // Image is valid unless not in imageTypes
                        scope.form[attrs.name].$setValidity('required', true);

                        var normalizeExtension = angular.lowercase(newV.type);
                        var isNotValid = (normalizeExtension !== 'image/jpg' && normalizeExtension !== 'image/jpeg'
                                          && normalizeExtension !== 'image/png');
                        $log.log('ext', normalizeExtension);
                        $log.log('is not valid?', isNotValid);
                        if (isNotValid) {
                            scope.form[attrs.name].$setValidity('required', false);
                            scope.form[attrs.name].$error.message = 'Invalid image';
                            imageIsValid = false;
                            throw 'Invalid image file';
                        }
                    } else if (newV === null) {
                        // Image invalidated from controller
                        scope.form[attrs.name].$setValidity('required', false);
                    }
                    $parse(scope.imageInput.setImageValidity)(imageIsValid); // update vm.validImage
                });
            },
            scope: {
                browseText: '@browseText',
                caption: '@caption',
                name: '@name',
                imageThumbnail: '@imageThumbnail',
                theImageContent: '=ngModel',
                blank: '=',
                helpText: '@helpText'
            },
            templateUrl: function(elem, attr) {
                return attr.templateUrl || 'directives/partials/image.input.html';
            }
        };
    }

    // image input controller
    /** @ngInject */
    function ImageInputController($scope) {
        var vm = this;

        vm.setImageValidity = function(value) {
            vm.validImage = value;
        };

        vm.uploadMe = function(files, field) {
            if (angular.isUndefined(field)) {
                field = 'image';
            }

            if (angular.isDefined(files)) {
                var file = files[0];
                vm.theImageContent = file;
                $scope.$apply(); // Apply scope to validate file is image

                if (vm.validImage) { // Image has been validated
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        var b64String = e.target.result.replace('data:' + vm.theImageContent.type + ';base64,', '');
                        vm.theImageContent = {
                            filename: vm.theImageContent.name, b64string: b64String,
                            content_type: vm.theImageContent.type, fileSize: vm.theImageContent.size
                        };
                        $scope.$apply();
                    };
                    try {
                        reader.readAsDataURL(file);
                    } catch(e) {
                        vm.theImageContent = null;
                        $scope.$apply();
                    }
                }
            }
        };
    }

    /** @ngInject */
    function FileOnChange($log, $parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, ngModel) {
                element.bind('change', function(event) {
                    $parse(attrs.fileOnChange)(scope, { files: event.target.files, field: attrs.name });
                });
            }
        };
    }

})();
