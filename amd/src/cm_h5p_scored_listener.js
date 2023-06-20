// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Theme LearnR - JS code cm_h5p_scored_listener
 *
 * @module     local_dynprogressbar/cm_h5p_scored_listener
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @copyright  Institut fuer interaktive Systeme der TH Lübeck
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */



export const init = () => {


  /**
  * USED for handleXAPIEvent
  * Add progress whenever context.id module was not completed on inital load.
  * @param {event} event from Dispatcher.
  */
  const handleXAPIEvent = function (event) {
    if(event && event.data && event.data.statement && event.data.statement.result) {
          if(event.data.statement.result.score && event.data.statement.result.score.scaled) {
              console.log('--externalDispatcher-handleXAPIEvent-',event.data.statement.result);
              // Trigger the custom event
              var cmcompletedEvent = new CustomEvent('cmcompleted',
              { detail: { message: 'a course module completed or scored' } });
              // // Trigger the custom event
              document.dispatchEvent(cmcompletedEvent);
          }
      }
  };



//      Listen to H5P iframe message to get H5P completion statements
      window.addEventListener('message', function(e) {
        console.log('---got mail from iframe---', e.data);
/*         if(e.data.method == 'addProgress') {
            const [, contextid] = e.data.contextid.split(/\/(?=[^\/]+$)/);
            addProgress(contextid);
        }
 */

        // iframe is loaded and all namesspaces are load
        if(e.data && e.data.context) {
          if(e.data.context == "h5p" && e.data.action == "hello") {
            addsh5pdispatcherlistener();
          }
        }

        // H5PembedIncore_send_core_xapi_statement_post is added to embed.js in core
        // no better way found until now
        if(e.data.context == 'h5p' && e.data.action == "H5PembedIncore_send_core_xapi_statement_post") {
            console.log("H5PembedIncore_send_core_xapi_statement_post---received->--addProgressFromCoreData---------");
            //dynprbar_action();
        }
      });

   /**
   * addsh5pdispatcherlistener
   * Add progress whenever context.id module was not completed on inital load.
   */
    function addsh5pdispatcherlistener () {
      //for single H5P in a course if the document.onreadystatechange version is preferred
      // if(window.document.h5player
      //   && window.document.h5player.H5P && window.document.h5player.H5P.externalDispatcher) {
      //   console.log('--externalDispatcher-single-gefunden-1-');
      //   // delete all listeners from H5P.externalDispatcher to get rid of double executions
      //   // without function due to error with given function as argument
      //   window.document.h5player.H5P.externalDispatcher.off('xAPI');
      //   window.document.h5player.H5P.externalDispatcher.on('xAPI', handleXAPIEvent);
      // }


      // FOLLOWING  WORKING BUT TO early in the event lists - setTimeout is a workaround
        // document.onreadystatechange: iframe is loaded and all namesspaces are loaded
        // DOES NOT work for single H5P in a course, thus allow multiple listeners to be removed again

        // document.onreadystatechange = () => {
        //   if (document.readyState === "complete") {
            // the single H5P
            if(window.document.h5player
                 && window.document.h5player.H5P && window.document.h5player.H5P.externalDispatcher) {
                  console.log('dynprogressbar--externalDispatcher-single-gefunden-aka_docready-');

                  var h5pextlDispatcher = window.document.h5player.H5P.externalDispatcher;
                    // delete all listeners from H5P.externalDispatcher to get rid of double executions
                    // without function due to error with given function as argument
                    window.document.h5player.H5P.externalDispatcher.off('xAPI');
                    window.document.h5player.H5P.externalDispatcher.on('xAPI', function (event) {
                    if(event && event.data && event.data.statement && event.data.statement.result) {
                        if(event.data.statement.result.score && event.data.statement.result.score.scaled) {
                            console.log('dynprogressbar--externalDispatcher-single-',event.data.statement.result);

                             var cmcompletedEvent = new CustomEvent('cmcompleted',
                            { detail: { message: 'a course module completed or scored' } });
                            // // Trigger the custom event
                             document.dispatchEvent(cmcompletedEvent);
                        }
                    }
                });

            } else {
              // Access the h5pplayer within each window
              for (var i = 0; i < window.length; i++) {
                  var currentWindow = window[i];
                  h5pextlDispatcher = currentWindow.H5P.externalDispatcher;
                  if (h5pextlDispatcher) {
                      // Perform actions on the h5pplayer element
                      console.log("dynprogressbar---found h5p in window ---", h5pextlDispatcher);
                      // delete all listeners from H5P.externalDispatcher to get rid of double executions
                      // without function due to error with given function as argument
                      // tried a lot to make it work with function - no success
                      currentWindow.H5P.externalDispatcher.off('xAPI');
                      currentWindow.H5P.externalDispatcher.on('xAPI',handleXAPIEvent);
                      // works fine but codes to messy
                      // currentWindow.H5P.externalDispatcher.on('xAPI',
                      // function (event) {
                      //   if(event && event.data && event.data.statement && event.data.statement.result) {
                      //       if(event.data.statement.result.score && event.data.statement.result.score.scaled) {
                      //           console.log('--externalDispatcher----handle-',event.data.statement.result);
                      //           var cmcompletedEvent = new CustomEvent('cmcompleted',
                      //            { detail: { message: 'a course module completed or scored' } });
                      //           // // Trigger the custom event
                      //            document.dispatchEvent(cmcompletedEvent);
                      //       }
                      //   }
                      // }
                      // );
                  } else {
                      console.log('dynprogressbar--h5playerElement not found');
                  }
              }
            }
//          }
//        };
      }

};
