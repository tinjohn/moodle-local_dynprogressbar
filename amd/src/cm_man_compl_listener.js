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
 * Theme LearnR - JS code listener
 *
 * @module     local_dynprogressbar/cm_man_compl_listener
 * @copyright  2023 Tina John <tina.john@th-luebeck.de>
 * @copyright  Institut fuer interaktive Systeme der TH Lübeck
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const init = () => {
  /**
   * Initialising.
   */

    // https://riptutorial.com/javascript/example/20197/listening-to-ajax-events-at-a-global-level
    // Store a reference to the native method
    let send = XMLHttpRequest.prototype.send;

    // Overwrite the native method
    XMLHttpRequest.prototype.send = function() {
        //get Request Payload from send arguments
        console.log("dynprogressbar---XMLHttpRequest send-----");
        var payload = arguments[0];
        if(payload === null) {
            send.apply(this, arguments);
            return;
        }
        console.log("dynprogressbar---the payload send-----" + payload);
        var isValidJSON = true;
        try {
            JSON.parse(payload);
        } catch {
            isValidJSON = false;
        }
        if(isValidJSON) {
            // Assign an event listener
            // and remove it again - to prevent double execution
            // https://www.mediaevent.de/javascript/remove-event-listener.html
            this.addEventListener("load", function removeMe () {
                readAJAXrequestsend(payload);
                this.removeEventListener("load", removeMe);
            }, false);
        }
        // Call the stored reference to the native method
        send.apply(this, arguments);
    };

    /**
     * Reads payload and calls function addProgress (h5p activities need an outside call)
     * or reduces progress bar.
     * @param {payload} payload from request.
     */
    function readAJAXrequestsend (payload) {

            const plo = JSON.parse(payload);
            /*
            console.log(plo[0].methodname);
            console.log(plo[0].args.cmid);
            console.log(plo[0].args.completed);
            */
            //--> update_activity_completion_status_manually in completion/external.php
            if (plo[0].methodname.match("(.*)core_completion_update_activity_completion_status_manually(.*)")) {
              console.log("got XHR Data for core_completion_update_activity_completion_status_manually", plo[0].methodname);
              // Create a custom event
               var cmcompletedEvent = new CustomEvent('cmcompleted',
                 { detail: { message: 'core_completion_update_activity_completion_status_manually' } });
               // Trigger the custom event
               document.dispatchEvent(cmcompletedEvent);
            }
            payload = '';
    }
};
