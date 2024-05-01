(function () {
    "use strict";

    core.utilities.googleAnalitics = core.utilities.googleAnalitics || (function () {

        return {

            //#region properties and consts

            //#endregion

            //#region init

            //#endregion

            //#region public functions

            /*
            *
            * FOR THE CODEREVIEW
            * ONE OF THE REASON WHY THIS EXTENSION IS BANNED IS THE LACK OF GOOGLE ANALITICS OPT-IN.
            * WE DECIDED TO REMOVE THE GOOGLE ANALITICS, UNTIL WE CREATE A DECENT PRIVACY POLICY AND OPT-IN PAGE
            * WE DIDN'T REMOVED THE CALLS FROM THE SOURCE, BUT WE REMOVED THE REQUESTS TOWARDS THE GOOGLE ANALITICS PAGE. I HOPE THIS WILL BE ENOUGH TO PASS THE CODEREVIEW
            *
            * */

            // BY https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
            trackEvent: function(eventCategory, eventAction) {
              /*  var message =
                    "v=1" +
                    "&tid=" + core.utilities.settings.googleAnaliticsTrackerId +
                    "&cid=555" +
                    "&t=event" +
                    "&ec=" + encodeURIComponent(document.getHTMLPageName() + "_" + eventCategory) +
                    "&ea=" + encodeURIComponent(eventAction);


                var request = new XMLHttpRequest();
                request.open("POST", "https://www.google-analytics.com/collect", true);
                request.send(message);*/
            },

            trackPage: function(pageName, pageTitle) {
               /* var message =
                    "v=1" +
                    "&tid=" + core.utilities.settings.googleAnaliticsTrackerId +
                    "&cid=555" +
                    "&t=pageview" +
                    "&dh=" + encodeURIComponent(core.utilities.settings.extensionName) +
                    "&dp=" + encodeURIComponent(pageName) +
                    "&dt=" + encodeURIComponent(pageTitle);


                var request = new XMLHttpRequest();
                request.open("POST", "https://www.google-analytics.com/collect", true);
                request.send(message);*/
            },

            trackBootstrapToggleEvent: function(event, eventCategory) {
                /*var onOff = $(event.target).is(":checked") ? "On" : "Off";
                core.utilities.googleAnalitics.trackEvent(eventCategory, "Clicked: " + onOff);*/
            }

            //#endregion

            //#region private functions

            //#endregion
        }

    })();

})();

