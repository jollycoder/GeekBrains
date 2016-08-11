$(".tabs .tabs__content:not(:eq(0))").hide();

$(".tabs li")
    .click(function () {
        $(".tabs li").removeClass("active").eq($(this).index()).addClass("active");
        $(".tabs .tabs__content").hide().eq($(this).index()).show();
    })
    .eq(0).addClass("active");
