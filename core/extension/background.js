(function() {
    "use strict";



    core.extension.background = core.extension.background || (function() {

        return {

            //#region properties and consts

            //#endregion

            //#region init

            init: function () {
                browser.runtime.onInstalled.addListener(function(details) {
                    switch (details.reason) {
                        case "install":                            
                            browser.tabs.openWelcomePage();

                            //reload the category page, to show the list after install
                            browser.tabs.getAllTabs(function (tabs) {
                                console.log(tabs);
                                for(var i = 0; i < tabs.length; i++) {
                                    if (tabs[i].url.indexOf(core.utilities.settings.categoryListUrl) > -1) {                                        
                                        browser.tabs.reloadTab(tabs[i].id);
                                    }
                                }
                            });                            
                            if (browser.runtime.setUninstallURL) {                                
                                browser.runtime.setUninstallURL(core.utilities.settings.unInstallUrl);
                            }
                            break;
                        case "update":
                            //browser.tabs.openUpdatePage();                                                        
                            break;
                    }

                });                                
            }

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();
})();



