(function() {
    "use strict";

    function emailFeedbackLogicConfig () {
        this.sendGoogleTrackEvent = false;
    };

    core.ui.modules.emailFeedbackLogic = core.ui.modules.emailFeedbackLogic || (function() {
        return {

            //#region properties and consts

            config: null,

            //#endregion

            //#region init

            //#endregion

            //#region public functions

            openEmailFeedbackMailTo: function() {
                var config = core.ui.modules.emailFeedbackLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackEvent("Email feedback", "Clicked");
                }
                browser.tabs.openMailTo(core.utilities.settings.feedbackMailTo, browser.i18n.getMessage("app_name"));
            }

            //#endregion

            //#region private functions

            //#endregion
        }
    })();

    core.ui.modules.emailFeedbackLogic.config = new emailFeedbackLogicConfig();


})();






