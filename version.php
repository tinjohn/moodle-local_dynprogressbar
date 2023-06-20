<?php

/**
 * @package  dynprogressbar
 * @copyright 2023, Tina John <tina.john@th-luebeck.de>
 * @license MIT
 * @doc https://docs.moodle.org/dev/version.php
 */

defined('MOODLE_INTERNAL') || die();

$plugin->component = 'local_dynprogressbar'; // Declare the type and name of this plugin.
$plugin->version = 2023061901; // Plugin released on .
$plugin->requires = 2022041908; // Moodle 4.1 is required.
$plugin->maturity = MATURITY_BETA; // This is considered as ALPHA for production sites.
$plugin->release = 'v0.0.1'; // This is our first.
