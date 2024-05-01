(function() {
    "use strict";

    core.ui.modules.emailFeedbackController = core.ui.modules.emailFeedbackController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#email-feedback-control-container");
                $container.html(
                    "<span i18n='we_know_we_can_do_better'></span>&nbsp;" +
                    "<a href='#' id='open-email-feedback-mail-to' i18n='tell_us' class='font-weight-bold' />"
                );

                $("#open-email-feedback-mail-to").click(core.ui.modules.emailFeedbackController.openEmailFeedbackMailToOnClick);

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            openEmailFeedbackMailToOnClick: function() {
                core.ui.modules.emailFeedbackLogic.openEmailFeedbackMailTo();
            }

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.emailFeedbackController.initUI);



})();






