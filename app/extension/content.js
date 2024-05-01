(function() {
    "use strict";

    /* window.markToReplaceChildNodesCount = 0; 
    window.j = 0*/

    app.extension.content = app.extension.content || (function() {
        return {

            //#region properties and consts

            observer: null,

            //#endregion

            //improve performance
            pageParts: [],

            //#region init
            init: function () {
                //init observer for dinamically loaded nodes
                app.extension.content.observer = new MutationObserver(function(mutations) {
                    if (!window.core) {
                        window.core = browser.core;
                    }
                    if (!window.app) {
                        window.app = browser.application;
                    }
                    if (!window.$) {
                        window.$ = browser.$;
                    }                    
                    core.utilities.settings.loadSettingsFromStorage(function() {                        
                        if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                            return;
                        }
                        if (location.href.toLowerCase().contains(core.utilities.settings.categoryListUrl)) {
                            app.extension.content.modifyImportDivs_Mutations(mutations);
                        } else {
                            //console.log("observer START", new Date(), (new Date()).getSeconds(), (new Date()).getMilliseconds());
                            app.extension.content.createReplaceDivs_Mutations(mutations);
                            //console.log("observer End", new Date(), (new Date()).getSeconds(), (new Date()).getMilliseconds());
                        }
                    });
                });

                var observerConfig = {
                    childList: true,
                    subtree: true,
                    characterData: true
                };

                app.extension.content.observer.observe(document, observerConfig);

                browser.runtime.onMessage.addListener(function (message, sender) {

                    if (!window.core) {
                        window.core = browser.core;
                    }
                    if (!window.app) {
                        window.app = browser.application;
                    }
                    if (!window.$) {
                        window.$ = browser.$;
                    }
                    core.utilities.settings.loadSettingsFromStorage(function() {
                        if (location.href.contains("ko-fi.com/wecdev") || location.href.contains("ko-fi.com/rolandszik")) {
                            core.utilities.googleAnalitics.trackEvent("kofi_url", "Visited");
                        }                        
                        $("[data-marked-with-border='true']").css("border", "none");

                        switch (message.action) {
                            case core.utilities.message.ACTION_DISABLE_EXTENSION:
                                core.markAndReplace.clearReplaceDivs();
                                core.ui.utilities.badgeText.setCustomBadgeText("X");
                                break;
                        }

                        switch (message.action) {
                            case core.utilities.message.ACTION_RELOAD_CURRENT_TAB_SPOILERS:
                                if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                                    core.markAndReplace.clearReplaceDivs();                                    
                                    break;
                                }
                                if (location.href.toLowerCase().contains(core.utilities.settings.categoryListUrl)) {
                                    core.markAndReplace.modifyImportDivs();
                                    if (location.href.toLowerCase().contains("categoryid")) {                                        
                                        var categoryId = location.search.replace("?categoryId=","");
                                        var $categoryDiv = $(".spoiler-category-data:contains(" + categoryId + ")").closest('.spoiler-category');                                        
                                        $categoryDiv.find(".import-a").click();
                                    }
                                } else {
                                    if (!core.utilities.settings.isUrlInWhiteList(document.location.href)) {
                                        var body = document.getElementsByTagName("BODY")[0];
                                        //console.log("performanceInit START", new Date(), (new Date()).getSeconds(), (new Date()).getMilliseconds());
                                        core.markAndReplace.performanceInit();
                                        //console.log("BODY START", new Date(), (new Date()).getSeconds(), (new Date()).getMilliseconds());
                                        core.markAndReplace.clearReplaceDivs();
                                        core.markAndReplace.markToReplace_childNodes(body);
                                        core.markAndReplace.createReplaceDivs();
                                        //console.log("BODY END", new Date(), (new Date()).getSeconds(), (new Date()).getMilliseconds());
                                    } else {
                                        core.markAndReplace.clearReplaceDivs();
                                    }
                                }
                                break;
                            case core.utilities.message.MARK_ELEMENTS_BY_JQUERY_FILTER:
                                var jQueryFilter = message.parameter;
                                $(jQueryFilter).attr("data-marked-with-border", "true");
                                $(jQueryFilter).css("border", "solid 1px #B22222");
                                break;
                        }

                    });
                    return true;
                });
                
                core.utilities.settings.loadSettingsFromStorage(function() {
                    window.addEventListener(
                        "DOMContentLoaded",
                        function() {
                            setInterval(() => {
                                if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                                    return;
                                }
                                app.extension.content.removeNodes();
                                app.extension.content.removeAllImagesIfNecessary();                   
                            }, 1000);                            
                        },
                        true);

                    if (!core.utilities.settings.enableDisableExtension.extensionIsEnabled) {
                        return;
                    }
                    app.extension.content.removeNodes();
                    app.extension.content.removeAllImagesIfNecessary();     
                });                
            },

            removeAllImagesIfNecessary: function() {
                if (core.utilities.settings.isUrlInWhiteList(document.location.href)) {
                    return;
                }
                app.extension.content.removeImagesVideosFromDocumentIfNecessary(document);

                if (document) {
                    var iframes = document.querySelectorAll("iframe");
                    for(var i = 0; i < iframes.length; i++) {                    
                        app.extension.content.removeImagesVideosFromDocumentIfNecessary(iframes[i].contentDocument);
                    }              
                }  
            },

            removeImagesVideosFromDocumentIfNecessary: function(doc) {                   
                if (doc) { 
                    var images = doc.querySelectorAll("img");                                                        
                    core.markAndReplace.removeImagesIfNecessary(images);
                    var videos = doc.querySelectorAll("video");                                                        
                    core.markAndReplace.removeVideosIfNecessary(videos);

                    var bgimageNodes = app.extension.content.getBgImgsNodes(doc);
                    core.markAndReplace.removeImagesIfNecessary(bgimageNodes);                        
                }
            },


            getBgImgsNodes: function(doc) {
                const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
                return Array.from(
                  Array.from(doc.querySelectorAll('*')).reduce((collection, node) => {
                      let prop = window.getComputedStyle(node, null).getPropertyValue('background-image');                      
                      let match = srcChecker.exec(prop);
                      if (match) {
                        //collection.add(match[1]) <- bag image neve
                        if ((node.nodeName.toLowerCase() != 'body') && (node.clientWidth < 700) && (node.clientWidth > 100)) {
                            collection.add(node);
                        }
                      }
                      return collection;
                    }, new Set())
                );
            },

            removeNodes: function() {                                              
                var domain = document.domain;                

                for(var i = 0; i < core.utilities.settings.spoilerContexts.spoilerContextList.length; i++) {                                       
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


            modifyImportDivs_Mutations: function(mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];
                    if (mutation.addedNodes) {
                        core.markAndReplace.modifyImportDivs();
                    }
                }
            },           

            createReplaceDivs_Mutations: function(mutations) {
                if (!core.utilities.settings.isUrlInWhiteList(document.location.href)) {                   

                    core.markAndReplace.performanceInit();
                    var runCreateReplaceDivs = false;
                    for (var i = 0; i < mutations.length; i++) {
                        var mutation = mutations[i];
                        if (mutation.addedNodes) {
                            for (var j = 0; j < mutation.addedNodes.length; j++) {
                                var node = mutation.addedNodes[j];                                
                                    
                                //continues improve performance
                                if (!node.outerHTML) {                                   
                                    continue;
                                }                                
                                if (node.clientWidth < 100) {                                                                      
                                    continue;
                                }                                
                                if (node.innerText != undefined && node.innerText != null && node.innerText.trim().length == 0) {                                    
                                    continue;
                                }                                                                 
                                if (node.hasAttribute(core.markAndReplace.REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME)) {                                                                       
                                    continue
                                }
                                                                                                 
                                //NOTE: sometimes the nodename is lowercase
                                var toLowerNodeName = node.nodeName.toLowerCase();
                                
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
                    if (runCreateReplaceDivs) {
                        core.markAndReplace.createReplaceDivs();
                    }
                } else {
                    core.ui.utilities.badgeText.setCustomBadgeText("X");
                }
            },

            checkPagePartsContains:function (outerHTML) {
                for(var i = 0; i < app.extension.content.pageParts.length; i++) {
                   if  (app.extension.content.pageParts[i].indexOf(outerHTML) != -1) {
                       return true;
                   }
                }
                return false;
            },


            //#endregion

            //#region public functions

            //#endregion

            //#region private functions


            //#endregion
        }
    })();
})();

(function() {
    "use strict";

    app.extension.content.init();

})();

