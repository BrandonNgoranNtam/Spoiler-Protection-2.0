(function() {
    "use strict";

    function openFacebookGroupUrlLogicConfig() {
        this.sendGoogleTrackEvent = false;
    };

    app.ui.modules.openFacebookGroupUrlLogic = app.ui.modules.openFacebookGroupUrlLogic  || (function() {
        return {

            //#region properties and consts

            config: null,

            //#endregion

            //#region init

            //#endregion

            //#region public functions

            //#endregion

            //# region private functions


            openOrReloadFacebookGroupUrl: function () {
                var config = app.ui.modules.openFacebookGroupUrlLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackEvent("Open facebook group", "Clicked");
                }
                browser.tabs.isPageActiveByUrl(core.utilities.settings.facebookGroupUrl, browser.tabs.reloadCurrentTab, app.ui.modules.openFacebookGroupUrlLogic.openFacebookGroupUrl);
            },

            openFacebookGroupUrl: function () {

                browser.tabs.openUrl(core.utilities.settings.facebookGroupUrl);
            },


            //#endregion
        }
    })();


    app.ui.modules.openFacebookGroupUrlLogic.config = new openFacebookGroupUrlLogicConfig();

})();







