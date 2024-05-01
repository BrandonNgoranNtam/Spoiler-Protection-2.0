(function() {
    "use strict";

    core.utilities.settings = core.utilities.settings || (function() {

        return {

            //#region properties and consts
            settingModifierModules: new Array(),

            EVENT_NAME_ON_EXTEND_SETTINGS: "onExtendSettings",
            onExtendSettingsEvent: null,

            isDebug: false,
            name: browser.i18n.getMessage("app_name"),




            //#endregion

            //#region init

            init: function () {
                core.utilities.settings.onExtendSettingsEvent = new Event(core.utilities.settings.EVENT_NAME_ON_EXTEND_SETTINGS);

                if (browser && browser.app && browser.app.getDetails() != null) {
                    core.utilities.settings.version = browser.app.getDetails().version;
                }
                core.utilities.settings.loadSettingsFromStorage();

            },

            addSettingModifierModule: function(module) {
                if (core.utilities.utils.isNullOrEmpty(module.moduleName)) {
                    throw "module.moduleName property doesn't exists, it must be a valid javascript property name";
                }
                if (!core.utilities.utils.isFunctionExists(module.initSettingsDefaultValues)) {
                    throw "module.initSettingsDefaultValues function doesn't exists";
                }

                core.utilities.settings.settingModifierModules.push(module);
            },

            //NOTE: we call this on the update page, to ensure all module settings is initialized
            checkAllModulesDefaultValuesIsInitialized: function (successCallback) {
                core.utilities.settings.loadSettingsFromStorage(function () {
                    var updateSettingsInStorage = false;

                    for(var i = 0; i < core.utilities.settings.settingModifierModules.length; i++) {
                        var module = core.utilities.settings.settingModifierModules[i];
                        if (!core.utilities.settings.hasOwnProperty(module.moduleName)) {
                            module.initSettingsDefaultValues();
                            updateSettingsInStorage = true;
                        }
                    }

                    if (updateSettingsInStorage) {
                        core.utilities.settings.updateSettingsInStorage(successCallback);
                    } else {
                        successCallback();
                    }
                });

            },



            addOnExtendSettingsEvent: function(eventFunction) {
                document.addEventListener(core.utilities.settings.EVENT_NAME_ON_EXTEND_SETTINGS, eventFunction, false);
            },

            dispatchOnExtendSettingsEvent: function() {
                document.dispatchEvent(core.utilities.settings.onExtendSettingsEvent);
            },



            //#endregion

            //#region public functions
            loadSettingsFromStorage: function(successCallback) {
                browser.storage.sync.get("settings", function (items) {
                    //set properties from storage to the settings
                    core.utilities.utils.copyProperties(items.settings, core.utilities.settings);
                    if (successCallback) {
                        successCallback();
                    }
                });
            },

            resetSettingsWithDefaultValues: function(successCallback) {
                for(var i = 0; i < core.utilities.settings.settingModifierModules.length; i++) {
                    core.utilities.settings.settingModifierModules[i].initSettingsDefaultValues();
                }
                core.utilities.settings.updateSettingsInStorage(successCallback);
            },

            updateSettingsInStorage: function(successCallback) {
                //NOTE: storage serialization corrupts the functions and Event-s
                //We can't put the original settings object to the storage, so we create a copy with the properties only (skipping functions and Events)
                var toStorage = {};
                var skipTypes = new Array();
                skipTypes.push("[object Function]");
                skipTypes.push("[object Event]");
                var skipProperties = new Array();
                //We also skip the module list, because these objects too and we call functions from modules
                skipProperties.push("settingModifierModules");
                core.utilities.utils.copyProperties(core.utilities.settings, toStorage, skipProperties, skipTypes);

                var settingContainer = {
                    settings: toStorage
                };
                browser.storage.sync.set(settingContainer, function () {
                    if (successCallback) {
                        successCallback();
                    }
                });
            },

            toggleBooleanSettingInStorage: function(modulename, propertyName, successCallback) {
                var newOptionValue = !core.utilities.settings[modulename][propertyName];
                core.utilities.settings[modulename][propertyName] = newOptionValue;

                //after the setting get back to storage we call the necessary function
                core.utilities.settings.updateSettingsInStorage(function () {
                    if (successCallback) {
                        successCallback(newOptionValue);
                    }
                });
            }

            //#endregion

            //#region private functions

            //#endregion
        }
    })();
})();

(function() {
    "use strict";

    core.utilities.settings.init();
})();
