import {getActivityCompletion} from './repository';
import {getProgressPercentage} from './repository';
import {getProgressbarInnerHTML} from './repository';
import {getProgressbarInnerHTMLGame} from './repository';
import { init as h5plistener } from './cm_h5p_scored_listener';
import { init as cmtogglelistener } from './cm_man_compl_toggle';



// DO NOT USE
export const addProgressFromCoreData = async() => {
    // uses Core Webservice that is not true for ajax -
    // only usable, if service.php is modified - no option
    const prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    const spanElement = document.querySelector('strong.progress-bar-num');

   const user_id = prbar.getAttribute('userid');
   const course_id = prbar.getAttribute('courseid');

    const response = await getActivityCompletion(user_id, course_id);
    window.console.log("getActivityCompletion----response", response);

    // Check if the data is valid - JSON.parse returns false - so no check available
    if (response && response.statuses && Array.isArray(response.statuses)) {
        let count = 0;
        let countall = 0;

        response.statuses.forEach(status => {
            if (status.state > 0) {
                count++;
            }
            countall++;
        });

        var newwidth = Math.round(count / countall * 100);
        prbar.style.width = newwidth + '%';
        spanElement.innerHTML = newwidth + '%';
    }
};


// Smooth progressbar mod - but only width and innerhtlm values changed
// potentiell important dependencies in tags are not modified
export const changeProgressPercentage = async() => {
    // ...
    const prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    const spanElement = document.querySelector('strong.progress-bar-num');

   //const user_id = prbar.getAttribute('userid');
    const course_id = prbar.getAttribute('courseid');
//    const user_id = prbar.getAttribute('userid');

    const response = await getProgressPercentage(course_id);
    if (response && response.progress) {
        if (response.warnings.length > 0) {
            // The warnings array is not empty
            console.log("Warnings:", response.warnings);
            // Perform further actions based on the warnings
          }
        window.console.log("getProgressPercentage----response", response);
        // Check if the data is valid - JSON.parse returns false - so no check available
        var newwidth = response.progress;
        prbar.style.width = newwidth + '%';
        spanElement.innerHTML = newwidth + '%';
    } else {
        console.log("no completion detected");
    }
};

/**
* USED get course id from body tag
* Add progress whenever context.id module was not completed on inital load.
*/
function getCourseIdFromBody() {
    const bodyTag = document.getElementsByTagName('body')[0];
    const attributeNames = bodyTag.getAttributeNames();
    var courseid;
    attributeNames.forEach(attribute => {
        const attributeValue = bodyTag.getAttribute(attribute);
        const regex = /course-(\d+)/;
        const matches = attributeValue.match(regex);
        if (matches) {
            const courseNumber = matches[0];
            courseid = courseNumber.split('-')[1];
            console.log("Coursenumber------", courseid); // Output: course-64
            return(courseid);
        }
    });
    if(courseid) {
        return(courseid);
    } else {
        return false;
    }
}

// reloads whole progress view - it is not as smooth as just changing width
// on the other hand - the progress bar is correct an unmodified
export const changeProgressbar = async() => {
    // ...
    //const prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    //const course_id = prbar.getAttribute('courseid');
    const course_id = getCourseIdFromBody();
    if(course_id) {
        var response = await getProgressbarInnerHTML(course_id);
        if (response && response.innerHTML) {
            window.console.log("getProgressbarInnerHTML----response", response);
           
            var innerHTML = response.innerHTML;
            const prcourseview = document.getElementsByClassName('progress courseview')[0];
            var elementToReplace = prcourseview;
             // creates additional div but the parent node might have siblings just to be safe
             const newElement = document.createElement('div');
            newElement.innerHTML = innerHTML;
            const parentElement = elementToReplace.parentNode;
            parentElement.replaceChild(newElement, elementToReplace);

        } else {
            console.log("no progressbar update available");
        }
        // GAME 
        var response = await getProgressbarInnerHTMLGame(course_id);
         if (response && response.innerHTML) {
            window.console.log("getProgressbarInnerHTMLGAME----response", response);
             var innerHTML = response.innerHTML;
             const prgame = document.getElementsByClassName('gameTable')[0];
             const elementToReplaceGAME = prgame.parentNode;
             // creates additional div but the parent node might have siblings just to be safe
             const newElementGAME = document.createElement('div');
             newElementGAME.innerHTML = innerHTML;
             const parentElementGAME = elementToReplaceGAME.parentNode;
             parentElementGAME.replaceChild(newElementGAME, elementToReplaceGAME);

         } else {
             console.log("no game update possible");
             window.console.log("getProgressbarInnerHTMLGAME----response", response);

         }

        return true;
    } else {
        console.log("no course id detected");
        return false;
    }
};


var dynprbar_action = changeProgressbar;

export const init = () => {
    var prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    // alert('pr' + pr);
    // nimm doch das bitte
    console.log('prbarneusrc' + prbar);
    if(prbar) {
        console.log('dynprogressbar----load listener');
        h5plistener();
        cmtogglelistener();
    } else {
        console.log('dynprogressbar----no listeners loaded due to missing prbar');
    }
    window.addEventListener('load', function () {
        //var pr = document.getElementsByClassName('progress')[0];
        var prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
       // alert('pr' + pr);
       // nimm doch das bitte
        console.log('prbarneusrc' + prbar);
        // Add an event listener to handle the cmcompleted - send from the own listener to ajax
        document.addEventListener('cmcompleted', function(event) {
            console.log('cmcompleted----Custom event triggered:', event.detail.message);
            // another Option to changeProgressbar or the other 2 Variants of dynprbar_action()
            // implement wait 300 ms - to give some time to the core events dealing with the completion
            setTimeout(dynprbar_action, 300);
            //dynprbar_action();
        });
    });


    // // https://riptutorial.com/javascript/example/20197/listening-to-ajax-events-at-a-global-level
    // // Store a reference to the native method
    // let send = XMLHttpRequest.prototype.send;
    // //const prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    // // console.log(document.getElementsByClassName('progress-bar progress-bar-infos')[0]);

    // // Overwrite the native method
    // XMLHttpRequest.prototype.send = function() {
    //     // this.addEventListener("readystatechange", function () {
    //     //     console.log("readystatechange-----");
    //     // }, false);

    //     // tinjohn get Request Payload from send arguments
    //     console.log("XMLHttpRequest send-----");
    //     var payload = arguments[0];
    //     if(payload === null) {
    //         send.apply(this, arguments);
    //         return;
    //     }
    //     console.log("the payload send-----" + payload);
    //     var isValidJSON = true;
    //     try {
    //         JSON.parse(payload);
    //     } catch {
    //         isValidJSON = false;
    //     }
    //     if(isValidJSON) {
    //         // Assign an event listener
    //         // and remove it again - to prevent double execution
    //         // https://www.mediaevent.de/javascript/remove-event-listener.html
    //         this.addEventListener("load", function removeMe () {
    //             readAJAXrequestsend(payload);
    //             this.removeEventListener("load", removeMe);
    //         }, false);
    //     }
    //     // Call the stored reference to the native method
    //     send.apply(this, arguments);
    // };

    // /**
    //  * Reads payload and calls function addProgress (h5p activities need an outside call)
    //  * or reduces progress bar.
    //  * @param {payload} payload from request.
    //  */
    // function readAJAXrequestsend (payload) {
    //     var isValidJSON = true;
    //     try {
    //         JSON.parse(payload);
    //     } catch {
    //         isValidJSON = false;
    //     }
    //     if(isValidJSON) {
    //         const plo = JSON.parse(payload);
    //         //console.log(plo[0]);
    //         /*
    //         console.log(plo[0].methodname);
    //         console.log(plo[0].args.cmid);
    //         console.log(plo[0].args.completed);
    //         */
    //         // update_activity_completion_status_manually in completion/external.php
    //         if (plo[0].methodname.match("(.*)core_completion_update_activity_completion_status_manually(.*)"))
    //         {
    //             if (plo[0].args.completed) {
    //                 console.log("readAJAXrequestsend-----payload---------" + payload);
    //                 //addProgressFromCoreData();
    //                 //changeProgressPercentage();
    //                 dynprbar_action();
    //             } else {
    //                 var prbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    //                 //addProgressFromCoreData();
    //                 //changeProgressPercentage();
    //                 dynprbar_action();
    //                 var newwidth = parseInt(prbar.style.width) - parseInt(prbar.getAttribute('progress-steps'));
    //                 if((parseInt(prbar.style.width) - parseInt(prbar.getAttribute('progress-steps'))) < 0) {
    //                     var newwidth = 0;
    //                 }
    //                 console.log(newwidth);
    //                 //prbar.style.width = newwidth + '%';
    //             }
    //         }
    //         // not possible to hook into XMLHttpRequest for core_xapi_statement_post anymore
    //         // since moodle > 4.1
    //         if (plo[0].methodname.match("(.*)core_xapi_statement_post(.*)"))
    //         {
    //             isValidJSON = true;
    //             try {JSON.parse(plo[0].args.requestjson);} catch {isValidJSON = false;}
    //             if(isValidJSON) {
    //                 const xapiReq = JSON.parse(plo[0].args.requestjson);
    //                 //console.log(xapiReq);
    //                 if (xapiReq[0].result.completion && xapiReq[0].result.success)
    //                 {
    //                     // check if initially successed already - in completemods thus send the context id
    //                     var contextid = xapiReq[0].object.id;
    //                     var sender = xapiReq[0].actor.account.homepage;
    //                     // it is an iframe - hook is in the iframe call addProgress to window.parent
    //                     window.parent.postMessage({method : "dynprbar_action", contextid : contextid}, sender);
    //                 }
    //             }
    //         }
    //         payload = '';
    //     }
    // }

    /**
     * NOT USED
     * USED for manual completion so far
     * Add progress whenever context.id module was not completed on inital load.
     * @param {contextid} contextid the object.id from request.
     */
    // function addProgress (contextid) {
    //     const iframeprbar = document.getElementsByClassName('progress-bar progress-bar-info')[0];
    //     if(iframeprbar === null) {
    //         return;
    //     }
    //     if(contextid !== null) {
    //         const completedmods = iframeprbar.getAttribute('completedmods');
    //         if(completedmods.match('(.*)' + contextid + '(.*)')) {
    //             //console.log(contextid + " war schon fertig");
    //             return;
    //         }
    //     }
    //     console.log("adde progress ---");
    //     iframeprbar.style.width = (parseInt(iframeprbar.style.width)
    //                + parseInt(iframeprbar.getAttribute('progress-steps'))) + '%';
    // }

    /**
     * USED for manual completion so far
     * Add progress whenever context.id module was not completed on inital load.
     *.
     */
       //function addProgressXHR () {
        // console.log("---addProgressXHR-------adde progress ---");
        // var xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = () => {
        //   if (xhr.readyState == 4) {
        //     if (xhr.status == 200) {
        //       console.log(xhr.responseText);
        //     }
        //   }
        // };
        //var url = '../theme/learnr/addProgress.php';
        //xhr.open("POST",url);
        //xhr.send();
        //}



//       // Listen to H5P iframe message to get H%P completion statements
//       window.addEventListener('message', function(e) {
//         console.log('---got mail from iframe---', e.data);
// /*         if(e.data.method == 'addProgress') {
//             const [, contextid] = e.data.contextid.split(/\/(?=[^\/]+$)/);
//             addProgress(contextid);
//         }
//  */
//         // H5PembedIncore_send_core_xapi_statement_post is added to embed.js in core
//         // no better way found until now
//         if(e.data.context == 'h5p' && e.data.action == "H5PembedIncore_send_core_xapi_statement_post") {
//             console.log("H5PembedIncore_send_core_xapi_statement_post---received->--addProgressFromCoreData---------");
//             //dynprbar_action();
//         }
//       });

//         // FOLLOWING  WORKING BUT TO early in the event lists - setTimeout is a workaround
//         // iframe is loaded and all namesspaces are load
//         document.onreadystatechange = () => {
//           if (document.readyState === "complete") {
//             if(window && window.document && window.document.h5player
//                  && window.document.h5player.H5P  && window.document.h5player.H5P.externalDispatcher) {
//                 var h5pextlDispatcher = window.document.h5player.H5P.externalDispatcher;
//                 window.document.h5player.H5P.externalDispatcher.on('xAPI', function (event) {
//                     if(event && event.data && event.data.statement && event.data.statement.result) {
//                         if(event.data.statement.result.score && event.data.statement.result.score.scaled) {
//                             console.log('--externalDispatcher-single-',event.data.statement.result);
//                              var cmcompletedEvent = new CustomEvent('cmcompleted',
//                             { detail: { message: 'a course module completed or scored' } });
//                             // // Trigger the custom event
//                              document.dispatchEvent(cmcompletedEvent);
//                         }
//                     }
//                 }
//                 );
//             } else {
//               // Access the h5pplayer within each window
//               for (var i = 0; i < window.length; i++) {
//                   var currentWindow = window[i];
//                   h5pextlDispatcher = currentWindow.H5P.externalDispatcher;
//                   if (h5pextlDispatcher) {
//                       // Perform actions on the h5pplayer element
//                       console.log(h5pextlDispatcher);

//                       //works but each
//                       //currentWindow.H5P.externalDispatcher.off('xAPI', handleXAPIEvent);
//                       currentWindow.H5P.externalDispatcher.on('xAPI',
//                       function (event) {
//                         if(event && event.data && event.data.statement && event.data.statement.result) {
//                             if(event.data.statement.result.score && event.data.statement.result.score.scaled) {
//                                 console.log('--externalDispatcher----handle-',event.data.statement.result);
//                                 var cmcompletedEvent = new CustomEvent('cmcompleted',
//                                  { detail: { message: 'a course module completed or scored' } });
//                                 // // Trigger the custom event
//                                  document.dispatchEvent(cmcompletedEvent);
//                             }
//                         }
//                       }
//                       );
//                   } else {
//                       console.log('h5pplayerElement not found', window.length);
//                   }
//               }
//             }
//           }
//         };



//    this.addEventListener("load", function removeMe () {
        //             readAJAXrequestsend(payload);
        //             this.removeEventListener("load", removeMe);
        //         }, false);

    /**
     * USED for manual completion so far
     * Add progress whenever context.id module was not completed on inital load.
     * @param {dispatcher} dispatcher the object.id from request.
     */
    // function addH5PextDispatcherListener (dispatcher) {
    //     console.log("in addH5PextDispatcherListener ------");
    //     dispatcher.on('xAPI', function(event) {
    //                 if (event.data.statement.result !== undefined) {
    //                     var statement = event.data.statement;
    //                     var success = event.data.statement.result.success;
    //                     // Your custom code here
    //                     if(success) {
    //                         console.log('dynprg externalDispatcher xAPI statement is being sent - success', statement);
    //                         dynprbar_action();
    //                         window.parent.postMessage({method : "dynprbar_action", contextid : 1}, '');
    //                     }
    //                 } else {
    //                     var statement = event.data.statement;
    //                     console.log('dynprg externalDispatcher xAPI statement is being sent - not usefull', statement);
    //                     dynprbar_action();
    //                     window.parent.postMessage({method : "dynprbar_action", contextid : 1}, '');
    //                 }
    //     });
    // }


};











