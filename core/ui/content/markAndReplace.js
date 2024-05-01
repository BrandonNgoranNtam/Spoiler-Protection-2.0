(function() {
    "use strict";

   // window.j = 0;

    core.markAndReplace = core.markAndReplace || (function() {

        return {

            //#region properties and consts

            //modify together 
            REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME: "data-replacer-element-marker",                                   

            REPLACE_NEEDED_ATTRIBUTE_NAME: "data-replace-needed",
            
            ORIGINAL_STYLE_ATTRIBUTE_NAME: "data-original-style",
            ORIGINAL_WIDTH_ATTRIBUTE_NAME: "data-original-width",
            ORIGINAL_HEIGHT_ATTRIBUTE_NAME: "data-original-height",
            REPLACE_TEXT_ATTRIBUTE_NAME: "data-replace-text",

            //modify together (after typescript it van go to the constructor)
            TEXT_FORMATTING_ELEMENTS: ["B", "EM", "I", "SMALL", "STRONG", "SUB", "SUP", "INS", "DEL", "MARK"],            
            NOT_TEXT_FORMATTING_ELEMENTS_STRING: ":not(b):not(em):not(i):not(small):not(strong):not(sub):not(sup):not(ins):not(del):not(mark)",

            skipElementsFromRenderReplaceDivBecauseItHasBeenRestored: [],

            tableText:
"<table data-replacer-element-marker='true'" +
       "style='all: unset !important;" +
              "text-transform: initial !important;" +
              "line-height: 16px !important;" +
              "width: #elementToReplaceWidth#px !important;" +
              "height: #elementToReplaceHeight#px !important;" +
              "color: white !important;" +
              "font-size: 12px !important;" +
              "font-family: Arial !important;" +
              "font-weight: bold !important;" +
              "padding: 5px !important;" +
              "background-color: #backgroundColor# !important;" +
              "border-radius: 4px !important;" +
              "display: inline-block !important;" +
              "position: relative !important;" +
              "cursor: default !important;" +
              "z-index: 10 !important;'>"+
    "<tr style='all: unset !important;" +
               "vertical-align: middle !important;'>"+
        "<td style='all: unset !important;" +
                   "vertical-align: middle !important;'>"+
            "<span title='#title#' " +
                  "style='all: unset !important;" +
                         "font-size: 12px !important;" +
                         "display: block !important; " +
                         "padding-left: 5px !important;" +
                         "text-overflow: ellipsis !important; " +
                         "overflow: hidden !important; " +
                         "white-space: nowrap !important;" +
                         "width: #textWidth#px !important;'>#text#</span>"+
        "</td>"+
    "</tr>"+
"</table>",
 
            //#endregion

            //#region init

            //#endregion

            //#region public functions

            /// summary
            /// Call the marking recursively from the given node
            /// summary
            markToReplace_childNodes: function(node) {               
                //NOTE: when loading, the first time the node is null when we call this from browser.tabs.onUpdated.addListener
                if (!node) {
                    return;
                }
                if (core.markAndReplace.replaceDivIsEnabled(node, node.nodeName)) {

                    var cn = node.childNodes;
                    var n = cn.length;
                    var child;
                    for (var i = 0; i < n; i++) {
                        child = cn[i];                        
                        
                        //NOTE: sometimes the nodename is lowercase
                        var toLowerchildNodeName = child.nodeName.toLowerCase();

                        if (toLowerchildNodeName === "img") {
                            core.markAndReplace.removeImagesIfNecessary(child);
                        }
                        if (toLowerchildNodeName === "video") {
                            core.markAndReplace.removeVideosIfNecessary(child);
                        }
                        
                        //a sometimes contains inner elements, so we have to start with A replacement
                        if (toLowerchildNodeName === "a") {                            
                            core.markAndReplace.markToReplace_a(child);
                        } else if (toLowerchildNodeName === "#text") {
                            core.markAndReplace.markToReplace_text(child);
                        } else if (toLowerchildNodeName === "img") {
                            core.markAndReplace.markToReplace_image(child);
                        } else {                                                            
                            //check if already marked
                            if (child.getAttribute && child.getAttribute(core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME)) {
                                return;
                            }

                            //NOTE: we don't call it on the created div
                            if (!node.getAttribute(core.markAndReplace.REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME)) {
                                core.markAndReplace.markToReplace_childNodes(child);
                            }
                        }                                               
                    }
                }
            },

            //#endregion

            //#region private functions

            //#region mark     
            
            removeImagesIfNecessary: function(imageElement) {    
                if (!app.ui.modules.spoilersLogic.getIsImagesVisible()) {                    
                    $(imageElement).hide();
                } 
            },

            removeVideosIfNecessary: function(imageElement) {    
               /* if (!app.ui.modules.spoilersLogic.getIsVideosVisible()) {                    
                    $(imageElement).hide();
                } */ 
            },

            markToReplace_a: function (a) {                                
                var replace;
                
                if (a.innerText) {
                    replace = core.markAndReplace.shouldReplaceText(a.innerText);                               
                } 
                //if  a.innerText failed to match               
                if (a.href && (!replace || replace && !replace.shouldReplace)) {
                    replace = core.markAndReplace.shouldReplaceText(a.href, true);                                 
                }

                if (replace && replace.shouldReplace) {                    
                    //if the link is in paragraph
                    var aOrParent = a;
                    if (a.parentElement.nodeName.toLowerCase() == "p") {
                        aOrParent = a.parentElement;
                    }
                    var elementToReplace = core.markAndReplace.getSpoilerContext(aOrParent);                
                    core.markAndReplace.markElementForReplaceDivAndHide(elementToReplace, replace.alternateText);                    
                } 
            },

            markToReplace_text: function(textNode) {               
                var replace = core.markAndReplace.shouldReplaceText(textNode.data);
                if (replace && replace.shouldReplace) {

                    var elementToReplace;
                    var textNodeParentElement = textNode.parentElement;
    
                    //if the parent is a formatter, we will find the first nonformatter parent, that should be replaced
                    if (core.markAndReplace.TEXT_FORMATTING_ELEMENTS.contains(textNodeParentElement.nodeName)) {                    
                        var closestNonFormattingParent = textNodeParentElement.closest(core.markAndReplace.NOT_TEXT_FORMATTING_ELEMENTS_STRING);                    
                        elementToReplace = core.markAndReplace.getSpoilerContext(closestNonFormattingParent);
                    } else {
                        elementToReplace = core.markAndReplace.getSpoilerContext(textNode.parentElement);
                    }

                    core.markAndReplace.markElementForReplaceDivAndHide(elementToReplace, replace.alternateText);
                }
            },          

            markToReplace_image: function(image) {                               
                var replace; 
                
                if (image.title) {
                    replace = core.markAndReplace.shouldReplaceText(image.title);                    
                }                 
                //if image.title failed to match               
                if (image.alt && (!replace || replace && !replace.shouldReplace)) {
                    replace = core.markAndReplace.shouldReplaceText(image.alt);                    
                } 

                //if image.title and image.alt failed to match               
                if (image.src && (!replace || replace && !replace.shouldReplace)) {
                    replace = core.markAndReplace.shouldReplaceText(image.src, true);                    
                }
                               
                if (replace && replace.shouldReplace) {
                    var elementToReplace = core.markAndReplace.getSpoilerContext(image);
                    core.markAndReplace.markElementForReplaceDivAndHide(elementToReplace, replace.alternateText);                        
                }
            },

            ///Summary
            ///Returns true if the node can contains text elements
            ///
            ///Enabled localName(s): a, abbr, b, blink, cite, code, details, desc, div, em, font, g-raised-button, g-flat-button,
            ///                      h1, h2, h3, h4, h5, h6, i, iframe, label, legend, li, nobr, option, p, pre, small, span, strike,
            ///                      strong, sup, summary, td, textarea, th, title, u, var, button
            ///Disabled localName(s): head, noscript, script, style, time
            ///Summary
            replaceDivIsEnabled: function(node, nodeName) {                   
                if ((nodeName == "#text") && (node.data.replace('↵', "").trim().length == 0)) {
                        return false;
                }

                if(node.hasAttribute && node.hasAttribute(core.markAndReplace.REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME)){
                    return false;
                }

                var toLowerNodeName = nodeName.toLowerCase();

                if (toLowerNodeName == "head" ||
                    toLowerNodeName == "noscript" ||
                    toLowerNodeName == "script" ||
                    toLowerNodeName == "style" ||
                    toLowerNodeName == "time" ||
                    toLowerNodeName == "meta" ||
                    toLowerNodeName == "svg" ||
                    toLowerNodeName == "path" ||
                    toLowerNodeName == "button" ||
                    toLowerNodeName == "input"
                ) {
                    return false;
                }

                if (node.parentElement) {
                    var  toLowerParentElementLocalName = node.parentElement.localName.toLowerCase();
                    return toLowerParentElementLocalName !== "head" &&
                           toLowerParentElementLocalName !== "noscript" &&
                           toLowerParentElementLocalName !== "script" &&
                           toLowerParentElementLocalName !== "style" &&
                           toLowerParentElementLocalName !== "time";
                }

            },

            getElementWithSize: function(element) {                
                //NOTE: The "a" html element doesn't have width and height (almost always), so we get the first child element with width and height
                var elementWithSize = element;
                if (element.nodeName === "A" && element.clientWidth < 1 && element.clientHeight < 1) {
                    for(var i = 0; i < element.children; i++) {
                        var child = element.children[i];                        
                        if (child.clientWidth > 0 && child.clientHeight > 0) {                            
                            elementWithSize = child;
                            break;
                        }
                    }
                }
                return elementWithSize;
            },

            getElementToReplaceWidth: function(element) {                
                var elementToReplaceWidth = core.markAndReplace.getElementWithSize(element).clientWidth;
                //NOTE: 100 is the default width if we can't read the default width
                if (elementToReplaceWidth === 0) {
                    elementToReplaceWidth = 100;
                } else if (elementToReplaceWidth < 42) {
                    //NOTE: 42 is the minimum width to fit the close icon and the 3 dots.
                    elementToReplaceWidth = 42;
                }
                return elementToReplaceWidth;
            },

            getElementToReplaceHeight: function(element) {                
                //12 is because 5,5 is padding 1,1 the border
                var elementToReplaceHeight = core.markAndReplace.getElementWithSize(element).clientHeight - 12;

                //NOTE: 16 is the minimum height(height of the close icon)
                if (elementToReplaceHeight < 16) {
                    elementToReplaceHeight = 16;
                }
                return elementToReplaceHeight;
            },

            //#endregion mark

            //#region replace

            createReplaceDivs: function() {                
                //if not selected, then null and we don't generate the spoiler hide element
                if (app.ui.modules.spoilerCoverBackgroundLogic.getBackgroundColor() == null) {
                    return;
                }                
                              
                /*it would be better native for, this unfortunatelly doesn't works, we keep jquery here
                after the first red div, it stops rendering the others
                something wrong with  REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME: "data-replacer-element-marker" 
                if we remove it from the table we get multiple thousand red div (wrong behavior) but the red divs appear

                var elementsToReplace = document.body.querySelectorAll("[" + core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME + "='true']");
                for(var i = 0; i < elementsToReplace.length; i++) {
                    var markedDiv = elementsToReplace[i];*/
                
                $.each($("[" + core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME + "='true']"), function(key, markedDiv) {
                                        
                    if (markedDiv.nextElementSibling && markedDiv.nextElementSibling.getAttribute(core.markAndReplace.REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME)) {
                        return;
                    }
                    
                    if (core.markAndReplace.skipElementsFromRenderReplaceDivBecauseItHasBeenRestored.contains(core.markAndReplace.getDomPath(markedDiv))) {
                        //NOTE: some page, (twitter.com switching between 'Tweets'  and 'Tweets' and answers) somehow load back the modified content from somewhere, even we press the show original icon,
                        //and removed our attributes from the blocked element, those appears again. So we have to restore here anyway the original element.                        
                        core.markAndReplace.restoreBlockedElement(markedDiv);
                        return;
                    }

                    var elementToReplaceWidth = markedDiv.getAttribute(core.markAndReplace.ORIGINAL_WIDTH_ATTRIBUTE_NAME);
                    var elementToReplaceHeight = markedDiv.getAttribute(core.markAndReplace.ORIGINAL_HEIGHT_ATTRIBUTE_NAME);

                    var replaceText = markedDiv.getAttribute(core.markAndReplace.REPLACE_TEXT_ATTRIBUTE_NAME);



                    //NOTE: -5, hogy biztos kiférjen , 1-2 pixel elronthatja, és széttöri az oldalt
                    //NOTE: A text-overflow: ellipsis miatt kell a -30px hogy kiférjen a 3 pont.
                    var tableText = core.markAndReplace.tableText.replace("#elementToReplaceWidth#", elementToReplaceWidth - 5)
                        .replace("#elementToReplaceHeight#", elementToReplaceHeight)
                        .replace("#backgroundColor#", app.ui.modules.spoilerCoverBackgroundLogic.getBackgroundColor())
                        .replace("#textWidth#", elementToReplaceWidth - 30)
                        .replace("#title#", replaceText)
                        .replace("#text#", replaceText);
                        
                    var overlayTable = core.markAndReplace.createElementFromHTML(tableText);
                    overlayTable.addEventListener("mouseover", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }, false);
                    overlayTable.addEventListener("click", function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        core.markAndReplace.showOriginalElement(e);
                        return false;
                    }, false);
                                                                                    
                    markedDiv.after(overlayTable);
                                                         
                    core.ui.utilities.badgeText.increaseBadgeText();
                });                
            },

            createElementFromHTML: function(htmlString) {                
                var div = document.createElement('div');
                div.innerHTML = htmlString.trim();                                
                return div.firstChild; 
            },

            getDomPath: function(el) {	                
                var stack = [];
                while ( el.parentNode != null ) {
                    
                    var sibCount = 0;
                    var sibIndex = 0;
                    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
                        var sib = el.parentNode.childNodes[i];
                        if ( sib.nodeName == el.nodeName ) {
                            if ( sib === el ) {
                                sibIndex = sibCount;
                            }
                            sibCount++;
                        }
                    }
                    if ( el.hasAttribute('id') && el.id != '' ) {
                        stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
                    } else if ( sibCount > 1 ) {
                        stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
                    } else {
                        stack.unshift(el.nodeName.toLowerCase());
                    }
                    el = el.parentNode;
                }        
                return stack.join(">");
            },

            ///Summary
            ///This function removes the replacer div and restores the original DOM
            ///Summary
            showOriginalElement: function(e) {                
                var clickedElement = e.target;
                var overlayElement = clickedElement.closest("[" + core.markAndReplace.REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME + "='true']");

                core.markAndReplace.skipElementsFromRenderReplaceDivBecauseItHasBeenRestored.push(core.markAndReplace.getDomPath(overlayElement.previousElementSibling));

                core.markAndReplace.removeOneReplaceDiv(overlayElement);
                core.ui.utilities.badgeText.decreaseBadgeText();

                //NOTE: prevent click for the covered html element
                e.preventDefault();
                e.stopPropagation();
            },


            removeOneReplaceDiv: function(overlayElement) {                
                var blockedHtmlElement = overlayElement.previousElementSibling;                
                overlayElement.parentNode.removeChild(overlayElement);
                core.markAndReplace.restoreBlockedElement(blockedHtmlElement);
            },

            restoreBlockedElement: function(blockedHtmlElement) {                                
                var originalStyle = blockedHtmlElement.getAttribute(core.markAndReplace.ORIGINAL_STYLE_ATTRIBUTE_NAME);
                if (originalStyle != null && originalStyle.length > 0) {
                    blockedHtmlElement.setAttribute("style", originalStyle);
                } else {
                    blockedHtmlElement.removeAttribute("style");
                }

                blockedHtmlElement.removeAttribute(core.markAndReplace.REPLACE_NEEDED_ATTRIBUTE_NAME);
                blockedHtmlElement.removeAttribute(core.markAndReplace.ORIGINAL_STYLE_ATTRIBUTE_NAME);
                blockedHtmlElement.removeAttribute(core.markAndReplace.REPLACE_TEXT_ATTRIBUTE_NAME);
                blockedHtmlElement.removeAttribute(core.markAndReplace.ORIGINAL_WIDTH_ATTRIBUTE_NAME);
                blockedHtmlElement.removeAttribute(core.markAndReplace.ORIGINAL_HEIGHT_ATTRIBUTE_NAME);
            },

            clearReplaceDivs: function() {              
                if (core.markAndReplace.extensionSpecificClearReplaceDivs) {
                    core.markAndReplace.extensionSpecificClearReplaceDivs();
                }
                core.markAndReplace.skipElementsFromRenderReplaceDivBecauseItHasBeenRestored = [];

                var elementsToReplace = document.querySelectorAll("[" + core.markAndReplace.REPLACER_ELEMENT_MARKER_ATTRIBUTE_NAME + "='true']");
                for(var i = 0; i < elementsToReplace.length; i++) {
                    var elementToRemove = elementsToReplace[i];
                    core.markAndReplace.removeOneReplaceDiv(elementToRemove);
                }

                //content js runs on every iframe, but we clear it only the main, clearReplaceDivs is called from content js
                if (self==top) {
                    core.ui.utilities.badgeText.resetBadgeText();
                }
            }

            //#endregion replace

            //#endregion private functions
        }
    })();
})();




