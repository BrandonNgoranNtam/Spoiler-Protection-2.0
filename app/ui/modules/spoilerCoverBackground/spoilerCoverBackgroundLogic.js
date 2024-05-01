(function() {
    "use strict";

    app.ui.modules.spoilerCoverBackgroundLogic = app.ui.modules.spoilerCoverBackgroundLogic  || (function() {
        return {

            //#region properties and consts

            moduleName: "spoilerCoverBackground",
            defaultBackgroundColor: "#B22222",
            //#endregion

            //#region init

            initSettingsDefaultValues: function() {
                core.utilities.settings.spoilerCoverBackground = {};
                core.utilities.settings.spoilerCoverBackground.backgroundColor = app.ui.modules.spoilerCoverBackgroundLogic.defaultBackgroundColor;
            },

            extendSetting: function() {
                core.utilities.settings.setBackgroundColor = function (color, successCallback) {
                    core.utilities.settings.spoilerCoverBackground.backgroundColor = color;
                    core.utilities.settings.updateSettingsInStorage(successCallback);
                };
            },

            //#endregion

            //#region public functions

            getBackgroundColor:  function() {
                return core.utilities.settings.spoilerCoverBackground.backgroundColor;
            }

            //#endregion

            //#region private functions

            //#endregion

        }
    })();

    core.utilities.settings.addSettingModifierModule(app.ui.modules.spoilerCoverBackgroundLogic);
    core.utilities.settings.addOnExtendSettingsEvent(app.ui.modules.spoilerCoverBackgroundLogic.extendSetting);

})();





