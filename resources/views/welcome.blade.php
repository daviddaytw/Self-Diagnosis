<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="Self-Diagnosis, a chatbot to help you diagnose yourself.">
        <meta name="author" content="David Day">

        <title>Self-Diagnosis</title>

        <!-- Google Font -->
        <link href="https://fonts.googleapis.com/css?family=Maven+Pro:400,500,700|Nunito:400,600,700" rel="stylesheet">

        <!-- FontAwesome JS-->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/js/all.min.js" integrity="sha512-rpLlll167T5LJHwp0waJCh3ZRf7pO6IT1+LZOhAyP6phAirwchClbTZV3iqL3BMrVxIYRbzGTpli4rfxsCK6Vw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

        @vite(['resources/scss/app.scss', 'resources/js/app.js'])
    </head>

    <body>
        <header class="header">

            <div class="branding">

                <div class="container position-relative">

                    <nav class="navbar navbar-expand-lg">
                        <h1 class="site-logo"><a class="navbar-brand" href="/">
                                <!-- <img class="logo-icon" src="assets/images/logo-icon.svg" alt="logo"> --> <span class="logo-text">Self-Diagnosis</span>
                            </a></h1>

                        <!-- // Free Version ONLY -->
                        <ul class="social-list list-inline mb-0 position-absolute">
                            <!-- <li class="list-inline-item"><a class="text-dark" href="#"><i class="fab fa-twitter fa-fw"></i></a></li> -->
                            <li class="list-inline-item"><a class="text-dark" href="https://www.facebook.com/SelfDiagnose"><i class="fab fa-facebook-f fa-fw"></i></a></li>
                            <!-- <li class="list-inline-item"><a class="text-dark" href="#"><i class="fab fa-instagram fa-fw"></i></a></li> -->
                        </ul>
                        <!--//social-list-->

                    </nav>

                    <ul class="social-list list-inline mb-0 position-absolute d-none">
                        <!-- <li class="list-inline-item"><a class="text-dark" href="#"><i class="fab fa-twitter fa-fw"></i></a></li> -->
                        <li class="list-inline-item"><a class="text-dark" href="https://www.facebook.com/SelfDiagnose"><i class="fab fa-facebook-f fa-fw"></i></a></li>
                        <!-- <li class="list-inline-item"><a class="text-dark" href="#"><i class="fab fa-instagram fa-fw"></i></a></li> -->
                        <!-- <li class="list-inline-item"><a class="text-dark" href="#"><i class="fab fa-youtube fa-fw"></i></a></li> -->
                    </ul>
                    <!--//social-list-->
                </div>
                <!--//container-->
            </div>
            <!--//branding-->
        </header>
        <!--//header-->


        <section class="hero-section">
            <div class="container">
                <div class="row figure-holder">
                    <div class="col-12 col-md-6 pt-3 pt-md-4">
                        <h2 class="site-headline font-weight-bold mt-lg-5 pt-lg-5">The best way to understand your symptoms before seeing a doctor.</h2>
                        <div class="site-tagline mb-3">A young AI chatbot that aims to assist you to get to know the possible disease you got.<br />Get started now!</div>
                        <div class="cta-btns">
                            <div class="mb-4"><a class="btn btn-primary font-weight-bold theme-btn" href="https://m.me/SelfDiagnose">Try Self-Diagnosis for FREE</a></div>
                        </div>
                    </div>
                </div>
                <!--//row-->
            </div>
        </section>
        <!--//hero-section-->


        <footer class="footer theme-bg-primary">
            <div class="footer-bottom text-center py-3">
                <!--/* This template is free as long as you keep the footer attribution link. If you'd like to use the template without the attribution link, you can buy the commercial license via our website: themes.3rdwavemedia.com Thank you for your support. :) */-->
                <small class="copyright">Landing Page Designed with by <a href="http://themes.3rdwavemedia.com" target="_blank">Xiaoying Riley</a></small>
            </div>
        </footer>
    </body>
</html>
