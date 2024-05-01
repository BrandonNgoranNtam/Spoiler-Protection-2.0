(function() {
    "use strict";

    core.ui.utilities.ui = core.ui.utilities.ui || (function() {

        return {
            //#region properties and consts

            ON_INIT_UI_EVENT_NAME: "onInitUI",
            onInitUIEvent: null,

            //#endregion

            //#region init

            init: function() {
                core.ui.utilities.ui.onInitUIEvent = new Event(core.ui.utilities.ui.ON_INIT_UI_EVENT_NAME);
            },

            addOnInitUIEvent: function(eventFunction) {
                document.addEventListener(core.ui.utilities.ui.ON_INIT_UI_EVENT_NAME, eventFunction, false);
            },

            dispatchOnInitUIEvent: function() {
                document.dispatchEvent(core.ui.utilities.ui.onInitUIEvent);
            },

            getErrorObjectsFromRejectionModelState: function(rejection) {
                var errorList = [];
                if (rejection.data && rejection.data.modelState) {
                    angular.forEach(rejection.data.modelState, function (errors, message) {
                        var error = {};
                        error.errorName = message;
                        error.errorText = errors[0];
                        errorList.push(error);
                    });
                }
                return errorList;
            }

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();

})();


(function() {
    "use strict";

    core.ui.utilities.ui.init();
})();
