(function() {
    "use strict";

    function whiteListLogicConfig() {
        this.whiteListChangedFunction = null;
    }

    core.ui.modules.whiteListLogic = core.ui.modules.whiteListLogic  || (function() {
        return {

            //#region properties and consts

            moduleName: "whiteList",
            config: null,

            //#endregion

            //#region init

            initSettingsDefaultValues: function() {
                core.utilities.settings.whiteList = {};
                core.utilities.settings.whiteList.whiteListUrlList = [];
            },

            extendSetting: function() {
                //whiteListUrlList
                core.utilities.settings.addWhiteListUrl =  function(whiteListUrl, successCallback) {
                    var whiteListUrlList = core.utilities.settings.whiteList.whiteListUrlList;

                    var trimmedWhiteListUrl = whiteListUrl.trimString();
                    if (!trimmedWhiteListUrl.isNullOrWhiteSpace()) {
                        if (whiteListUrlList.indexOf(trimmedWhiteListUrl) === -1) {
                            whiteListUrlList.push(trimmedWhiteListUrl);
                        }
                    }

                    core.utilities.settings.updateSettingsInStorage(successCallback);
                };

                core.utilities.settings.removeWhiteListUrl =  function(whiteListUrl, successCallback) {
                    var whiteListUrlList = core.utilities.settings.whiteList.whiteListUrlList;
                    whiteListUrlList.remove(whiteListUrl);
                    core.utilities.settings.updateSettingsInStorage(successCallback);
                };

                core.utilities.settings.isUrlInWhiteList =  function(url) {
                    var whiteListUrlList = core.utilities.settings.whiteList.whiteListUrlList;
                    for(var i = 0; i < whiteListUrlList.length; i++) {
                        var whiteListUrl = whiteListUrlList[i];
                        if (whiteListUrl.contains("*")) {
                            if (url.contains(whiteListUrl.replace("*", ""))) {
                                return true;
                            }
                        } else {
                            if (whiteListUrl.trim('/') == url.trim('/')) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

            },

            //#endregion

            //#region public functions

            getSortedWhiteListUrlList:  function() {
                var list = core.utilities.settings.whiteList.whiteListUrlList;
                list.sort(core.utilities.utils.naturalCompare);
                return list;
            },

            addWhiteListUrl:  function(whiteListUrl, settingChangedCallback) {
                core.utilities.settings.addWhiteListUrl(whiteListUrl, settingChangedCallback);
            },

            removeWhiteListUrl: function(whiteListUrl, settingChangedCallback) {
                core.utilities.settings.removeWhiteListUrl(whiteListUrl, settingChangedCallback);
            },

            executeWhiteListChangedFunction:  function() {
                core.ui.modules.whiteListLogic.config.whiteListChangedFunction();
            }

            //#endregion

            //#region private functions

            //#endregion

        }
    })();

    core.ui.modules.whiteListLogic.config = new whiteListLogicConfig();

    core.utilities.settings.addSettingModifierModule(core.ui.modules.whiteListLogic);
    core.utilities.settings.addOnExtendSettingsEvent(core.ui.modules.whiteListLogic.extendSetting);

})();





