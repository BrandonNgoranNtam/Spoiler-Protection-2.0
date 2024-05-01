(function() {
    "use strict";

    app.welcome = app.welcome || (function() {

            return {

                //#region properties and consts

                //#endregion

                //#region init

                init: function() {
                    core.utilities.settings.resetSettingsWithDefaultValues(function () {
                        core.ui.utilities.ui.dispatchOnInitUIEvent();
                    });

                }

                //#endregion

                //#region public functions

                //#endregion

                //#region private functions

                //#endregion
            }
        })();
})();

$(document).ready(function () {
    app.welcome.init();
    core.utilities.googleAnalitics.trackPage("welcome.html", core.utilities.settings.extensionName + " - Welcome page");
});

