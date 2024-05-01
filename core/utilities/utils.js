(function() {
    "use strict";

    core.utilities.utils = core.utilities.utils || (function() {

        return {

            //#region properties and consts

            //#endregion

            //#region init

            //#endregion

            //#region public functions

            getPropertyCount: function (obj) {
                /// <summary>Get the property count of the object</summary>
                var propertyCount = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        propertyCount++;
                    }
                }
                return propertyCount;
            },

            copyProperties: function (source, target, skipProperties, skipTypes) {
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        if (skipProperties && skipProperties.contains(prop)) {
                            continue;
                        }
                        if (skipTypes && skipTypes.contains(Object.prototype.toString.call(source[prop]))) {
                           continue
                        }
                        target[prop] = source[prop];

                    }
                }
            },

            isUndefined: function (value) {
                return  value === undefined;
            },

            isNullOrEmpty: function (value) {
                return value === null ||
                    value === undefined ||
                    value === "" ||
                    value.length === 0; //check jQuery object and arrays
            },

            isFunctionExists: function (value) {
                return typeof value === "function";
            },

            naturalCompare: function (a, b) {
                //NOTE:
                //  stringArray.sort();               output: 1, 10, 2
                //  stringArray.sort(naturalCompare); output: 1, 2, 10
                var ax = [], bx = [];

                a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                    ax.push([$1 || Infinity, $2 || ""]);
                });
                b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                    bx.push([$1 || Infinity, $2 || ""]);
                });

                while (ax.length && bx.length) {
                    var an = ax.shift();
                    var bn = bx.shift();
                    var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                    if (nn) {
                        return nn;
                    }
                }

                return ax.length - bx.length;
            },

            newGuid: function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            //#endregion

            //#region private functions

            //#endregion


        }

    })();

})();
