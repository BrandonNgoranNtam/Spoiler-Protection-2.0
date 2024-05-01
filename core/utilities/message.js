(function() {
    "use strict";

    core.utilities.message = core.utilities.message || (function() {

        return {

            //#region properties and consts

            ON_EXTEND_MESSAGES_EVENT_NAME: "onExtendMessages",
            onExtendMessagesEvent: null,

            //#endregion

            //#region init

            init: function() {
                core.utilities.message.onExtendMessagesEvent = new Event(core.utilities.message.ON_EXTEND_MESSAGES_EVENT_NAME);
            },

            addOnExtendMessagesEvent: function(eventFunction) {
                document.addEventListener(core.utilities.message.ON_EXTEND_MESSAGES_EVENT_NAME, eventFunction, false);
            },

            dispatchOnExtendMessagesEvent: function() {
                document.dispatchEvent(core.utilities.message.onExtendMessagesEvent);
            },

            //#endregion

            //#region public functions

            getMessage: function (action, parameter) {
                var message = {};
                message.action = action;
                message.parameter = parameter;

                return message;
            }

            //#endregion

            //#region private functions

            //#endregion
        }
    })();
})();

(function() {
    "use strict";

    core.utilities.message.init();

})();


