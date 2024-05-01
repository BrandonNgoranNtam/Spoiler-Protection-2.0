(function() {
    "use strict";

    //#region properties and consts


    browser.i18n.ATTRIBUTE_INNER_HTML = "i18n";

    browser.i18n.ATTRIBUTE_TITLE = "i18n-title";
    browser.i18n.ATTRIBUTE_ALT = "i18n-alt";
    browser.i18n.ATTRIBUTE_HREF = "i18n-href";
    browser.i18n.ATTRIBUTE_PLACEHOLDER = "i18n-placeholder";
    browser.i18n.ATTRIBUTE_DATA_ON = "i18n-data-on";
    browser.i18n.ATTRIBUTE_DATA_OFF = "i18n-data-off";

    browser.i18n.attributeList = new Array();
    browser.i18n.attributeList.push(browser.i18n.ATTRIBUTE_TITLE);
    browser.i18n.attributeList.push(browser.i18n.ATTRIBUTE_ALT);
    browser.i18n.attributeList.push(browser.i18n.ATTRIBUTE_HREF);
    browser.i18n.attributeList.push(browser.i18n.ATTRIBUTE_PLACEHOLDER);
    browser.i18n.attributeList.push(browser.i18n.ATTRIBUTE_DATA_ON);
    browser.i18n.attributeList.push(browser.i18n.ATTRIBUTE_DATA_OFF);

    //#endregion

    //#region init
    browser.i18n.init = function () {
        window.addEventListener(
            "DOMContentLoaded",
            function() {
                browser.i18n.setAllI18nStrings(document)
            },
            true);
    };

    //#endregion

    //#region public functions

    browser.i18n.setI18nInnerHTML = function (nodeOrJqueryObject, messageKey, messageAttributes) {
        var node = browser.i18n.getHTMLNode(nodeOrJqueryObject);
        node.innerHTML = browser.i18n.getMessage(messageKey, messageAttributes);
    };

    browser.i18n.setI18nAttributeValue = function (nodeOrJqueryObject, i18NAttributeName, messageKey, messageAttributes) {
        var attributeName = i18NAttributeName.replace("i18n-", "");
        var element = browser.i18n.getHTMLNode(nodeOrJqueryObject);
        element.setAttribute(attributeName, browser.i18n.getMessage(messageKey, messageAttributes));
    };


    browser.i18n.setAllI18nStrings = function (root) {
        browser.i18n.setAllI18nInnerHTML(root);

        for(var i = 0; i < browser.i18n.attributeList.length; i++) {
            browser.i18n.setAllI18nStringsByAttribute(root, browser.i18n.attributeList[i]);
        }

    };

    //#endregion

    //#region private functions

    browser.i18n.getHTMLNode = function (nodeOrJqueryObject) {
        var element;
        //is jQueryObject
        if (nodeOrJqueryObject.length > 0) {
            element = nodeOrJqueryObject[0]
        } else {
            element = nodeOrJqueryObject;
        }
        return element;
    };


    browser.i18n.setAllI18nInnerHTML = function (root) {
        var nodes = $(root).find("[" + browser.i18n.ATTRIBUTE_INNER_HTML + "]");
        if ($(root).attr(browser.i18n.ATTRIBUTE_INNER_HTML)) {
            nodes.push($(root)[0]);
        }
        var i, node, messageKey;
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            messageKey = node.getAttribute(browser.i18n.ATTRIBUTE_INNER_HTML);
            browser.i18n.setI18nInnerHTML(node, messageKey);
        }
    };

    browser.i18n.setAllI18nStringsByAttribute = function (root, i18NAttributeName) {
        var nodes = $(root).find("[" + i18NAttributeName + "]");
        if ($(root).attr(i18NAttributeName)) {
            nodes.push($(root)[0]);
        }
        var i, node, messageKey;
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            messageKey = node.getAttribute(i18NAttributeName);
            browser.i18n.setI18nAttributeValue(node, i18NAttributeName, messageKey);
        }
    };

    //#endregion


})();

(function() {
    "use strict";

    browser.i18n.init();
})();