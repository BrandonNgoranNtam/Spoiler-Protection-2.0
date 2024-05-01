(function() {
    "use strict";

    app.extension.background = app.extension.background || (function() {

        return {

            //#region properties and consts

            //#endregion

            //#region init

            init: function () {
                core.extension.background.init();

                browser.tabs.onActivated.addListener(function (activeInfo) {
                    core.utilities.settings.loadSettingsFromStorage(function () {
                        //NOTE:we have to reload if tab changes, because anything could have changed the settings (spoilerstringlist, on/off the extension...)
                        app.extension.background.reloadCurrentTabSpoilers();                        
                    });
                });

                browser.tabs.onUpdated.addListener(function (tabId, info) {
                    // firefoxnál 2szer fut meg, a complete miatt, amiatt kell a loading vizsgálat
                    if (info.status == "loading") {
                        core.utilities.settings.loadSettingsFromStorage(function () {
                            //we have to reload the tab, because some page loading renders the whole page again (like index.hu/belfold rolling down the articles)
                            app.extension.background.reloadCurrentTabSpoilers();
                        });
                    }
                });

                core.ui.utilities.badgeText.init(0);
            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            reloadCurrentTabSpoilers: function() {
                core.utilities.message.sendReloadCurrentTabSpoilersMessage();
            }

            //#endregion
        }
    })();
})();


(function() {
    "use strict";

    app.extension.background.init();

})();






