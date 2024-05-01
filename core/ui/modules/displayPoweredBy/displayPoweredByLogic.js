(function() {
    "use strict";

    function displayPoweredByLogicConfig () {
        this.sendGoogleTrackEvent = false;
    };


    core.ui.modules.displayPoweredByLogic = core.ui.modules.displayPoweredByLogic  || (function() {
        return {

            //#region properties and consts

            config: null,

            //#endregion

            //#region init

            openWecdevUrl: function () {
                var config = core.ui.modules.displayPoweredByLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackEvent("Open wecdev url", "Clicked");
                }
                browser.tabs.openUrl(core.utilities.settings.wecdevUrl);
            }
            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();


    core.ui.modules.displayPoweredByLogic.config =  new displayPoweredByLogicConfig();

})();





