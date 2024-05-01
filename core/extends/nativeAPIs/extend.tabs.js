(function() {
    "use strict";

    //#region properties and consts

    browser.tabs.allTabFilter = {};
    browser.tabs.activeTabFilter = { active: true };

    //#endregion

    //#region init

    //#endregion

    //#region public functions

    browser.tabs.getTabs = function(filter, successCallback) {
        browser.tabs.query(filter, successCallback);
    };

    browser.tabs.getAllTabs = function(successCallback) {
        browser.tabs.getTabs(browser.tabs.allTabFilter, successCallback);
    };


    browser.tabs.getActiveTabs = function(successCallback) {
        browser.tabs.getTabs(browser.tabs.activeTabFilter, successCallback);
    };


    browser.tabs.sendMessageToTabs = function(filter, message, successCallback) {
        browser.tabs.query(filter, function(tabs) {
            for(var i = 0; i < tabs.length; i++) {
                browser.tabs.sendMessage(
                    tabs[i].id,
                    message,
                    function () {
                        if (successCallback) {
                            successCallback();
                        }
                    });
            }
        });
    };

    browser.tabs.sendMessageToAllTabs = function(message, successCallback) {
        browser.tabs.sendMessageToTabs(browser.tabs.allTabFilter, message, successCallback);
    };

    browser.tabs.sendMessageToActiveTabs = function(message, successCallback) {
        browser.tabs.sendMessageToTabs(browser.tabs.activeTabFilter, message, successCallback);
    };

    browser.tabs.openOptionsPage = function() {
        browser.tabs.openUrl(browser.extension.getURL("pages/optionsPage.html"));
    };

    browser.tabs.openWelcomePage = function() {
        browser.tabs.openUrl(browser.extension.getURL("pages/welcome.html"));
    };


    browser.tabs.openUpdatePage = function() {
        browser.tabs.openUrl(browser.extension.getURL("pages/update.html"));
    };

    browser.tabs.openCategoryListWithCategory = function(categoryId) {
        var postfix = "?categoryId=" + categoryId;
        browser.tabs.openUrl(core.utilities.settings.categoryListUrl + postfix);
    };

    //https://stackoverflow.com/questions/21792565/how-to-open-a-mailto-link-from-a-chrome-extension
    browser.tabs.openMailTo = function(email, subject) {
        browser.tabs.create({ url: "mailto:" + email + "?Subject=" + subject });
    };

    browser.tabs.closePage = function (url, successCallback) {
        browser.tabs.query({ url: url }, function (tabs) {
            if (tabs.length) {
                browser.tabs.remove(tabs[0].id);
            }
            successCallback();
        });
    };

    browser.tabs.isPageActiveByUrl = function (url, pageIsActiveCallback, pageIsNotActiveCallback) {
        browser.tabs.query({ url: url, active: true, currentWindow: true  }, function (tabs) {
            if (tabs.length) {
                pageIsActiveCallback(tabs[0]);
            } else {
                pageIsNotActiveCallback();
            }
        });
    };

    browser.tabs.openUrl = function(url) {
        browser.tabs.query({ url: url }, function (tabs) {
            if (tabs && tabs.length) {
                browser.tabs.update(tabs[0].id, { active: true });
            } else {
                browser.tabs.create({ url: url });
            }
        });
    };

    browser.tabs.reloadActiveTabs = function() {        
        browser.tabs.getActiveTabs(function(tabs) {
            for(var i = 0; i < tabs.length; i++) {
                browser.tabs.reloadTab(tabs[i].id);
            }
        })
    };

    browser.tabs.reloadCurrentTab = function(currentTab) {        
        browser.tabs.reloadTab(currentTab.id);
    };

    browser.tabs.reloadTab = function(tabId) {
        var code = { code: 'window.location.reload();' };
        browser.tabs.executeScript(tabId, code);
    };

    //#endregion

    //#region private functions

    //#endregion

})();

