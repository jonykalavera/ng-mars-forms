(function() {
    'use strict';

    angular.module('form.widgets', ['ngTagsInput']);

})();

(function() {
    'use strict';
    angular.module('form.widgets')
        .directive('dateInput', dateInputDirective)

    // Date input directive
    function dateInputDirective() {
        return {
            restrict: 'E',
            require: ['^form', 'ngModel'],
            link: function(scope, element, attrs, ctrls) {
                scope.form = ctrls[0];
            },
            bindToController: true,
            controller: InputController,
            controllerAs: 'dateInput',
            scope: {
                caption: '@caption',
                helpText: '@helpText',
                name: '@name',
                content: '=ngModel',
                dateInPast: '=dateInPast'
            },
            templateUrl: function(elem, attr) {
                return attr.templateUrl || 'directives/partials/date.input.html';
            }
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

(function() {
    'use strict';

    angular.module('form.widgets')
        .filter('toArray', toArrayFilter)
        .filter('cleanObjects', cleanObjectsFilter);
    
    function toArrayFilter() {
        return function (obj, addKey) {
            if (addKey === false) {
                return Object.keys(obj).map(function(key) {
                    return obj[key];
                });
            } else {
                return Object.keys(obj).map(function(key) {
                    if(typeof obj[key] == 'object') {
                        return Object.defineProperty(obj[key], '$key', {enumerable: false, value: key});
                    }
                });
            }
        };
    }

    /**
     * Removes common items and return a the new list.
     * @params: i -> the original objects list
     *          u -> the objects to search for
     *          idField (optional) -> the verification key.
     */
    function cleanObjectsFilter() {
        function getPos(data, uri, idField) {
            return data.map(function(itm) {
                return itm[idField];
            }).indexOf(uri);
        }
        return function(i, u, idField) {
            if (angular.isDefined(i) && angular.isDefined(u)) {
                idField = idField || 'resource_uri';
                u.map(function(itm) {
                    var pos = getPos(i, itm[idField], idField);
                    if (pos !== -1) {
                        i.splice(pos, 1);
                    }
                });
                return i;
            }
            return i; // Don't make the filter
        };
    }

})();

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
                required: '=required',
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

(function() {
    'use strict';

    angular.module('form.widgets')
        .directive('relatedInput', relatedInputDirective);

    /** ngInject */
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
        function RelatedInputCtrl($scope) {
            var vm = this;
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

(function() {
    'use strict';

    angular.module('form.widgets')
        .directive('textInput', textInputDirective);

    function textInputDirective() {
        return {
            restrict: 'E',
            require: ['^form', 'ngModel'],
            replace: true,
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
            templateUrl: function(elem, attr) {
                return attr.templateUrl || 'directives/partials/text.input.html';
            }
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
