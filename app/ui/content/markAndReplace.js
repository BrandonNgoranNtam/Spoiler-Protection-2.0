(function () {
    "use strict";

    // Extend the core.markAndReplace object with additional properties and methods
    $.extend(core.markAndReplace, {


        // Regular expressions for matching non-alphanumeric characters
        NON_NUMBER_AND_NON_LETTER_OUTSIDE_REG_EXP: /[^a-z0-9]/,
        NON_NUMBER_AND_NON_LETTER_INSIDE_REG_EXP: "[^a-z0-9]",
        NUMBER_OR_LETTER_OUTSIDE_REG_EXP: /[a-z0-9]/,

        // Caches for text and corresponding spoiler strings
        textCache: [],
        spoilerStringCache: [],

        // List of normalized spoiler strings
        normalizedSpoilerStringList: [],

    
        // Marks an element for replacement and hides it
        markElementForReplaceDivAndHide: function (elementToReplace, displayString) {
            // Skip marking if site-specific conditions are met
            if (core.markAndReplace.siteSpecificSkipMarking) {
                if (core.markAndReplace.siteSpecificSkipMarking(elementToReplace)) {
                    return;
                }
            }
            // If the element is already marked, return
            if (elementToReplace.hasAttribute(core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME)) {
                return;
            }

            // Get the full display string for the spoiler
            displayString = core.markAndReplace.getFullDisplayString(displayString);
            var originalStyle = elementToReplace.getAttribute("style");
            var elementToReplaceWidth = core.markAndReplace.getElementToReplaceWidth(elementToReplace);
            var elementToReplaceHeight = core.markAndReplace.getElementToReplaceHeight(elementToReplace);

            // Set attributes to mark the element for replacement
            elementToReplace.setAttribute(core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME, "true");
            elementToReplace.setAttribute(core.markAndReplace.REPLACE_TEXT_ATTRIBUTE_NAME, displayString);
            elementToReplace.setAttribute(core.markAndReplace.ORIGINAL_STYLE_ATTRIBUTE_NAME, originalStyle);
            elementToReplace.setAttribute(core.markAndReplace.ORIGINAL_WIDTH_ATTRIBUTE_NAME, elementToReplaceWidth);
            elementToReplace.setAttribute(core.markAndReplace.ORIGINAL_HEIGHT_ATTRIBUTE_NAME, elementToReplaceHeight);

            // Hide the element
            elementToReplace.style.display = "none";

            //elementToReplace.style.filter = "blur(10px)";
            //elementToReplace.style.visibility = "hidden";
        },

        // Constructs the full display string for a spoiler
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

        // Determines if the given text should be replaced with a spoiler string
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

         // Finds a matching spoiler string in the given text
        getMatchingSpoilerStringInText: function (text, withUrlDecode) {

            var normalizeLowerText;
            if (withUrlDecode) {
                normalizeLowerText = text.normalizeStringWithUrlDecode().toLowerCase();
            } else {
                normalizeLowerText = text.normalizeString().toLowerCase();
            }

            // If there are no alphanumeric characters in the text, return null
            if (core.utilities.utils.isNullOrEmpty(normalizeLowerText.match(core.markAndReplace.NUMBER_OR_LETTER_OUTSIDE_REG_EXP))) {
                return null;
            }

            var spoilerList = core.utilities.settings.spoilers.spoilerStringList;
            for (var i = 0; i < spoilerList.length; i++) {
                var spoilerString = spoilerList[i];
                var normalizedLowerSpoilerString = core.markAndReplace.normalizedSpoilerStringList[i];

                // If the spoiler string consists of a single word, check various conditions
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

        // Initializes performance-related settings
        performanceInit: function () {
            core.markAndReplace.normalizedSpoilerStringList = [];
            var spoilerList = core.utilities.settings.spoilers.spoilerStringList;
            for (var i = 0; i < spoilerList.length; i++) {
                core.markAndReplace.normalizedSpoilerStringList.push(spoilerList[i].normalizeString().toLowerCase());
            }
        },

        
        // Gets the context of the spoiler within the element
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

        // Clears the caches for text and spoiler strings
        extensionSpecificClearReplaceDivs: function () {
            core.markAndReplace.textCache = [];
            core.markAndReplace.spoilerStringCache = [];
        },

        // Modifies import divs for spoiler categories
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

    });


})();







