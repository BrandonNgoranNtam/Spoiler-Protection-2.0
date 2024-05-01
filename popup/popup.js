(function() {
    "use strict";

    app.popup = app.popup || (function() {
        return {


            //#region properties and consts

            //#endregion

            //#region init

            init: function () {
                //popup specific settings
                core.ui.modules.resetExtensionLogic.config.resetExtensionFunction = app.popup.resetExtensionOnClick;
                core.ui.modules.enableDisableExtensionLogic.config.extensionOnEnabledFunction = app.popup.extensionOnEnabledOnClick;
                core.ui.modules.whiteListLogic.config.whiteListChangedFunction = app.popup.whiteListOnChanged;

                core.utilities.settings.loadSettingsFromStorage(function () {
                    core.ui.utilities.ui.dispatchOnInitUIEvent();

                    //moved here from spoiler controller for ergonomic reason
                    core.ui.controls.toggler.init("#is-spoiler-name-visible-toggle",
                        app.ui.modules.spoilersLogic.getIsSpoilerNameVisible(),
                        app.ui.modules.spoilersController.toggleSpoilerNameVisibilityOnChange);

                    core.ui.controls.toggler.init("#is-spoiler-category-visible-toggle",
                        app.ui.modules.spoilersLogic.getIsSpoilerCategoryVisible(),
                        app.ui.modules.spoilersController.toggleSpoilerCategoryVisibilityOnChange);


                    core.ui.controls.toggler.init("#is-images-visible-toggle",
                        app.ui.modules.spoilersLogic.getIsImagesVisible(),
                        app.ui.modules.spoilersController.toggleImagesVisibilityOnChange);

                        core.ui.controls.toggler.init("#is-videos-visible-toggle",
                        app.ui.modules.spoilersLogic.getIsVideosVisible(),
                        app.ui.modules.spoilersController.toggleVideosVisibilityOnChange);

                    core.ui.controls.toggler.init("#is-spoiler-list-visible-toggle",
                        app.ui.modules.spoilersLogic.getIsSpoilerListVisible(),
                        app.ui.modules.spoilersController.toggleSpoilerListVisibilityOnChange);

                });


            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            resetExtensionOnClick: function () {
                core.utilities.message.sendReloadCurrentTabSpoilersMessage(function () {
                    //reload popop too
                    location.reload();
                });
            },

            extensionOnEnabledOnClick: function () {
                core.utilities.message.sendReloadCurrentTabSpoilersMessage();
            },           

            whiteListOnChanged: function () {
                core.utilities.message.sendReloadCurrentTabSpoilersMessage();
            },



            //#endregion

        }

    })();
})();


$(document).ready(function () {
    app.popup.init();
    core.utilities.googleAnalitics.trackPage("popup.html", core.utilities.settings.extensionName + " - Popup page");
});

