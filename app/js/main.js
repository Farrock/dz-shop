$(function () {
    Select.init(
        {
            selector: '.layouttypes'
        }
    );

    $('.layouttypes').on('change', function(){
        var val = $(this).val();
        $('.catalog').removeClass('catalog-line, catalog-grid').addClass(val);
    });
});