(function() {
    "use strict";

    //#region properties and consts

    core.utilities.settings.extensionName = "Spoiler Protection 2.0";
    core.utilities.settings.feedbackMailTo = "extensions@wecdev.com";
    core.utilities.settings.developerPatreonUrl = "https://www.patreon.com/rolandszik";
    core.utilities.settings.developerKofiUrl = "https://ko-fi.com/rolandszik";
    core.utilities.settings.wecdevUrl = "https://wecdev.com";

    core.utilities.settings.googleAnaliticsTrackerId = "UA-100714718-4";
    core.utilities.settings.spoilerProtectionUrl = "https://spoilerprotection.wecdev.com";
    core.utilities.settings.unInstallUrl = core.utilities.settings.spoilerProtectionUrl + "/UnInstall";
    core.utilities.settings.facebookGroupUrl = "https://www.facebook.com/groups/198880193928363";
    core.utilities.settings.categoryListUrl = 'https://spoilerprotection.wecdev.com/categorylist';

    if (core.ui.modules.resetExtensionLogic) {
        core.ui.modules.resetExtensionLogic.config.sendGoogleTrackEvent = true;
    }

    if (core.ui.modules.enableDisableExtensionLogic) {
        core.ui.modules.enableDisableExtensionLogic.config.sendGoogleTrackEvent = true;
    }

    if (core.ui.modules.emailFeedbackLogic) {
        core.ui.modules.emailFeedbackLogic.config.sendGoogleTrackEvent = true;
    }

    if (core.ui.modules.openPatreonUrlLogic) {
        core.ui.modules.openPatreonUrlLogic.config.sendGoogleTrackEvent = true;
    }

    if (core.ui.modules.horizontalShareLogic) {
        core.ui.modules.horizontalShareLogic.config.jsSocialsConfiguration = {
            url: core.utilities.settings.spoilerProtectionUrl,
            text: browser.i18n.getMessage("app_description"),
            showLabel: false,
            showCount: "inside",
            shares: ["twitter", "facebook", "linkedin", "pinterest"]
        };
    }

    if (app.ui.modules.spoilerContextsLogic) {
        app.ui.modules.spoilerContextsLogic.config.sendGoogleTrackEvent = true;
    }

    if (app.ui.modules.spoilerCategoriesLogic) {
        app.ui.modules.spoilerCategoriesLogic.config.sendGoogleTrackEvent = true;
    }

    if (app.ui.modules.openFacebookGroupUrlLogic) {
        app.ui.modules.openFacebookGroupUrlLogic.config.sendGoogleTrackEvent = true;
    }

    //#endregion

    //#region init

    //#endregion

    //#region public functions

    //#endregion

    //#region private functions

    //#endregion

})();
