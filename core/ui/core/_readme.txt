//TODO LATER: create all the readme-s


This module contains the core UI js/css/font/images files

Initialize in html:

    <!-- ui/core css START -->
    <link rel="stylesheet" href="../core/ui/core/bootstrap/bootstrap.css" />
    <link rel="stylesheet" href="../core/ui/core/bootstrap-social/bootstrap-social.css" />
    <link rel="stylesheet" href="../core/ui/core/font-awesome/css/font-awesome.css" />
    <link rel="stylesheet" href="../core/ui/core/common.css" />
    <link rel="stylesheet" href="../core/ui/core/sprite.css" />

    <!-- ui/core js START -->
    <script src="../core/ui/core/jquery/jquery-3.2.1.js"></script>
    <script src="../core/ui/core/bootstrap/bootstrap.js"></script>
    <script src="../core/ui/core/extend.jquery.js"></script>


Initialize in manifest content scripts:
(bootstrap.js probably not required in the content, or background)

    /* ui/core js START */
    "core/ui/core/jquery/jquery-3.2.1.js",
    "core/ui/core/bootstrap/bootstrap.js"
    "core/ui/core/extend.jquery.js",

