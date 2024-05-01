(function() {
    "use strict";

    core.utilities.errorHandler = core.utilities.errorHandler || (function() {

        return {

            //#region properties and consts

            //#endregion

            //#region init
            init: function() {
                window.addEventListener("error", function (event) {
                    core.utilities.errorHandler.handleError(event);
                });
            },

            //#endregion

            //#region public functions

            handleError: function(errorObject, specialErrorHandler) {
                try {
                    var errorMessage;
                    var specialErrorHandlerResult;

                    if(specialErrorHandler) {
                        specialErrorHandlerResult = specialErrorHandler(errorObject);
                        if (specialErrorHandlerResult.isHandled) {
                            return;
                        } else {
                            errorMessage = specialErrorHandlerResult.errorMessage
                        }
                    }

                    if (!errorMessage) {
                        var errorObjectIsRequestRejection = errorObject.config && errorObject.config.url && errorObject.status;

                        var errorObjectIsFirefoxJsLoadingError = (navigator.userAgent.search('Firefox') != -1) && errorObject.target && errorObject.target.outerHTML &&  errorObject.target.outerHTML.startsWith("<script");

                        //ff sometimes throw an error on google analitics.js and add to any page.js, we skip this error
                        if (errorObjectIsFirefoxJsLoadingError) {
                            return;
                        } else if (errorObjectIsRequestRejection) {
                            errorMessage = core.utilities.errorHandler.getErrorMessageFromHttpRequestRejection(errorObject);
                        } else if (errorObject instanceof ErrorEvent) {
                            errorMessage = "Message: " + errorObject.message +
                                "\nError: " + errorObject.error +
                                "\nFilename: " + errorObject.filename +
                                "\nLine number: " + errorObject.lineno +
                                "\nColumn number: " + errorObject.colno;
                        } else if (errorObject instanceof Error) {
                            errorMessage = "Message: " + errorObject.message;
                        } else if (errorObject instanceof Object && errorObject.message) {
                            errorMessage = "Message: " + errorObject.message;
                        } else if (typeof errorObject === "string") {
                            errorMessage = "Message: " + errorObject;
                        } else {
                            errorMessage = "Developer error - Undefined error message - ErrorObject has not handled: " + JSON.stringify(errorObject);
                        }

                        if (errorObject.target && errorObject.target.location && errorObject.target.location.href) {
                            errorMessage += "\nerrorObject.target.location.href: " + errorObject.target.location.href;
                        }

                        errorMessage += "\nCallstack: " + core.utilities.errorHandler.getCallStack();
                    }

                    if (core.utilities.settings.isDebug) {
                        alert(errorMessage);
                    }

                    //errorhandler attached to window error, this if prevents spam the console log with errors come from the site itself
                    if (!errorObject.target) {
                        console.error(errorObject);
                        console.error(errorMessage);
                    }
                } catch (ex) {
                    if (core.utilities.settings.isDebug) {
                        alert("Error during errorhandling: " + ex);
                    }
                    console.error(ex);
                }
            },

            //#endregion

            //#region private functions

            getErrorMessageFromHttpRequestRejection: function(httpRequestRejection) {
                if (httpRequestRejection.data && (typeof httpRequestRejection.data) === "string" && httpRequestRejection.data.startsWith("<!DOCTYPE html>")) {
                    return "Message: " + httpRequestRejection.data;
                } else {
                    var dataString = core.utilities.errorHandler.getErrorStringFromObject(httpRequestRejection.data);
                    var modelStateString = "";
                    if (httpRequestRejection.data && httpRequestRejection.data.modelState) {
                        var errorObjects = core.ui.utilities.ui.getErrorObjectsFromRejectionModelState(httpRequestRejection);
                        for(var i = 0; i< errorObjects.length; i++) {
                            var error = errorObjects[i];
                            modelStateString += "key: " + error.errorName + ": value: " + error.errorText + "\n";
                        }
                    }

                    var configString = core.utilities.errorHandler.getErrorStringFromObject(httpRequestRejection.config, ["paramSerializer", "transformRequest", "transformResponse"]);
                    var configObject = httpRequestRejection.config ? httpRequestRejection.config.data : null;
                    var configDataString = "";
                    if (configObject) {
                        //Note: NEVER LOG ANY PASSWORD!!!
                        configDataString = core.utilities.errorHandler.getErrorStringFromObject(configObject, ["password", "confirmPassword"]);
                    }

                    var errorMessage = "\nHttpRequestRejection Error" +
                        "\ncomment: " + httpRequestRejection.comment +
                        "\ndata: " + dataString +
                        "\nmodelState: " + modelStateString +
                        "\nconfig: " + configString +
                        "\nconfig.data: " + configDataString +
                        "\nstatus: " + httpRequestRejection.status +
                        "\nstatusText: " + httpRequestRejection.statusText;
                    return errorMessage;
                }
            },

            getErrorStringFromObject: function(obj, propertyNamesToSkip) {
                var res = "";
                if (obj) {
                    res = "\n";
                    var propertyName;
                    for (propertyName in obj) {
                        if (obj.hasOwnProperty(propertyName)) {
                            var line = propertyName + ": " + obj[propertyName] + "\n";
                            if (propertyNamesToSkip) {
                                if (!propertyNamesToSkip.contains(propertyName)) {
                                    res += line;
                                }
                            } else {
                                res += line;
                            }
                        }
                    }
                }
                return res;
            },

            getCallStack: function() {
                var callstack = [];
                try {
                    i.dont.exist += 0; //NOTE: doesn't exist- that's the point
                } catch (e) {
                    if (e.stack) {
                        var lines = e.stack.split("\n");
                        //NOTE: start from 3 because
                        //NOTE: 1 for errormessage itself
                        //NOTE: 1 for printStackTrace function
                        //NOTE: 1 for handleError function
                        for (var i = 3, len = lines.length; i < len; i++) {
                            callstack.push(lines[i].trim());
                        }
                    }
                }
                return callstack.join("\n");
            }
            //#endregion 
        }
    })();
})();

(function() {
    "use strict";

    core.utilities.errorHandler.init();
})();