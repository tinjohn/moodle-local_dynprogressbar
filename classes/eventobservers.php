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
 * local dynbarprogressbar - Event observers.
 *
 * @package    local_dynprogressbar
 * @copyright  2022 Alexander Bias, lern.link GmbH <alexander.bias@lernlink.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace local_dynbarprogressbar;

/**
 * Observer class containing methods monitoring various events.
 *
 * @package    local_dynbarprogressbar
 * @copyright  2022 Alexander Bias, lern.link GmbH <alexander.bias@lernlink.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class eventobservers {

    /**
     * Course module completion configures progressbar.
     *
     * @param \core\event\course_module_completion_updated $event The event.
     */
    public static function course_module_completion_updated(\core\event\course_module_completion_updated $event) {
        // ADDED tinjohn - rebuild progressbar - not used so far - instead js event calls web service

    }

}
