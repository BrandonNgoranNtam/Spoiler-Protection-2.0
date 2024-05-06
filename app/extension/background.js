(function () {
  "use strict";

  // Define the namespace for the background script if it doesn't already exist
  app.extension.background =
    app.extension.background ||
    (function () {
      return {
        // Initialization function for the background script
        init: function () {
          // Initialize core background functionalities
          core.extension.background.init();

          // Listener for when a tab is activated. Ensures spoiler settings are applied to the newly active tab
          browser.tabs.onActivated.addListener(function (activeInfo) {
            core.utilities.settings.loadSettingsFromStorage(function () {
              //NOTE:we have to reload if tab changes, because anything could have changed the settings (spoilerstringlist, on/off the extension...)
              app.extension.background.reloadCurrentTabSpoilers();
            });
          });

          // Listener for when a tab is updated (e.g., page reload or navigation)
          browser.tabs.onUpdated.addListener(function (tabId, info) {
            // Check if the tab is being loaded to apply spoiler settings
            if (info.status == "loading") {
              core.utilities.settings.loadSettingsFromStorage(function () {
                //we have to reload the tab, because some page loading renders the whole page again (like index.hu/belfold rolling down the articles)
                app.extension.background.reloadCurrentTabSpoilers();
              });
            }
          });

          // Initialize the badge text (e.g., showing the number of blocked spoilers)
          core.ui.utilities.badgeText.init(0);
        },

        // Function to reload spoilers in the current tab. It sends a message to the content script
        reloadCurrentTabSpoilers: function () {
          core.utilities.message.sendReloadCurrentTabSpoilersMessage();
        },
      };
    })();
})();

// Execute the initialization function of the background script
(function () {
  "use strict";

  app.extension.background.init();
})();
