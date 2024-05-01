(function() {
    "use strict";

    function resetExtensionLogicConfig() {
        this.resetExtensionFunction = null;
        this.sendGoogleTrackEvent = false;
    };

    core.ui.modules.resetExtensionLogic = core.ui.modules.resetExtensionLogic  || (function() {
        return {

            //#region properties and consts

            config: null,

            //#endregion

            //#region init

            //#endregion

            //#region public functions

            resetExtension: function() {
                var config = core.ui.modules.resetExtensionLogic.config;
                $.confirm({
                    type: 'red',
                    useBootstrap:false,
                    boxWidth:'50%',
                    title:  browser.i18n.getMessage("reset"),
                    content: browser.i18n.getMessage("reset_confirm_text"),
                    buttons: {
                        confirm: {
                            btnClass: 'btn-red',
                            text: browser.i18n.getMessage("yes"),
                            action: function () {
                                if (config.sendGoogleTrackEvent) {
                                    core.utilities.googleAnalitics.trackEvent("Reset extension", "Confirmed");
                                }
                                core.utilities.settings.resetSettingsWithDefaultValues(function () {
                                    if (config.resetExtensionFunction) {
                                        config.resetExtensionFunction();
                                    }
                                });
                            }
                        },
                        cancel: {
                            text: browser.i18n.getMessage("no"),
                            btnClass: 'btn-default',
                            action: function () {
                                if (config.sendGoogleTrackEvent) {
                                    core.utilities.googleAnalitics.trackEvent("Reset extension", "Revoked");
                                }
                            }
                        }
                    }
                });

            }

            //#endregion

            //#region private functions

            //#endregion

        }
    })();

    core.ui.modules.resetExtensionLogic.config = new resetExtensionLogicConfig();

})();






