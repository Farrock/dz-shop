$(function () {
    var $btnUp = $('.bth-up');
    $(window).scroll(function () {

        if ($(this).scrollTop() != 0) {
            $btnUp.fadeIn();
        } else {
            $btnUp.fadeOut();
        }
    });
    $btnUp.click(function () {
        $('body,html').animate({scrollTop: 0}, 200);
    });

});