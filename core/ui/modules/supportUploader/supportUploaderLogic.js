(function() {
    "use strict";



    core.ui.modules.supportUploaderLogic = core.ui.modules.supportUploaderLogic  || (function() {
            return {

                //#region properties and consts

                moduleName: "supportUploader",



                //#endregion

                //#region init

                initSettingsDefaultValues: function() {
                    core.utilities.settings.supportUploader = {};
                    core.utilities.settings.supportUploader.kofiUserName = "";
                    core.utilities.settings.supportUploader.kofiSiteUrl = "https://ko-fi.com";
                    core.utilities.settings.supportUploader.patreonUserName = "";
                    core.utilities.settings.supportUploader.patreonSiteUrl = "https://www.patreon.com";
                },

                extendSetting: function() {

                    core.utilities.settings.setKofiUserName =  function(kofiUserName, successFunction) {
                        core.utilities.settings.supportUploader.kofiUserName = kofiUserName;
                        core.utilities.settings.updateSettingsInStorage(successFunction);
                    };

                    core.utilities.settings.setPatreonUserName =  function(patreonUserName, successFunction) {
                        core.utilities.settings.supportUploader.patreonUserName = patreonUserName;
                        core.utilities.settings.updateSettingsInStorage(successFunction);
                    };
                },

                //#endregion

                //#region public functions

                setKofiUserName:  function(kofiUserName, successFunction) {
                    core.utilities.settings.setKofiUserName(kofiUserName, successFunction);
                },

                getKofiUserName:  function() {
                    return core.utilities.settings.supportUploader.kofiUserName;
                },

                setPatreonUserName:  function(patreonUserName, successFunction) {
                    core.utilities.settings.setPatreonUserName(patreonUserName, successFunction);
                },

                getPatreonUserName:  function() {
                    return core.utilities.settings.supportUploader.patreonUserName;
                }


                //#endregion

                //#region private functions

                //#endregion

            }
        })();


    core.utilities.settings.addSettingModifierModule(core.ui.modules.supportUploaderLogic);
    core.utilities.settings.addOnExtendSettingsEvent(core.ui.modules.supportUploaderLogic.extendSetting);

})();





