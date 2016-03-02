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
