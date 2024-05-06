(function () {
  "use strict";
  // Configuration object constructor for managing spoiler settings and visibility
  function spoilersLogicConfig() {
    this.sendGoogleTrackEvent = false;
  }

  // Ensures that the module does not overwrite itself if already defined
  app.ui.modules.spoilersLogic =
    app.ui.modules.spoilersLogic ||
    (function () {
      return {
        moduleName: "spoilers",
        config: null,

        // Extends the message object for reloading the current tab's spoilers
        extendMessage: function () {
          core.utilities.message.ACTION_RELOAD_CURRENT_TAB_SPOILERS =
            "reloadCurrentTabSpoilers";

          core.utilities.message.sendReloadCurrentTabSpoilersMessage =
            function (successCallback) {
              var message = core.utilities.message.getMessage(
                core.utilities.message.ACTION_RELOAD_CURRENT_TAB_SPOILERS
              );
              browser.tabs.sendMessageToActiveTabs(message, successCallback);
            };
        },

        // Initializes default values for the settings related to spoilers
        initSettingsDefaultValues: function () {
          core.utilities.settings.spoilers = {};
          core.utilities.settings.spoilers.spoilerStringList = [];
          core.utilities.settings.spoilers.isSpoilerNameVisible = true;
          core.utilities.settings.spoilers.isSpoilerCategoryVisible = true;
          core.utilities.settings.spoilers.isSpoilerListVisible = true;
          core.utilities.settings.spoilers.isImagesVisible = true;
          core.utilities.settings.spoilers.isVideosVisible = true;
        },

        // Extends the settings object with new functions for managing spoiler settings
        extendSetting: function () {
          // Function to add spoilers to the settings
          core.utilities.settings.addSpoilersToSpoilerSettings = function (
            spoilerList,
            successCallback
          ) {
            var spoilerStringList =
              core.utilities.settings.spoilers.spoilerStringList;
            // Add each spoiler from the list if not already present
            $.each(spoilerList, function (key, value) {
              var spoilerText = value.trimString();
              if (!spoilerText.isNullOrWhiteSpace()) {
                if (spoilerStringList.indexOf(spoilerText) === -1) {
                  spoilerStringList.push(spoilerText);
                }
              }
            });
            // Update settings in storage
            core.utilities.settings.updateSettingsInStorage(successCallback);
          };

          // Function to remove spoilers from the settings
          core.utilities.settings.removeSpoilersFromSettings = function (
            spoilersToRemove,
            successCallback
          ) {
            var spoilerStringList =
              core.utilities.settings.spoilers.spoilerStringList;
            // Remove each specified spoiler
            $.each(spoilersToRemove, function (key, value) {
              spoilerStringList.remove(value);
            });

            // Update settings in storage
            core.utilities.settings.updateSettingsInStorage(successCallback);
          };

          // Functions to toggle visibility settings for various spoiler elements

          // Each function toggles a boolean setting and optionally calls a callback

          // Similar structure for toggling visibility of names, categories, list, images, and videos

          //isSpoilerNameVisible
          core.utilities.settings.toggleIsSpoilerNameVisible = function (
            callbackFunction
          ) {
            core.utilities.settings.toggleBooleanSettingInStorage(
              app.ui.modules.spoilersLogic.moduleName,
              "isSpoilerNameVisible",
              callbackFunction
            );
          };

          //isSpoilerCategoryVisible
          core.utilities.settings.toggleIsSpoilerCategoryVisible = function (
            callbackFunction
          ) {
            core.utilities.settings.toggleBooleanSettingInStorage(
              app.ui.modules.spoilersLogic.moduleName,
              "isSpoilerCategoryVisible",
              callbackFunction
            );
          };

          //isSpoilerListVisible
          core.utilities.settings.toggleIsSpoilerListVisible = function (
            callbackFunction
          ) {
            core.utilities.settings.toggleBooleanSettingInStorage(
              app.ui.modules.spoilersLogic.moduleName,
              "isSpoilerListVisible",
              callbackFunction
            );
          };

          //isImagesVisible
          core.utilities.settings.toggleIsImagesVisible = function (
            callbackFunction
          ) {
            core.utilities.settings.toggleBooleanSettingInStorage(
              app.ui.modules.spoilersLogic.moduleName,
              "isImagesVisible",
              callbackFunction
            );
          };

          //isVideosVisible
          core.utilities.settings.toggleIsVideosVisible = function (
            callbackFunction
          ) {
            core.utilities.settings.toggleBooleanSettingInStorage(
              app.ui.modules.spoilersLogic.moduleName,
              "isVideosVisible",
              callbackFunction
            );
          };
        },

        // Public functions to get visibility status and toggle visibility

        // Functions for getting visibility status return a boolean

        getIsSpoilerNameVisible: function () {
          return core.utilities.settings.spoilers.isSpoilerNameVisible;
        },

        getIsSpoilerCategoryVisible: function () {
          return core.utilities.settings.spoilers.isSpoilerCategoryVisible;
        },

        getIsSpoilerListVisible: function () {
          return core.utilities.settings.spoilers.isSpoilerListVisible;
        },

        getIsImagesVisible: function () {
          return core.utilities.settings.spoilers.isImagesVisible;
        },

        getIsVideosVisible: function () {
          return core.utilities.settings.spoilers.isVideosVisible;
        },

        toggleSpoilerNameVisibility: function () {
          //toggleBooleanSettingInStorage passes the new boolean value to the sendReloadCurrentTabSpoilersMessage
          //to avoid exception we have to call within a function
          core.utilities.settings.toggleIsSpoilerNameVisible(function () {
            core.utilities.message.sendReloadCurrentTabSpoilersMessage();
          });

          //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
          var config = app.ui.modules.spoilersLogic.config;
          if (config.sendGoogleTrackEvent) {
            core.utilities.googleAnalitics.trackBootstrapToggleEvent(
              event,
              "Option: Hide spoiler name"
            );
          }
        },

        toggleSpoilerCategoryVisibility: function () {
          //toggleBooleanSettingInStorage passes the new boolean value to the sendReloadCurrentTabSpoilersMessage
          //to avoid exception we have to call within a function
          core.utilities.settings.toggleIsSpoilerCategoryVisible(function () {
            core.utilities.message.sendReloadCurrentTabSpoilersMessage();
          });

          //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
          var config = app.ui.modules.spoilersLogic.config;
          if (config.sendGoogleTrackEvent) {
            core.utilities.googleAnalitics.trackBootstrapToggleEvent(
              event,
              "Option: Show/Hide spoiler category"
            );
          }
        },

        toggleSpoilerListVisibility: function (uiCallback) {
          core.utilities.settings.toggleIsSpoilerListVisible(uiCallback);
          //NOTE: no need to put in callback, doesn't matter when we call the GA tracking
          var config = app.ui.modules.spoilersLogic.config;
          if (config.sendGoogleTrackEvent) {
            core.utilities.googleAnalitics.trackBootstrapToggleEvent(
              event,
              "Option: Show/Hide spoiler list"
            );
          }
        },

        toggleImagesVisibility: function () {
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
            core.utilities.googleAnalitics.trackBootstrapToggleEvent(
              event,
              "Option: Show/Hide image"
            );
          }
        },

        toggleVideosVisibility: function () {
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
            core.utilities.googleAnalitics.trackBootstrapToggleEvent(
              event,
              "Option: Show/Hide videos"
            );
          }
        },

        // Function to get and sort the spoiler string list
        getSortedSpoilerStringList: function () {
          var orderedSpoilerStringList =
            core.utilities.settings.spoilers.spoilerStringList;
          orderedSpoilerStringList.sort(core.utilities.utils.naturalCompare);
          return orderedSpoilerStringList;
        },

        // Functions to add and remove spoilers from the list

        // reloadTabsWithNewSpoilerList sends a message to reload spoilers based on the updated list

        addSpoiler: function (spoilerListText, settingChangedCallback) {
          var spoilerList = spoilerListText.split(",");
          core.utilities.settings.addSpoilersToSpoilerSettings(
            spoilerList,
            settingChangedCallback
          );
        },

        removeSpoiler: function (spoilerToRemove, settingChangedCallback) {
          core.utilities.settings.removeSpoilersFromSettings(
            new Array(spoilerToRemove),
            settingChangedCallback
          );
        },

        reloadTabsWithNewSpoilerList: function () {
          core.utilities.message.sendReloadCurrentTabSpoilersMessage();
        },
      };
    })();

  // Initialize the module's configuration

  app.ui.modules.spoilersLogic.config = new spoilersLogicConfig();

  // Register the module as a modifier for settings and bind event handlers
  core.utilities.settings.addSettingModifierModule(
    app.ui.modules.spoilersLogic
  );
  core.utilities.settings.addOnExtendSettingsEvent(
    app.ui.modules.spoilersLogic.extendSetting
  );
  core.utilities.message.addOnExtendMessagesEvent(
    app.ui.modules.spoilersLogic.extendMessage
  );
})();
