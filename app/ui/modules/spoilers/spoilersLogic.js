(function() {
    "use strict";

    function spoilersLogicConfig() {
        this.sendGoogleTrackEvent = false;
    };

    app.ui.modules.spoilersLogic = app.ui.modules.spoilersLogic  || (function() {
        return {

            //#region properties and consts

            moduleName: "spoilers",
            config: null,

            //#endregion

            //#region init

            extendMessage: function() {
                core.utilities.message.ACTION_RELOAD_CURRENT_TAB_SPOILERS = "reloadCurrentTabSpoilers";

                core.utilities.message.sendReloadCurrentTabSpoilersMessage = function(successCallback) {
                    var message = core.utilities.message.getMessage(core.utilities.message.ACTION_RELOAD_CURRENT_TAB_SPOILERS);
                    browser.tabs.sendMessageToActiveTabs(message, successCallback)
                };
            },

            initSettingsDefaultValues: function() {
                core.utilities.settings.spoilers = {};
                core.utilities.settings.spoilers.spoilerStringList = [];
                core.utilities.settings.spoilers.isSpoilerNameVisible = true;
                core.utilities.settings.spoilers.isSpoilerCategoryVisible = true;
                core.utilities.settings.spoilers.isSpoilerListVisible = true;
                core.utilities.settings.spoilers.isImagesVisible = true;
                core.utilities.settings.spoilers.isVideosVisible = true;
            },

            extendSetting: function() {
                //spoilerStringList
                core.utilities.settings.addSpoilersToSpoilerSettings =  function(spoilerList, successCallback) {
                    var spoilerStringList = core.utilities.settings.spoilers.spoilerStringList;
                    $.each(spoilerList, function (key, value) {
                        var spoilerText = value.trimString();
                        if (!spoilerText.isNullOrWhiteSpace()) {
                            if (spoilerStringList.indexOf(spoilerText) === -1) {
                                spoilerStringList.push(spoilerText);
                            }
                        }
                    });

                    core.utilities.settings.updateSettingsInStorage(successCallback);
                };

                core.utilities.settings.removeSpoilersFromSettings =  function(spoilersToRemove, successCallback) {
                    var spoilerStringList = core.utilities.settings.spoilers.spoilerStringList;
                    $.each(spoilersToRemove, function (key, value) {
                        spoilerStringList.remove(value);
                    });

                    core.utilities.settings.updateSettingsInStorage(successCallback);
                };

                //isSpoilerNameVisible
                core.utilities.settings.toggleIsSpoilerNameVisible = function(callbackFunction) {
                    core.utilities.settings.toggleBooleanSettingInStorage(app.ui.modules.spoilersLogic.moduleName,"isSpoilerNameVisible", callbackFunction)
                };

                //isSpoilerCategoryVisible
                core.utilities.settings.toggleIsSpoilerCategoryVisible = function(callbackFunction) {
                    core.utilities.settings.toggleBooleanSettingInStorage(app.ui.modules.spoilersLogic.moduleName,"isSpoilerCategoryVisible", callbackFunction)
                };

                //isSpoilerListVisible
                core.utilities.settings.toggleIsSpoilerListVisible = function(callbackFunction) {
                    core.utilities.settings.toggleBooleanSettingInStorage(app.ui.modules.spoilersLogic.moduleName, "isSpoilerListVisible", callbackFunction)
                };

                //isImagesVisible
                core.utilities.settings.toggleIsImagesVisible = function(callbackFunction) {
                    core.utilities.settings.toggleBooleanSettingInStorage(app.ui.modules.spoilersLogic.moduleName, "isImagesVisible", callbackFunction)
                }; 
                
                 //isVideosVisible
                 core.utilities.settings.toggleIsVideosVisible = function(callbackFunction) {
                    core.utilities.settings.toggleBooleanSettingInStorage(app.ui.modules.spoilersLogic.moduleName, "isVideosVisible", callbackFunction)
                };   
            },

            //#endregion

            //#region public functions

            getIsSpoilerNameVisible: function() {
                return core.utilities.settings.spoilers.isSpoilerNameVisible;
            },

            getIsSpoilerCategoryVisible: function() {
                return core.utilities.settings.spoilers.isSpoilerCategoryVisible;
            },

            getIsSpoilerListVisible: function() {
                return core.utilities.settings.spoilers.isSpoilerListVisible;
            },

            getIsImagesVisible: function() {
                return core.utilities.settings.spoilers.isImagesVisible;
            },

            getIsVideosVisible: function() {
                return core.utilities.settings.spoilers.isVideosVisible;
            },

            
            

            toggleSpoilerNameVisibility: function() {
                //toggleBooleanSettingInStorage passes the new boolean value to the sendReloadCurrentTabSpoilersMessage
                //to avoid exception we have to call within a function
                core.utilities.settings.toggleIsSpoilerNameVisible(function () {
                    core.utilities.message.sendReloadCurrentTabSpoilersMessage();
                });

                //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
                var config = app.ui.modules.spoilersLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackBootstrapToggleEvent(event, "Option: Hide spoiler name");
                }
            },

            toggleSpoilerCategoryVisibility: function() {
                //toggleBooleanSettingInStorage passes the new boolean value to the sendReloadCurrentTabSpoilersMessage
                //to avoid exception we have to call within a function
                core.utilities.settings.toggleIsSpoilerCategoryVisible(function () {
                    core.utilities.message.sendReloadCurrentTabSpoilersMessage();
                });

                //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
                var config = app.ui.modules.spoilersLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackBootstrapToggleEvent(event, "Option: Show/Hide spoiler category");
                }
            },

            toggleSpoilerListVisibility: function(uiCallback) {
                core.utilities.settings.toggleIsSpoilerListVisible(uiCallback);
                //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
                var config = app.ui.modules.spoilersLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackBootstrapToggleEvent(event, "Option: Show/Hide spoiler list");
                }
            },

            toggleImagesVisibility: function() {
                
                //toggleImagesVisibility passes the new boolean value to the sendReloadCurrentTabSpoilersMessage
                //to avoid exception we have to call within a function
                core.utilities.settings.toggleIsImagesVisible(function () {                    
                    if (app.ui.modules.spoilersLogic.getIsImagesVisible()) {
                        browser.tabs.reloadActiveTabs();
                    } else {
                        //a reload helyett visible ki be kapcsolás kellene a bacgroung image esetén meg csak leszedni és visszarakni az eltöntetés nem az igazi
                        core.utilities.message.sendReloadCurrentTabSpoilersMessage();
                    }
                });

                //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
                var config = app.ui.modules.spoilersLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackBootstrapToggleEvent(event, "Option: Show/Hide image");
                }
            },

            toggleVideosVisibility: function() {
                
                //toggleVideosVisibility passes the new boolean value to the sendReloadCurrentTabSpoilersMessage
                //to avoid exception we have to call within a function
                core.utilities.settings.toggleIsVideosVisible(function () {                    
                    if (app.ui.modules.spoilersLogic.getIsVideosVisible()) {
                        browser.tabs.reloadActiveTabs();
                    } else {
                        //a reload helyett visible ki be kapcsolás kellene a bacgroung image esetén meg csak leszedni és visszarakni az eltöntetés nem az igazi
                        core.utilities.message.sendReloadCurrentTabSpoilersMessage();
                    }
                });

                //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
                var config = app.ui.modules.spoilersLogic.config;
                if (config.sendGoogleTrackEvent) {
                    core.utilities.googleAnalitics.trackBootstrapToggleEvent(event, "Option: Show/Hide videos");
                }
            },

            getSortedSpoilerStringList:  function() {
                var orderedSpoilerStringList = core.utilities.settings.spoilers.spoilerStringList;
                orderedSpoilerStringList.sort(core.utilities.utils.naturalCompare);
                return orderedSpoilerStringList;
            },

            addSpoiler:  function(spoilerListText, settingChangedCallback) {
                var spoilerList = spoilerListText.split(",");
                core.utilities.settings.addSpoilersToSpoilerSettings(spoilerList, settingChangedCallback);
            },

            removeSpoiler: function(spoilerToRemove, settingChangedCallback) {
                core.utilities.settings.removeSpoilersFromSettings(new Array(spoilerToRemove), settingChangedCallback);
            },

            reloadTabsWithNewSpoilerList:  function() {
                core.utilities.message.sendReloadCurrentTabSpoilersMessage();
            }

            //#endregion

            //#region private functions

            //#endregion

        }
    })();

    app.ui.modules.spoilersLogic.config = new spoilersLogicConfig();

    core.utilities.settings.addSettingModifierModule(app.ui.modules.spoilersLogic);
    core.utilities.settings.addOnExtendSettingsEvent(app.ui.modules.spoilersLogic.extendSetting);
    core.utilities.message.addOnExtendMessagesEvent(app.ui.modules.spoilersLogic.extendMessage);


})();





