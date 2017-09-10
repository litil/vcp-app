<!-- resources/views/index.php
Based on https://scotch.io/tutorials/token-based-authentication-for-angularjs-and-laravel-apps -->
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>VCP - Vendredi c'est permis</title>

        <!-- Firefox, Chrome, Safari, IE 11+ and Opera. 196x196 pixels in size. -->
        <link rel="icon" href="favicon.png">

        <!-- Facebook specific metadata -->
        <meta property="og:url" content="http://radiovcp.com/" />
        <meta property="og:title" content="VCP - Vendredi c'est permis" />
        <meta property="og:description" content="VCP vous fournit à tout moment de la semaine et de la journée un flux musical de qualité, sans pub et régulièrement mis à jour. Consistant en un simple Play/Stop, la musique de vos brunchs, déjeuners, apéros, dîners, dates,... est améliorée. L’outil parfait quand vous êtes en panne d’inspiration musicale. Branchez vous sur VCP, la solution est toute trouvée." />
        <meta property="og:image" content="vcp_metadata.img" />

        <!-- bootstrap and bootstrap-ui style -->
        <link rel="stylesheet" href="assets/node_modules/bootstrap/dist/css/bootstrap.css">
        <link rel="stylesheet" href="assets/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css">

        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <link rel="stylesheet" href="assets/css/ie10-viewport-bug-workaround.css">

        <!-- Custom styles for this template -->
        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

        <!-- Font Awesome -->
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

        <!-- CSS built with LESS -->
        <link rel="stylesheet/less" type="text/css" href="assets/css/cover.less.css" />
        <script type="text/javascript" src="assets/js/less.js"></script>

        <!-- Angular Notifications -->
        <link rel="stylesheet" href="assets/node_modules/angular-ui-notification/dist/angular-ui-notification.min.css">
    </head>


    <body ng-app="vcpProject" route-css-classnames>
      <div ng-include src="'app/components/core/header/headerView.html'"></div>
          <sound-manager></sound-manager>
          <div ui-view></div>
        <div ng-include src="'app/components/core/footer/footerView.html'"></div>
    </body>


    <!-- Application Dependencies -->
    <script src="assets/node_modules/angular/angular.js"></script>
    <script src="assets/node_modules/angular-ui-notification/dist/angular-ui-notification.min.js"></script>
    <script src="assets/node_modules/angular-ui-router/build/angular-ui-router.js"></script>
    <script src="assets/node_modules/satellizer/satellizer.js"></script>
    <script src="assets/node_modules/angular-soundmanager2.js"></script>
    <script src="assets/node_modules/angular-socialshare.min.js"></script>
    <script src="assets/node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

    <!-- Application Scripts - Controllers -->
    <script src="app/app.js"></script>
    <script src="app/components/auth/authController.js"></script>
    <script src="app/components/ticket/ticketController.js"></script>
    <script src="app/components/extras/extrasController.js"></script>
    <script src="app/components/about/aboutController.js"></script>
    <script src="app/components/user/userController.js"></script>
    <script src="app/components/core/header/headerController.js"></script>
    <script src="app/shared/modal/BackToLiveModalController.js"></script>

        <!-- Application Scripts - Directives -->
    <script src="app/shared/routeCssClassnames.js"></script>

    <!-- Application Scripts - Constants -->
    <script src="app/shared/playlist/constants.js"></script>
    <script src="app/shared/schedule/constants.js"></script>

    <!-- Application Scripts - Services -->
    <script src="app/components/player/playerService.js"></script>
    <script src="app/shared/playlist/playlistService.js"></script>

</html>
