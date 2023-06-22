
<?php
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
 * Library of functions and constants for module feedback
 * includes the main-part of feedback-functions
 *
 * @package mod_feedback
 * @copyright Andreas Grabs
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();


function local_dynprogressbar_navigationlinks(moodle_page $page, context $context) {
    
}

//\local_dynprogressbar\dynprogressbar::addlistener();
//\local_dynprogressbar\renderer::addlistener();

function local_dynprogressbar_extend_settings_navigation($settingsnav, $context) {
    global $PAGE;
        $PAGE->requires->js_call_amd('local_dynprogressbar/dynprbar', 'init');
}