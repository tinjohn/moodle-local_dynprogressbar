<?php
// Standard GPL and phpdocs
require_once(__DIR__ . '/../../config.php');

$home = new moodle_url('/');
$natpage = new moodle_url('/local/dynprogressbar');

echo_readme();


/**
  * dynprogressbar.
  *
  */
function echo_readme() {
     global $DB;

     echo "dynprogressbar stellt ein js zur Verfügung, dass die Progressbar z.Bsp. im theme learnR dynamisch macht. Das könnte man auch direkt im Theme machen." ;
}
