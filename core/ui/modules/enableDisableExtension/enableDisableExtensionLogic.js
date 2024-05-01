(function() {
    "use strict";

    function enableDisableExtensionLogicConfig() {
        this.extensionOnEnabledFunction = null;
        this.extensionOnDisabledFunction = null;
        this.sendGoogleTrackEvent = false;
    };

    core.ui.modules.enableDisableExtensionLogic = core.ui.modules.enableDisableExtensionLogic || (function() {
        return {

            //#region properties and consts

            moduleName: "enableDisableExtension",
            config: null,

            //#endregion

            //#region init

            extendMessage: function () {
                core.utilities.message.ACTION_DISABLE_EXTENSION = "disableExtension";
            },

            initSettingsDefaultValues: function () {
                core.utilities.settings.enableDisableExtension = {};
                core.utilities.settings.enableDisableExtension.extensionIsEnabled = true;
            },

            extendSetting: function () {
                core.utilities.settings.toggleExtensionIsEnabled = function (callbackFunction) {
                    //NOTE: core.utilities.settings.updateSettingsInStorage is called in core.utilities.settings.toggleBooleanSettingInStorage
                    //NOTE: So we don't call it here
                    core.utilities.settings.toggleBooleanSettingInStorage(core.ui.modules.enableDisableExtensionLogic.moduleName, "extensionIsEnabled", callbackFunction)
                };
            },

            //#endregion

            //#region public functions

            getExtensionIsEnabled: function() {
                return core.utilities.settings.enableDisableExtension.extensionIsEnabled;
            },

            toggleExtensionIsEnabled: function(event) {
                var config = core.ui.modules.enableDisableExtensionLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackBootstrapToggleEvent(event, "Option: Disable extension");
                }
                core.utilities.settings.toggleExtensionIsEnabled(core.ui.modules.enableDisableExtensionLogic.enabledDisabledSettingChangedCallback);
            },

            //Note: this is a callback function to toggleBooleanSettingInStorage, this always send back the new value
            enabledDisabledSettingChangedCallback: function(extensionIsEnabled) {
                var config = core.ui.modules.enableDisableExtensionLogic.config;

                if (extensionIsEnabled) {
                    if (config.extensionOnEnabledFunction) {
                        config.extensionOnEnabledFunction();
                    }
                } else {
                    var message = core.utilities.message.getMessage(core.utilities.message.ACTION_DISABLE_EXTENSION);
                    browser.tabs.sendMessageToActiveTabs(message, function() {
                        if (config.extensionOnDisabledFunction) {
                            config.extensionOnDisabledFunction();
                        }
                    });
                }
            }

            //#endregion

            //#region private functions

            //#endregion
        }
    })();

    core.ui.modules.enableDisableExtensionLogic.config = new enableDisableExtensionLogicConfig();

    core.utilities.settings.addSettingModifierModule(core.ui.modules.enableDisableExtensionLogic);
    core.utilities.settings.addOnExtendSettingsEvent(core.ui.modules.enableDisableExtensionLogic.extendSetting);
    core.utilities.message.addOnExtendMessagesEvent(core.ui.modules.enableDisableExtensionLogic.extendMessage);

})();





