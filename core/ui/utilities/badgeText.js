(function() {
    "use strict";

    core.ui.utilities.badgeText = core.ui.utilities.badgeText || (function() {

        return {

            //#region properties and consts

            ACTION_INCREASE_BADGE_TEXT: "increaseBadgeText",
            ACTION_DECREASE_BADGE_TEXT: "decreaseBadgeText",
            ACTION_RESET_BADGE_TEXT: "resetBadgeText",
            ACTION_SET_CUSTOM_BADGE_TEXT: "setCustomBadgeText",

            defaultValue: "",
            badgeTextForTabs: {},

            //#endregion

            //#region init

            init: function (defaultValue) {
                core.ui.utilities.badgeText.defaultValue = defaultValue;

                browser.runtime.onMessage.addListener(function (message, sender) {
                    var text = core.ui.utilities.badgeText.getCurrentBadgeTextForTab(sender.tab.id);
                    switch (message.action) {
                        case core.ui.utilities.badgeText.ACTION_INCREASE_BADGE_TEXT:
                            text++;
                            break;
                        case core.ui.utilities.badgeText.ACTION_DECREASE_BADGE_TEXT:
                            text--;
                            break;
                        case core.ui.utilities.badgeText.ACTION_RESET_BADGE_TEXT:
                            text = message.parameter;
                            break;
                        case core.ui.utilities.badgeText.ACTION_SET_CUSTOM_BADGE_TEXT:
                            text = message.parameter;
                            break;
                        default:
                            break;
                    }
                    core.ui.utilities.badgeText.setBadgeTextForTab(sender.tab.id, text);
                });

                browser.tabs.onActivated.addListener(function (activeInfo) {
                    var text = core.ui.utilities.badgeText.getCurrentBadgeTextForTab(activeInfo.tabId);
                    core.ui.utilities.badgeText.setBadgeTextForTab(activeInfo.tabId, text);
                });

                browser.tabs.onUpdated.addListener(function (tabId, info) {
                    if (info.status === "loading") {
                        core.ui.utilities.badgeText.resetBadgeTextForTab(tabId);
                    }
                });
                return true;
            },

            //#endregion

            //#region public functions

            getCurrentBadgeTextForTab: function(tabId) {
                var text = core.ui.utilities.badgeText.badgeTextForTabs[tabId];
                if (core.utilities.utils.isNullOrEmpty(text)) {
                    text = core.ui.utilities.badgeText.defaultValue;
                }
                return text;
            },

            resetBadgeTextForTab: function(tabId) {
                core.ui.utilities.badgeText.setBadgeTextForTab(tabId, core.ui.utilities.badgeText.defaultValue);
            },

            setBadgeTextForTab: function(tabId, text) {
                core.ui.utilities.badgeText.badgeTextForTabs[tabId] = text;
                browser.browserAction.setBadgeText({
                    text: text.toString(),
                    tabId: tabId
                });
            },

            increaseBadgeText: function() {
                var message = core.utilities.message.getMessage(core.ui.utilities.badgeText.ACTION_INCREASE_BADGE_TEXT);
                browser.runtime.sendMessage(message);
            },

            decreaseBadgeText: function() {
                var message = core.utilities.message.getMessage(core.ui.utilities.badgeText.ACTION_DECREASE_BADGE_TEXT);
                browser.runtime.sendMessage(message);
            },

            resetBadgeText: function() {
                var message = core.utilities.message.getMessage(core.ui.utilities.badgeText.ACTION_RESET_BADGE_TEXT, core.ui.utilities.badgeText.defaultValue);
                browser.runtime.sendMessage(message);
            },

            setCustomBadgeText: function(text) {
                var message = core.utilities.message.getMessage(core.ui.utilities.badgeText.ACTION_SET_CUSTOM_BADGE_TEXT, text);
                browser.runtime.sendMessage(message);
            }

            //#endregion

            //#region private functions

            //#endregion
        }
    })();
})();



