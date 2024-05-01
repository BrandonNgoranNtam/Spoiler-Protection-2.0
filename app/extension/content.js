// Immediately Invoked Function Expression (IIFE) to avoid polluting the global namespace
(function () {
    "use strict"; // Enforces stricter parsing and error handling in the script


    // Placeholder for extension-specific functionality within the app namespace
    app.extension.content = app.extension.content || (function () {
        return {

            // Property to hold the MutationObserver instance
            observer: null,

            // Array to improve performance by keeping track of processed parts of the page
            pageParts: [],

            // Initializes the content script functionality
            init: function () {
                // Initialize a MutationObserver to monitor dynamically loaded nodes
                app.extension.content.observer = new MutationObserver(function (mutations) {

                    // Ensure core, app, and jQuery ($) are available in the window scope
                    if (!window.core) {
                        window.core = browser.core;
                    }
                    if (!window.app) {
                        window.app = browser.application;
                    }
                    if (!window.$) {
                        window.$ = browser.$;
                    }
                    // Load settings from storage                   
                    core.utilities.settings.loadSettingsFromStorage(function () {
                        // Exit if the extension is disabled
                        if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                            return;
                        }
                        // Check if the current URL is in the category list URL, modify import divs accordingly
                        if (location.href.toLowerCase().contains(core.utilities.settings.categoryListUrl)) {
                            app.extension.content.modifyImportDivs_Mutations(mutations);
                        } else {
                            // For other URLs, create replacement divs for mutations
                            app.extension.content.createReplaceDivs_Mutations(mutations);
                        }
                    });
                });

                // Configuration for the MutationObserver
                var observerConfig = {
                    childList: true, // Observe direct children
                    subtree: true, // Observe all descendants
                    characterData: true // Observe text changes
                };

                // Start observing the document with the configured options
                app.extension.content.observer.observe(document, observerConfig);

                // Listen for messages from other parts of the extension
                browser.runtime.onMessage.addListener(function (message, sender) {
                    // Ensure core, app, and jQuery ($) are available in the window scope
                    if (!window.core) {
                        window.core = browser.core;
                    }
                    if (!window.app) {
                        window.app = browser.application;
                    }
                    if (!window.$) {
                        window.$ = browser.$;
                    }
                    // Load settings from storage
                    core.utilities.settings.loadSettingsFromStorage(function () {
                        // Special handling for specific URLs
                        // If the current page is one of the specified URLs, track the event using Google Analytics
                        if (location.href.contains("ko-fi.com/wecdev") || location.href.contains("ko-fi.com/rolandszik")) {
                            core.utilities.googleAnalitics.trackEvent("kofi_url", "Visited");
                        }
                        // Clear borders marked for debugging
                        // This is useful for visually identifying elements affected by the extension in development

                        $("[data-marked-with-border='true']").css("border", "none");

                        // Handle different actions from messages
                        switch (message.action) {

                            // If the message action is to disable the extension
                            case core.utilities.message.ACTION_DISABLE_EXTENSION:
                                // Clear all modifications made by the extension
                                core.markAndReplace.clearReplaceDivs();
                                // Update the extension's badge text to "X" to indicate it's disabled
                                core.ui.utilities.badgeText.setCustomBadgeText("X");
                                break;
                        }

                        // Additional switch case for handling other message actions
                        switch (message.action) {
                            // If the message action is to reload spoilers on the current tab
                            case core.utilities.message.ACTION_RELOAD_CURRENT_TAB_SPOILERS:
                                // Check if the extension is enabled
                                if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                                    // If not, clear all modifications and exit
                                    core.markAndReplace.clearReplaceDivs();
                                    break;
                                }
                                // If the current URL contains the category list URL, modify import divs accordingly
                                if (location.href.toLowerCase().contains(core.utilities.settings.categoryListUrl)) {
                                    core.markAndReplace.modifyImportDivs();
                                    // If the URL also contains "categoryid", simulate a click on the import button for that category
                                    if (location.href.toLowerCase().contains("categoryid")) {
                                        var categoryId = location.search.replace("?categoryId=", "");
                                        var $categoryDiv = $(".spoiler-category-data:contains(" + categoryId + ")").closest('.spoiler-category');
                                        $categoryDiv.find(".import-a").click();
                                    }
                                } else {
                                    // For other URLs, if they are not whitelisted, proceed to mark and replace spoilers
                                    if (!core.utilities.settings.isUrlInWhiteList(document.location.href)) {
                                        var body = document.getElementsByTagName("BODY")[0];
                                        core.markAndReplace.performanceInit();
                                        core.markAndReplace.clearReplaceDivs();
                                        core.markAndReplace.markToReplace_childNodes(body);
                                        core.markAndReplace.createReplaceDivs();
                                    } else {
                                        // If the URL is whitelisted, clear all modifications
                                        core.markAndReplace.clearReplaceDivs();
                                    }
                                }
                                break;
                            // If the message action is to mark elements by jQuery filter
                            case core.utilities.message.MARK_ELEMENTS_BY_JQUERY_FILTER:
                                // Apply a red border to elements matching the jQuery filter
                                // This is useful for debugging or highlighting specific elements
                                var jQueryFilter = message.parameter;
                                $(jQueryFilter).attr("data-marked-with-border", "true");
                                $(jQueryFilter).css("border", "solid 1px #B22222");
                                break;
                        }
                    });
                    // Return true to indicate that the listener will asynchronously send a response
                    return true;
                });
                // Load settings and set up DOMContentLoaded listener to periodically remove nodes and images
                core.utilities.settings.loadSettingsFromStorage(function () {
                    window.addEventListener(
                        "DOMContentLoaded",
                        function () {
                            setInterval(() => {
                                if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                                    return;
                                }
                                app.extension.content.removeNodes();
                                app.extension.content.removeAllImagesIfNecessary();
                            }, 1000); // Interval set to 1000 milliseconds (1 second)                             
                        },
                        true);

                    // Initial call to remove nodes and images if the extension is enabled
                    if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                        return;
                    }
                    app.extension.content.removeNodes();
                    app.extension.content.removeAllImagesIfNecessary();
                });
            },

            // Function to remove all images if necessary based on settings and whitelist
            removeAllImagesIfNecessary: function () {
                // Check if the current URL is whitelisted and return if so
                if (core.utilities.settings.isUrlInWhiteList(document.location.href)) {
                    return;
                }
                // Remove images and videos from the document and iframes
                app.extension.content.removeImagesVideosFromDocumentIfNecessary(document);

                // Process iframes separately
                if (document) {
                    var iframes = document.querySelectorAll("iframe");
                    for (var i = 0; i < iframes.length; i++) {
                        app.extension.content.removeImagesVideosFromDocumentIfNecessary(iframes[i].contentDocument);
                    }
                }
            },

            // Function to remove images and videos from a document if necessary
            removeImagesVideosFromDocumentIfNecessary: function (doc) {
                if (doc) {
                    // Query and process images and videos for removal
                    var images = doc.querySelectorAll("img");
                    core.markAndReplace.removeImagesIfNecessary(images);
                    var videos = doc.querySelectorAll("video");
                    core.markAndReplace.removeVideosIfNecessary(videos);

                    // Process background images for removal
                    var bgimageNodes = app.extension.content.getBgImgsNodes(doc);
                    core.markAndReplace.removeImagesIfNecessary(bgimageNodes);
                }
            },


            // Function to get nodes with background images that meet certain criteria
            getBgImgsNodes: function (doc) {
                const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
                return Array.from(
                    Array.from(doc.querySelectorAll('*')).reduce((collection, node) => {
                        let prop = window.getComputedStyle(node, null).getPropertyValue('background-image');
                        let match = srcChecker.exec(prop);
                        if (match) {
                            // Check node criteria and add to collection if it matches
                            if ((node.nodeName.toLowerCase() != 'body') && (node.clientWidth < 700) && (node.clientWidth > 100)) {
                                collection.add(node);
                            }
                        }
                        return collection;
                    }, new Set())
                );
            },

            // Function to remove nodes based on settings and domain-specific rules
            removeNodes: function () {
                var domain = document.domain;

                // Iterate through spoiler contexts and apply removal rules
                for (var i = 0; i < core.utilities.settings.spoilerContexts.spoilerContextList.length; i++) {
                    var spoilerContext = core.utilities.settings.spoilerContexts.spoilerContextList[i];
                    if ((spoilerContext.siteUrlPart == "*") || domain.contains(spoilerContext.siteUrlPart)) {
                        var elementMarker = spoilerContext.elementMarker;
                        if (elementMarker.removeSelectors) {
                            var elements = document.querySelectorAll(elementMarker.removeSelectors);
                            $(elements).css("cssText", "display: none !important");
                        }
                    }
                }

            },


            // Function to modify import divs based on mutations
            modifyImportDivs_Mutations: function (mutations) {
                // Iterate through mutations and apply modifications
                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];
                    if (mutation.addedNodes) {
                        core.markAndReplace.modifyImportDivs();
                    }
                }
            },

            // Function to create replacement divs based on mutations
            createReplaceDivs_Mutations: function (mutations) {
                // Check if the URL is whitelisted before proceeding
                if (!core.utilities.settings.isUrlInWhiteList(document.location.href)) {

                    core.markAndReplace.performanceInit();
                    var runCreateReplaceDivs = false;
                    // Iterate through mutations and nodes to determine if replacement is necessary
                    for (var i = 0; i < mutations.length; i++) {
                        var mutation = mutations[i];
                        if (mutation.addedNodes) {
                            for (var j = 0; j < mutation.addedNodes.length; j++) {
                                var node = mutation.addedNodes[j];

                                // Performance improvement checks
                                if (!node.outerHTML || node.clientWidth < 100 || (node.innerText != undefined && node.innerText.trim().length == 0) || node.hasAttribute(core.markAndReplace.REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME)) {
                                    continue;
                                }

                                var toLowerNodeName = node.nodeName.toLowerCase();

                                // Skip certain node types
                                if ((toLowerNodeName == "#text") ||
                                    (toLowerNodeName == "option") ||
                                    (toLowerNodeName == "input") ||
                                    (toLowerNodeName == "script") ||
                                    (toLowerNodeName == "meta") ||
                                    (toLowerNodeName == "noscript") ||
                                    (toLowerNodeName == "title") ||
                                    (toLowerNodeName == "link") ||
                                    (toLowerNodeName == "stype") ||
                                    (toLowerNodeName == "time") ||
                                    (toLowerNodeName == "path") ||
                                    (toLowerNodeName == "button") ||
                                    (toLowerNodeName == "svg") ||
                                    (toLowerNodeName == "head") ||
                                    //we skip body, it's the 20ies, there will be inner elements in the body
                                    (toLowerNodeName == "body") ||
                                    //we skip iframes too, in the manifest this extension run on every iframe, 
                                    (toLowerNodeName == "iframe")
                                ) {
                                    //console.log("!!!!!!!!!!!!!!!!!!! SKIPPED NODES: "+ toLowerNodeName);
                                    continue;
                                } else {
                                    //console.log("NON SKIPPED NODES: "+ toLowerNodeName);
                                }

                                /*console.log("j:" + window.j);
                                window.j++;                                
                                console.log("toLowerNodeName: "+ toLowerNodeName);
                                console.log("node.outerHTML: "+ node.outerHTML);
                                console.log("node.innerText: "+ node.innerText);*/

                                // Check if node is a div, article, section, or table and hasn't been processed
                                if ((toLowerNodeName == "div") ||
                                    (toLowerNodeName == "article") ||
                                    (toLowerNodeName == "section") ||
                                    (toLowerNodeName == "table")) {
                                    if (!app.extension.content.checkPagePartsContains(node.outerHTML)) {
                                        app.extension.content.pageParts.push(node.outerHTML);

                                        /*window.markToReplaceChildNodesCount++;
                                        console.log("window.markToReplaceChildNodesCount: " + window.markToReplaceChildNodesCount);*/
                                        core.markAndReplace.markToReplace_childNodes(node);
                                        runCreateReplaceDivs = true;
                                    }
                                } else {
                                    if (app.extension.content.checkPagePartsContains(node.outerHTML)) {
                                        continue;
                                    }

                                    /*window.markToReplaceChildNodesCount++;
                                    console.log("window.markToReplaceChildNodesCount: " + window.markToReplaceChildNodesCount);*/
                                    core.markAndReplace.markToReplace_childNodes(node);
                                    runCreateReplaceDivs = true;
                                }
                            }
                        }
                    }

                    // Run createReplaceDivs if necessary
                    if (runCreateReplaceDivs) {
                        core.markAndReplace.createReplaceDivs();
                    }
                } else {
                    core.ui.utilities.badgeText.setCustomBadgeText("X");
                }
            },

            // Function to check if a page part has already been processed
            checkPagePartsContains: function (outerHTML) {
                for (var i = 0; i < app.extension.content.pageParts.length; i++) {
                    if (app.extension.content.pageParts[i].indexOf(outerHTML) != -1) {
                        return true;
                    }
                }
                return false;
                return false;
            },
        }
    })();
})();

(function () {
    "use strict";
    // Initialize the content script functionality
    app.extension.content.init();

})();

