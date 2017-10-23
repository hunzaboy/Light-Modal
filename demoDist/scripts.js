
//Only for Demo animation Selection


function testAnim(x) {
    $('.light-modal-content').removeClass().addClass(x + ' light-modal-content animated');
};

$(document).ready(function() {
    $('.js--animations').change(function() {
        var anim = $(this).val();
        testAnim(anim);
    });
});