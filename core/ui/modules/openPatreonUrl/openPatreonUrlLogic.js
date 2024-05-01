(function() {
    "use strict";

    function openPatreonUrlLogicConfig() {
        this.sendGoogleTrackEvent = false;
    };

    core.ui.modules.openPatreonUrlLogic = core.ui.modules.openPatreonUrlLogic  || (function() {
        return {

            //#region properties and consts

            config: null,

            //#endregion

            //#region init

            //#endregion

            //#region public functions

            //#endregion

            //# region private functions

            openPatreonUrl: function() {
                var config = core.ui.modules.openPatreonUrlLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackEvent("Popup support " + "Patreon", "Clicked");
                }
                window.open(core.utilities.settings.developerPatreonUrl);
            },


            openKofiUrl: function() {
                var config = core.ui.modules.openPatreonUrlLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackEvent("Popup support " + "Kofi", "Clicked");
                }
                window.open(core.utilities.settings.developerKofiUrl);
            }
            //#endregion
        }
    })();


    core.ui.modules.openPatreonUrlLogic.config = new openPatreonUrlLogicConfig()
})();







