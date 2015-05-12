$(function () {

    $('.layouttypes').styler();

    $('.layouttypes').on('change', function(){
        $('.catalog').removeClass('catalog-line, catalog-grid').addClass($('.layouttypes option:selected').val());
    });


    if($('.lt-ie9').length){

        $('.topcatalog__item:last-child').addClass('last-child');
        $('.catalog__item:nth-child(3n)').css('margin-right', '0');

    }


});