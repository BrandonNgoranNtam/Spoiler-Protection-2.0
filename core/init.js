(function() {
    "use strict";

     //for multi browser compatibility we set 'window.browser = chrome;'
    if (chrome) {
         // If chrome is set to window.browser during debugging we get error message, we don't know why. The chrome properties are undefined.
         // Not to get 'Lazy require of extension.binding did not set the binding field' during debugging we call these functions
        var a = chrome.app;
        a = chrome.browserAction;
        a = chrome.i18n;
        a = chrome.extension;
        a = chrome.permissions;
        a = chrome.runtime;
        a = chrome.storage;
        a = chrome.tabs;

        window.browser = chrome;
    }

    window.app = window.app || (function () {
        return {
        }
    });

    app.data = app.data || (function () {
        return {
        }
    });

    app.extension = app.extension || (function () {
        return {
        }
    });

    app.social = app.social || (function () {
        return {
        }
    });

    app.utilities = app.utilities || (function () {
        return {
        }
    });

    app.ui = app.ui || (function () {
        return {
        }
    });

    app.ui.content = app.ui.content || (function () {
        return {
        }
    });

    app.ui.controls = app.ui.controls || (function () {
        return {
        }
    });

    app.ui.modules = app.ui.modules || (function () {
        return {
        }
    });

    app.ui.utilities = app.ui.utilities || (function () {
        return {
        }
    });

    window.core = window.core || (function () {
        return {
        }
    });

    core.data = core.data || (function () {
        return {
        }
    });

    core.extension = core.extension || (function () {
        return {
        }
    });

    core.socials = core.socials || (function () {
        return {
        }
    });

    core.utilities = core.utilities || (function () {
        return {
        }
    });

    core.ui = core.ui || (function () {
        return {
        }
    });

    core.ui.content = core.ui.content || (function () {
        return {
        }
    });

    core.ui.controls = core.ui.controls || (function () {
        return {
        }
    });

    core.ui.modules = core.ui.modules || (function () {
        return {
        }
    });

    core.ui.utilities = core.ui.utilities || (function () {
        return {
        }
    });


    browser.core = core;
    browser.application = app;
    browser.$ = window.$;



})();




