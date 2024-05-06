(function () {
  "use strict";

  // Define the spoilerCoverBackgroundLogic module within the app.ui.modules namespace
  // If it already exists, it will not be redefined.

  app.ui.modules.spoilerCoverBackgroundLogic =
    app.ui.modules.spoilerCoverBackgroundLogic ||
    (function () {
      return {
        // The name of the module, used for identification
        moduleName: "spoilerCoverBackground",
        // Default background color for the spoiler cover
        defaultBackgroundColor: "#B22222",

        // Initializes the default values for the spoiler cover background settings
        initSettingsDefaultValues: function () {
          // Ensure the spoilerCoverBackground setting object exists
          core.utilities.settings.spoilerCoverBackground = {};
          // Set the default background color
          core.utilities.settings.spoilerCoverBackground.backgroundColor =
            app.ui.modules.spoilerCoverBackgroundLogic.defaultBackgroundColor;
        },

        // Extends the core settings with a new function to set the background color
        extendSetting: function () {
          // Define a function to update the background color and persist the change
          core.utilities.settings.setBackgroundColor = function (
            color,
            successCallback
          ) {
            // Update the background color in the settings
            core.utilities.settings.spoilerCoverBackground.backgroundColor =
              color;
            // Persist the updated settings
            core.utilities.settings.updateSettingsInStorage(successCallback);
          };
        },

        // Retrieves the current background color from the settings
        getBackgroundColor: function () {
          return core.utilities.settings.spoilerCoverBackground.backgroundColor;
        },
      };
    })();

  // Register this module as a settings modifier module
  core.utilities.settings.addSettingModifierModule(
    app.ui.modules.spoilerCoverBackgroundLogic
  );
  // Register the extendSetting function to be called when settings are extended
  core.utilities.settings.addOnExtendSettingsEvent(
    app.ui.modules.spoilerCoverBackgroundLogic.extendSetting
  );
})();
