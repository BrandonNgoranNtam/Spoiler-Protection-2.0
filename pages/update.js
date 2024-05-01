(function() {
    "use strict";

    app.update = app.update || (function() {

        return {

            //#region properties and consts

            //#endregion

            //#region init

            init: function() {
                core.utilities.settings.checkAllModulesDefaultValuesIsInitialized(function () {
                    core.ui.utilities.ui.dispatchOnInitUIEvent();
                });

                //a small fix to make the sharing work on the update page
                setTimeout(() => {
                    $(".jssocials-share-twitter i").removeClass("fa fa-twitter").addClass("fab fa-twitter");
                    $(".jssocials-share-facebook i").removeClass("fa fa-facebook").addClass("fab fa-facebook");
                    $(".jssocials-share-linkedin i").removeClass("fa fa-linkedin").addClass("fab fa-linkedin");
                    $(".jssocials-share-pinterest i").removeClass("fa fa-pinterest").addClass("fab fa-pinterest");
                }, 1000);

            }

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();
})();


$(document).ready(function () {
    app.update.init();
    core.utilities.googleAnalitics.trackPage("update.html", core.utilities.settings.extensionName + " - Update page");


    //2.5.0 start
    var redditContext = app.ui.modules.spoilerContextsLogic.getEmptySpoilerContext();
    redditContext.name = "Reddit";
    redditContext.siteUrlPart = "reddit";
    redditContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker("", "scrollerItem", "");


    var redditExists = false;
    for(i = 0; i < core.utilities.settings.spoilerContexts.spoilerContextList.length; i++) {
        if (core.utilities.settings.spoilerContexts.spoilerContextList[i].siteUrlPart == "reddit") {
            redditExists = true;
        }
    }

    if (!redditExists) {
        core.utilities.settings.spoilerContexts.spoilerContextList.push(redditContext);
       /* core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.removeSelectors = "";
        if (core.utilities.settings.spoilerContexts.spoilerContextList[i].siteUrlPart == "youtube") {
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.nodeNames = "ytd-channel-renderer,ytd-grid-playlist-renderer,ytd-expander,ytd-grid-video-renderer,ytd-compact-video-renderer,ytd-video-renderer,ytd-radio-renderer,ytd-compact-radio-renderer,ytd-playlist-panel-video-renderer,ytd-rich-metadata-renderer,ytd-grid-radio-renderer,ytd-movie-renderer,ytd-movie-offer-module-renderer";
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.removeSelectors = ".ytp-ce-element,.ytp-ce-expanding-overlay,.ytp-ce-element-shadow,.ytp-endscreen-content";
        } */
        core.utilities.settings.spoilers.isImagesVisible = true;

        core.utilities.settings.updateSettingsInStorage();
    }
    //2.5.0 end

    //2.6.0 start
    for(i = 0; i < core.utilities.settings.spoilerContexts.spoilerContextList.length; i++) {
        if (core.utilities.settings.spoilerContexts.spoilerContextList[i].siteUrlPart == "youtube") {
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.nodeNames = "ytd-channel-renderer,ytd-grid-playlist-renderer,ytd-expander,ytd-grid-video-renderer,ytd-compact-video-renderer,ytd-video-renderer,ytd-radio-renderer,ytd-compact-radio-renderer,ytd-playlist-panel-video-renderer,ytd-rich-metadata-renderer,ytd-grid-radio-renderer,ytd-movie-renderer,ytd-movie-offer-module-renderer";
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.classes = "video-list-item,yt-lockup-video,iv-card,ytd-comment-renderer,ytp-suggestions";
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.jQuerySelectorClasses = core.ui.modules.elementMarkerLogic.getJQueryFormattedClasses("video-list-item,yt-lockup-video,iv-card,ytd-comment-renderer,ytp-suggestions");
        }
        if (core.utilities.settings.spoilerContexts.spoilerContextList[i].siteUrlPart == "facebook") {
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.classes = "_3ccb,_5pcr,_5nz1,fbFeedTickerBorder,_6rp0,_401d";
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.jQuerySelectorClasses = core.ui.modules.elementMarkerLogic.getJQueryFormattedClasses("_3ccb,_5pcr,_5nz1,fbFeedTickerBorder,_6rp0,_401d");
        }
    }
    //2.6.0 end

    //2.6.5 start
    for(i = 0; i < core.utilities.settings.spoilerContexts.spoilerContextList.length; i++) {
        if (core.utilities.settings.spoilerContexts.spoilerContextList[i].siteUrlPart == "youtube") {
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.removeSelectors = ".ytp-ce-element,.ytp-ce-expanding-overlay,.ytp-ce-element-shadow,.ytp-endscreen-content"
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.nodeNames = "ytd-rich-item-renderer,ytd-channel-renderer,ytd-grid-playlist-renderer,ytd-expander,ytd-grid-video-renderer,ytd-compact-video-renderer,ytd-video-renderer,ytd-radio-renderer,ytd-compact-radio-renderer,ytd-playlist-panel-video-renderer,ytd-rich-metadata-renderer,ytd-grid-radio-renderer,ytd-movie-renderer,ytd-movie-offer-module-renderer,ytd-grid-movie-renderer,ytd-playlist-renderer,ytd-watch-card-compact-video-renderer";
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.classes = "video-list-item,yt-lockup-video,iv-card,ytd-comment-renderer,ytp-suggestions";
            core.utilities.settings.spoilerContexts.spoilerContextList[i].elementMarker.jQuerySelectorClasses = core.ui.modules.elementMarkerLogic.getJQueryFormattedClasses("video-list-item,yt-lockup-video,iv-card,ytd-comment-renderer,ytp-suggestions");
        }
    }
    //2.6.5 end





});
