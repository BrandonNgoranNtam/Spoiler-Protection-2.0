(function () {
    "use strict";

    $.extend(core.markAndReplace, {

        //#region properties and consts

        NON_NUMBER_AND_NON_LETTER_OUTSIDE_REG_EXP: /[^a-z0-9]/,
        NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP: "[^a-z0-9]",
        NUMBER_OR_LETTER_OUTSIDE_REG_EXP: /[a-z0-9]/,

        //a két tömb index alapján egyezik, hogy a text-hez milyen spoiler string tartozik, így valszeg gyorsabb, mint egy objektum lista lenne, és azon iterálgatni végig
        textCache: [],
        spoilerStringCache: [],


        normalizedSpoilerStringList: [],

        //#endregion

        //#region init

        //#endregion

        //#region public functions

        //#endregion

        //#region private functions

        markElementForReplaceDivAndHide: function (elementToReplace, displayString) {
            if (core.markAndReplace.siteSpecificSkipMarking) {
                if (core.markAndReplace.siteSpecificSkipMarking(elementToReplace)) {
                    return;
                }
            }

            if (elementToReplace.hasAttribute(core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME)) {
                return;
            }

            displayString = core.markAndReplace.getFullDisplayString(displayString);
            var originalStyle = elementToReplace.getAttribute("style");
            var elementToReplaceWidth = core.markAndReplace.getElementToReplaceWidth(elementToReplace);
            var elementToReplaceHeight = core.markAndReplace.getElementToReplaceHeight(elementToReplace);

            elementToReplace.setAttribute(core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME, "true");
            elementToReplace.setAttribute(core.markAndReplace.REPLACE_TEXT_ATTRIBUTE_NAME, displayString);
            elementToReplace.setAttribute(core.markAndReplace.ORIGINAL_STYLE_ATTRIBUTE_NAME, originalStyle);
            elementToReplace.setAttribute(core.markAndReplace.ORIGINAL_WIDTH_ATTRIBUTE_NAME, elementToReplaceWidth);
            elementToReplace.setAttribute(core.markAndReplace.ORIGINAL_HEIGHT_ATTRIBUTE_NAME, elementToReplaceHeight);

            elementToReplace.style.display = "none";

            //elementToReplace.style.filter = "blur(10px)";
            //elementToReplace.style.visibility = "hidden";
        },

        getFullDisplayString: function (displayString) {
            var res = "";
            if (app.ui.modules.spoilersLogic.getIsSpoilerCategoryVisible()) {
                var category = app.ui.modules.spoilerCategoriesLogic.getCategoryToSpoilerText(displayString);
                res = category;
            }
            if (app.ui.modules.spoilersLogic.getIsSpoilerNameVisible()) {
                if (res.length > 0) {
                    res = res + " - ";
                }
                res += "'" + displayString + "'";
            }
            return res;

        },

        shouldReplaceText: function (text, withUrlDecode) {
            var res = {};
            res.shouldReplace = false;
            var trimmedText = text.replace('↵', "").trim();
            if (trimmedText.length > 0) {
                if (core.markAndReplace.textCache.indexOf(trimmedText) == -1) {
                    core.markAndReplace.textCache.push(trimmedText);
                    core.markAndReplace.spoilerStringCache.push(core.markAndReplace.getMatchingSpoilerStringInText(trimmedText, withUrlDecode));
                }
                var textIndex = core.markAndReplace.textCache.indexOf(trimmedText);

                //set the spoilerstring what will appear on the replaced div
                res.alternateText = core.markAndReplace.spoilerStringCache[textIndex];
                //if spoilerstring has been found, do the replace at the caller
                res.shouldReplace = res.alternateText != null;
            }
            return res;
        },

        getMatchingSpoilerStringInText: function (text, withUrlDecode) {

            var normalizeLowerText;
            if (withUrlDecode) {
                normalizeLowerText = text.normalizeStringWithUrlDecode().toLowerCase();
            } else {
                normalizeLowerText = text.normalizeString().toLowerCase();
            }

            //there is no letter or number in the text
            if (core.utilities.utils.isNullOrEmpty(normalizeLowerText.match(core.markAndReplace.NUMBER_OR_LETTER_OUTSIDE_REG_EXP))) {
                return null;
            }

            var spoilerList = core.utilities.settings.spoilers.spoilerStringList;
            for (var i = 0; i < spoilerList.length; i++) {
                var spoilerString = spoilerList[i];
                var normalizedLowerSpoilerString = core.markAndReplace.normalizedSpoilerStringList[i];

                //NOTE: Ha csak egy szóból áll a spoilerString, akkor az alább felsorolt vizsgálatok alapján adjuk vissza.
                //      Ha több szóból áll, akkor replace-eljük az összes nem szám és betű karaktert és megnézzük, hogy tartalmazza-e.
                if (normalizedLowerSpoilerString.split(core.markAndReplace.NON_NUMBER_AND_NON_LETTER_OUTSIDE_REG_EXP).length === 1) {
                    //NOTE: 4 opció van, amire viszgálni kell, hogy megtaláljunk minden előforduló eshetőséget(nem mindegy a sorrend!):
                    //      - A szöveg közepén van valahol a spoilerString
                    //      - A spoilerString-el kezdődik a szöveg (erre csak akkor kell vizsgálni ha egy szóból áll)
                    //      - A spoilerString-el végződik a szöveg (erre csak akkor kell vizsgálni ha egy szóból áll)
                    //      - Megegyezik a két szöveg
                    if (
                        (new RegExp(core.markAndReplace.NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP + normalizedLowerSpoilerString + core.markAndReplace.NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP).test(normalizeLowerText)) ||
                        (new RegExp("^" + normalizedLowerSpoilerString + core.markAndReplace.NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP).test(normalizeLowerText)) ||
                        (new RegExp(core.markAndReplace.NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP + normalizedLowerSpoilerString + "$").test(normalizeLowerText)) ||
                        (normalizedLowerSpoilerString === normalizeLowerText)) {
                        return spoilerString;
                    }
                } else {
                    var compareSpoilerString = normalizedLowerSpoilerString.replaceAll(core.markAndReplace.NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP, "");
                    var compareText = normalizeLowerText.replaceAll(core.markAndReplace.NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP, "");
                    if (compareText.contains(compareSpoilerString)) {
                        return spoilerString;
                    }
                }
            }
            return null;
        },

        performanceInit: function () {
            core.markAndReplace.normalizedSpoilerStringList = [];
            var spoilerList = core.utilities.settings.spoilers.spoilerStringList;
            for (var i = 0; i < spoilerList.length; i++) {
                core.markAndReplace.normalizedSpoilerStringList.push(spoilerList[i].normalizeString().toLowerCase());
            }
        },

        getSpoilerContext: function (elementToReplace) {
            var res = elementToReplace;

            var closestTimeLineContainer;
            var domain = elementToReplace.ownerDocument.domain;
            for (var i = 0; i < core.utilities.settings.spoilerContexts.spoilerContextList.length; i++) {
                var spoilerContext = core.utilities.settings.spoilerContexts.spoilerContextList[i];
                if ((spoilerContext.siteUrlPart == "*") || domain.contains(spoilerContext.siteUrlPart)) {
                    var elementMarker = spoilerContext.elementMarker;
                    if (elementMarker.jQuerySelectorClasses) {
                        closestTimeLineContainer = elementToReplace.closest(elementMarker.jQuerySelectorClasses);
                        if (closestTimeLineContainer != null) {
                            res = closestTimeLineContainer;
                            break;

                        }
                    }
                    if (elementMarker.jQuerySelectorIds) {
                        closestTimeLineContainer = elementToReplace.closest(elementMarker.jQuerySelectorIds);
                        if (closestTimeLineContainer != null) {
                            res = closestTimeLineContainer;
                            break;

                        }
                    }
                    if (elementMarker.nodeNames) {
                        closestTimeLineContainer = elementToReplace.closest(elementMarker.nodeNames);
                        if (closestTimeLineContainer != null) {
                            res = closestTimeLineContainer;
                            break;

                        }
                    }
                }
            }

            return res;
        },

        /// summary
        /// On some page, we have to skip elements, because spoiler protection ruins the usability
        /// summary
        siteSpecificSkipMarking: function (elementToReplace) {
            if (elementToReplace.ownerDocument.domain.contains(core.socials.twitter.DOMAIN_NAME_PART)) {
                if (elementToReplace.closest(core.socials.twitter.RICH_TEXT_EDITOR) != null) {
                    return true;
                }
            }
            return false;
        },

        extensionSpecificClearReplaceDivs: function () {
            core.markAndReplace.textCache = [];
            core.markAndReplace.spoilerStringCache = [];
        },

        modifyImportDivs: function () {
            if ($("#extension-installed").length == 0) {
                $("body").append("<div style='display:none' id='extension-installed'></div>")
            }

            var spoilerCategoryDivs = $(".spoiler-category");

            $.each(spoilerCategoryDivs, function (key, spoilerCategoryDiv) {
                var $spoilerCategoryDiv = $(spoilerCategoryDiv);

                if ($spoilerCategoryDiv.attr("marked-for-import-category") != "true") {
                    $spoilerCategoryDiv.attr("marked-for-import-category", "true");

                    var $spoilerCategoryDataDiv = $spoilerCategoryDiv.find('.spoiler-category-data');
                    var categoryText = $spoilerCategoryDataDiv.text();

                    var splittedCategoryText = categoryText.split("|");

                    var categoryName = splittedCategoryText[0].replace("Name:", "").trim();
                    var categoryType = splittedCategoryText[1].replace("Type:", "").trim().replace(" ", "_").decapitalizeFirstLetter();
                    var categoryLanguage = splittedCategoryText[2].replace("Language:", "").trim();
                    var categorySpoilerList = splittedCategoryText[4].replace("SpoilerList:", "").trim().split(",");
                    var categoryId = splittedCategoryText[6].replace("Id:", "").trim();

                    var importFunction = function () {
                        var category = core.utilities.settings.spoilerCategories.spoilerCategoryList.getObjectByName(categoryName);
                        if (category) {
                            $.alert({
                                type: 'red',
                                boxWidth: '25%',
                                content: browser.i18n.getMessage("existing_category")
                            });
                        } else {
                            $.confirm({
                                type: 'blue',
                                useBootstrap: false,
                                boxWidth: '25%',
                                title: browser.i18n.getMessage("import"),
                                content: browser.i18n.getMessage("are_you_sure_to_import_category") + " " + categoryName,
                                buttons: {
                                    confirm: {
                                        btnClass: 'btn-blue',
                                        text: browser.i18n.getMessage("yes"),
                                        action: function () {
                                            if (categoryLanguage == "null") {
                                                categoryLanguage = null;
                                            }
                                            if (categoryType == "null") {
                                                categoryType = null;
                                            }
                                            core.utilities.settings.addOrUpdateCategoryInSettings(false, categoryId, categoryName, categorySpoilerList, categoryLanguage, categoryType);
                                            $.alert({
                                                type: 'blue',
                                                boxWidth: '25%',
                                                content: browser.i18n.getMessage("import_category_success")
                                            });
                                        }
                                    },
                                    cancel: {
                                        text: browser.i18n.getMessage("no"),
                                        btnClass: 'btn-default'
                                    }
                                }
                            });
                        }
                    };

                    $spoilerCategoryDiv.find(".import-a").click(importFunction);

                }

            });
        }

        //#endregion

    });


})();







