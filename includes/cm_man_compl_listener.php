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
 * Theme LearnR - scrollspy include.
 *
 * @package   local_dynprogressbar
 * @copyright 2023 Josha Bartsch <bartsch@itc.rwth-aachen.de>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$showprogressbar = get_config('local_dynprogressbar', 'showprogressbar');

// Add scroll-spy AMD module if the feature is enabled.
//if ($showprogressbar == local_dynprogressbar_SETTING_SELECT_YES) {
    $PAGE->requires->js_call_amd('local_dynprogressbar/cm_man_compl_listener', 'init');
//}
