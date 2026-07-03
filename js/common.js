
//Version 2022-03-10 09:00

/* device check */
function deviceCheck() {
	function isMobileYn(){
        var filter = "win16|win32|win64|mac|macintel";
        if (navigator.platform ) {
            if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
                return true;
            } else {
                return false;
            }
        } 
        return false; 
    }
    if(isMobileYn()){ 
        var userOS = navigator.userAgent.toLowerCase();
        if (userOS.indexOf('android') > -1) {
            $('html').addClass('android');
        } else if (userOS.indexOf("iphone") > -1 || userOS.indexOf("ipad") > -1 || userOS.indexOf("ipod") > -1) {
            $('html').addClass('ios');
        } else {
            $('html').addClass('android');
        }
    }
}

function st(st){
  try{
	  // develop
	  let bodyTop=nvl($('body').css('top').replace(/[^0-9.]/g,''),0);
	  var st = $(window).scrollTop();
	  return bodyTop==0?st:bodyTop;  
  }catch(e){
	  // publ
	  var st = $(window).scrollTop();
	  return st;
  }
}


function deviceStatusHeight() {
	var agent = navigator.userAgent;
	var key01 = 'YTPOC_DEVICE=@';
	var key02 = '|sh:'; // statusbar height
	var ytpocUserAgent = agent.substring(agent.indexOf(key01) + key01.length, agent.length - 1);
	var sh = ytpocUserAgent.substring(ytpocUserAgent.indexOf(key02) + key02.length, ytpocUserAgent.length);
	return parseInt(sh);
}

/* popup script */
// popup open - element onclick
function layerOpen(e){
	$('[data-role="layerOpen"].'+e).show();
	$('[data-role="layerOpen"].'+e).addClass('active');
	$('body').css('top', st(st) * -1 );
	showBodyMask();
	$('.nextPopup').on('click',function(){
		$('.body-mask').css('z-index','13'); 
	});   
}

// popup close
function layerClose() {
	$('[data-popup="layerClose"]').on('click', function() {
		var st = $('body').offset().top;
		$(this).parents('[data-role="layerOpen"]').hide();
		$(this).parents('[data-role="layerOpen"]').removeClass('active');
		if ($(this).hasClass('mask') == true) {
			$('.body-mask').css('z-index', '9');
			return false;
		}else {
			hideBodyMask();
			$(window).scrollTop(st * -1);
			$('body').removeAttr('style');
		}
	});
}
// popup mask script
var layerPopupStack=[];
// popup mask script
// develop write 2022-01-28
function showBodyMask() {	
	$('div.layerPopup:visible , #bottomSheet.active , #gnb.active').map((k,v)=>{
		var ele=$(v)[0];
		if($('div.layerPopup:visible , #bottomSheet.active , #gnb.active').length-1>k){
			var layerId=v.tagName;
			if(ele.id!=""){
				layerId+="#"+ele.id;
			}
			layerId+="."+ele.classList.value.split(' ').filter((e)=>{ return e!="active"}).join('.');
			if(layerPopupStack[layerPopupStack.length-1]!=layerId){
				layerPopupStack.push(layerId);
				$(layerId).hide();
			}
		}
	});
	if($(".body-mask").length == 0){
		$("#document").append($('<div id="" class="body-mask active"></div>'));
	}	
	var bodyHeight = $("#document").outerHeight(true);
	$(".body-mask").height(bodyHeight);
	$('body').addClass('body-scroll-lock');
}
// develop write 2022-01-28
function hideBodyMask() {
	let getStack=layerPopupStack.pop(layerPopupStack.length - 1);
	var st = $('body').offset().top; // 0221 publ
	if(getStack!=null){
		if(!$(getStack).hasClass('active')){
			$(getStack).addClass('active');
		}
		$(getStack).show();
	}else{
		if($('div.layerPopup:visible , #bottomSheet.active:visible').length==0){
			$(".body-mask").remove();
			$('body').removeClass('body-scroll-lock');
			$(window).scrollTop(st * -1); // 0221 publ
		}
	}
}
function showFullMask() {
	$("#document").append($('<div id="" class="full-mask active"></div>'));
	var bodyHeight = $("#document").outerHeight(true);
	$(".full-mask").height(bodyHeight);
}
function hideFullMask() {
	$(".full-mask").remove();
}

/* ui action script */
// index.js
// develop 2022-01-28
function indexCtrl() {
	/* INITIALIZE */
	if ($("#main").hasClass("sub-main") === true) {
		$("header .nav-btn-wrap .btn-arrow img").css("left", "30px");
		$("header .nav-btn-wrap .btn-navi img").css("right", "20px");

		if ($(".sub-main .signup-content").length > 0) $(".nav-btn-wrap").addClass('show-bg-white');
	}

	/* EVENT */
	$(document).on("click",".body-mask",function() {
		var doHide=false;
		$('div.layerPopup:visible , #bottomSheet.active , #gnb.active').map((k,v)=>{
			var ele=$(v)[0];
			
			var layerId=v.tagName;
			if(ele.id!=""){
				layerId+="#"+ele.id;
			}
			layerId+="."+ele.classList.value.split(' ').filter((e)=>{ return e!="active"}).join('.');
			
			if(layerPopupStack.findIndex((e)=>{ return e==layerId }) < 0){
				if(layerId.indexOf("layerPopup")>-1){
					if(layerId.indexOf(".msgbox")>0){ //Alert,Confirm 2022-02-22
						if($(layerId).find("button.gray").length==0 && $(layerId).find("button.blue").length==1){ //alert 
							doHide=true;
							$(layerId).find("button.blue").trigger('click');
						}else{ //confirm 
							doHide=true;
							$(layerId).find("button.gray").trigger('click');
						}
					}else{	//Layer
						if($(layerId).find('.layerPopup-close').length>0){							
							$(layerId).find('.layerPopup-close').trigger('click');
							doHide=true;
						}else{
							$(layerId).hide();
						}
						
						
					}						
				}
				$(layerId).removeClass('active');
			}				
		});
		if(!doHide){
			hideBodyMask();
		}
	    // bottomsheet dim click event		    
	});

	$(document).on("click", "#bottomSheet .btn-show", function() {
		$('body').css('top', st(st) * -1 );
		try{
			gtag("view","bottomsheet","viewed");
		}catch(e){
			console.log(e);
		}
		$("#bottomSheet").addClass("active");
		showBodyMask();
	});
	$(document).on("click", "#bottomSheet .btn-hide", function() {
		$("#bottomSheet").removeClass("active");
		var st = $('body').offset().top;
		hideBodyMask();
		$(window).scrollTop(st * -1);
		$('body').removeAttr('style');
	});

	$(document).on("click", ".tab-list .tab-item", function() {
		var $target = $(this);
		$target.siblings().removeClass('active');
		$target.addClass('active');
	});

	if ($("#main").hasClass("sub-main") === true) { $(".nav-btn-wrap").addClass('show-bg-white');} // 0216 | 

	$(window).on("scroll", function() {
		var curScrollTop = $(window).scrollTop();
		var $mainKvHeight = $(".main-kv").outerHeight(true);
		var showHite = $('#header').next('.sub-main');
		var subMain = $('.sub-main').hasClass('top-white');
		var couponTitle = $(".coupon-area__title").height();
		var hiddenTitle = $("h2.hidden").outerHeight();
		var noVisual = $(".main-kv").length === 0;

		if (curScrollTop > $mainKvHeight || curScrollTop > couponTitle || noVisual || curScrollTop > hiddenTitle) {
			if ($("#main").hasClass("sub-main") === false) {
				$(".btn-menu.white").hide();
				$(".btn-menu.black").show();
				$(".nav-btn-wrap").addClass('show-bg-white'); // 0216 | script 
			}
			$(".nav-btn-wrap").addClass('show-bg-white');

			if ($('#main').hasClass('top-white')) {
				$(".btn-menu.white").hide();
				$(".btn-menu.black").show();
				$(".btn-prev.white").hide();
				$(".btn-prev.black").show();
			}
		} else {
			if ($("#main").hasClass("sub-main") === false) {
				$(".btn-menu.white").show();
				$(".btn-menu.black").hide();
			}
			if ($("#main").hasClass("top-white") === true) {
				$(".btn-menu.white").show();
				$(".btn-menu.black").hide();
				$(".btn-prev.white").show();
				$(".btn-prev.black").hide();
			}
			// if ($(".sub-main .signup-content").length === 0) $(".nav-btn-wrap").removeClass('show-bg-white');
			if ($(".sub-main").length === 0) { $(".nav-btn-wrap").removeClass('show-bg-white');} // 0216 | 
		}
	});

	// modify info 
	$(document).on("click", ".content-wrap .guide-info .btn-normal", function() {
		$(".layer-popup-content").show();
		showBodyMask();
	});
	$(document).on("click", ".btn-layer-close", function() {
		$(".layer-popup-content").hide();
		hideBodyMask();
	});
}
// common2.js / bottomsheet js
function bottomSheetCtrl() {
	var isScrolling = null, isScrollDown = false, lastScrollTop = 0;

	function includeHTMLAll() {
		var objs = $("[include-html]");
		$.each(objs, function(index, element) {
			includeHTML(element);
		});
	}

	function afterIncludeHTML() {
		try{
			if(locationPathName[0]=="setMbrBaseInfo.html"){
				$("div.btn-arrow").remove();
				$("div.btn-navi").remove();
			}	
		}catch(e){
			console.log(e);
		}
		
		if ($(".header-top").length > 0) {
			// main
			$(".btn-navi .black").hide();
			$(".btn-navi .btn-close").hide();
			$(".btn-arrow .btn-prev").hide();
			$(".btn-arrow .btn-next").hide();
			$(".footer-top").show();

			if ($('.greeting-wrap').length > 1) {
				$('.bottom-sheet__swiper').addClass('bottom-multi')
			}
			// sub-main
			if ($("#main").hasClass("sub-main") === true) {
				$(".btn-navi .btn-close").hide();
				$(".btn-navi .white").hide();
				$(".btn-arrow .btn-prev.black").show();
				$(".btn-navi .btn-menu.black").show();
				$(".footer-top").hide();
			}
			if ($("#main").hasClass("top-white") === true) {
				$(".btn-arrow .btn-prev.white").show();
				$(".btn-navi .btn-menu.white").show();
				$(".btn-arrow .btn-prev.black").hide();
				$(".btn-navi .btn-menu.black").hide();
			}
		}
	}

	function includeHTML(obj, fnCallback) {
		var file, xhttp;
		var fnCallback = fnCallback || function() {
			afterIncludeHTML();
		};
		if (obj === null) return;
		file = $(obj).attr("include-html");

		$.ajax({
			url : file,
			success : function(result) {
				$(obj).html(result);
				$(obj).removeAttr("include-html");
				console.log("includeHTML");
				if (typeof fnCallback === "function") setTimeout(fnCallback, 10);
			}
		});
	}

	function event() {

		$(window).on("scroll", function() {
			var curScrollTop = $(window).scrollTop();
			var $greetingArea = $("#bottomSheet");

			if ($greetingArea.hasClass('active') === true) { return false; }

			window.clearTimeout(isScrolling);
			isScrolling = setTimeout(function() {
				$greetingArea.addClass('is-visible');
			}, 500);

			(lastScrollTop + 10 < curScrollTop) ? isScrollDown = true : isScrollDown = false;
			if (isScrollDown === true) {
				$greetingArea.removeClass('is-visible');
			}
			lastScrollTop = curScrollTop;
		});
	}

	function init() {
		includeHTMLAll();
		$("#bottomSheet").addClass('is-visible');
		afterIncludeHTML();
		event();
	}
	init();
}
// gnb script
function gnbCtrl(){
	var $target = $('.gnb');
  
	$(document).on('click','.btn-menu', function(e){
	  e.preventDefault();
	  $('.gnb').addClass('active');
	  $('body').css('top', st(st) * -1 );
	  showBodyMask();
	  
	  try{
		  gtag('view','menu','viewed');
	  }catch(e){
		  console.log(e);
	  }
	});
	
	$(document).on('click','.gnb__close', function(){
	  var st = $('body').offset().top;
	  $('.gnb').removeClass('active');
	  hideBodyMask();
	  $(window).scrollTop(st * -1);
	  $('body').removeAttr('style');
	});
}

// coupon page tab
function couponTab() {
	// element pualugin tab 
	if ($('.coupon-tab--qna').length > 0) { return; }

	var target = $('.coupon-tab__list');
	var btn = $('.coupon-tab__anchor');
	var box = $('.coupon-tab__panel');

	btn.on('click', function() {
		var num = target.index($(this).closest(target));
		if (!$(this).hasClass('active')) {
			btn.removeClass('active');
			$(this).addClass('active');
			box.removeClass('active');
			box.eq(num).addClass('active');
		}
	})
}
// main page tab
function mainTab(){
	var target = $('.main-tab__list');
	var btn = $('.main-tab__anchor');
	var box = $('.main-tab__panel');
  
	btn.on('click', function(e){
	  e.preventDefault();
	  var num = target.index($(this).closest(target));
	  if(!$(this).hasClass('active')) {
		btn.removeClass('active');
		$(this).addClass('active');
		box.removeClass('active');
		box.eq(num).addClass('active');
	  }
	})
}
// top button script
function topBtnCtrl() {
	var btn = $('.top-button');
	var target = $('.top-button__anchor');

  if(target.length < 1) { return; }
  if($('#bottomSheet').length > 0) {
    $('.top-button__anchor').css({'bottom' : '89px'});
  }

  target.on('click', function(){
    $('body, html').animate({ scrollTop: 0 }, 300, 'linear')
  });

  btn.hide();

  $(window).on('scroll', function(){
    btn.hide();
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
      btn.show();
      if($(window).scrollTop() == 0) {
        btn.hide();
      }
    }, 250));
  });
}
// full height
function fullContents() {
	$('[data-role="full_height"]').each(function() {
		var top = $('[data-role="full_height"]').offset().top;
		var footer = $('.top-button').siblings('.footer-wrap').outerHeight();
		var val = top + footer;
		if ($(this).parents('.sub-main').siblings('.footer-wrap').length > 0) {
			$(this).css({
				'min-height' : 'calc(100vh - ' + val + 'px)'
			});
		} else {
			$(this).css({
				'min-height' : 'calc(100vh - ' + top + 'px)'
			});
		}
	});
}
// header title text
function headerTit() {
	var tit = $('h2.hidden').text();
	$('.header__title').text(tit);
}
// textarea value
function textCountCtrl() {
	var target = $('[data-role="textArea"]');
	var current = $('[data-role="textArea__current"]');

	function lengthCheck(self) {
		var check = self.val().length;
		self.siblings().find(current).text(check);
	}
	;

	target.each(function() {
		var self = $(this);
		lengthCheck(self);
	})

	target.on('keyup', function() {
		var self = $(this);
		lengthCheck(self);

		target.parent().siblings("p.error-message").hide();
		target.removeClass('input-error');

		if (!isEmpty(self[0].maxLength)) {
			if (self.siblings().find(current).text() > self[0].maxLength) {
				fnAlert(self[0].maxLength + '자 이상 입력 불가합니다..');
			}
			self[0].value = self[0].value.substr(0, self[0].maxLength);
		}
	});
}
// sub main slide control
function dataSlideCtrl() {
	if ($('.subpage-list').length === 3) {
		$('.subpage-list__wrap').css({
			'display' : 'flex',
			'justify-content' : 'center'
		})
	} else {
		$('.subpage-list__wrap').removeAttr('style')
	}
}

/* form script */
// agree check
function inputCheck() {
	var btn = $('[data-role="agree"]');
	btn.on('click', function() {
		var target = $(this).attr('data-id');
		if ($('#' + target).prop('checked', false)) {
			$('#' + target).prop('checked', true);
		}
		$(this).parents('[data-role="layerOpen"]').hide();
		hideBodyMask();
	});
}
// input file upload
function inputFile() {
	var fileTarget = $('.text-field input[type="file"]');
	var thisVal = fileTarget.val();
	fileTarget.parent('.text-field').addClass('small');

	fileTarget.on('change', function() {
		if (window.FileReader) {
			var filename = $(this)[0].files[0].name;
		} else {
			var filename = $(this).val().split('/').pop().split('\\').pop();
		}
		$(this).siblings('.upload-name').val(filename);
		if (thisVal == '') {
			$(this).parent('.text-field.small').addClass('upload');
			$(this).siblings('label').text('수정');
		}
	});
}
// radio tab check
function radioChecked(){
	var radio = $('.box-radio-input input:radio');
	var email = $('.signup-content.email');
	var target = $('.box-radio-input input#emailCertification');
	$(radio).first().addClass('active');
	$(radio).on('change', function(){
	  $(this).addClass('active').siblings().removeClass('active');

	  if(!target.hasClass('active')){
		email.find('input, select').attr("disabled", true);
	  } else{
		email.find('input, select').attr("disabled", false);
	  }
	});
}

// select color chacnge
function selected(){
	$('.class-num').css('color','#c9c9c9');
	  $('.class-num').change(function() {
	  var current = $('#select').val();
	  if (current != 'null') {
		$('.class-num').css('color','#222');
	  } else {
		$('.class-num').css('color','#c9c9c9');
	  }
	});
}
// search list
function searchList() {
	var target = $('.schoolname-input');
	$(target).on('keyup', function() {
		var val = $(this).val();
		var valList = $(this).siblings('.search-list');
		var option = $('.search-list ul li a');

		if (val == '') {
			valList.hide();
		} else {
			valList.show();
			option.click(function() {
				var text = $(this).text();
				target.val(text);
				valList.hide();
			});
		}
	});
}
// input val check
function charValCtrl() {
	var target = $('input');
	// var kor = /[^ㄱ-ㅎ가-힣ㅏ-ㅣ\s\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]/gi;
	var kor = /[^a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\s\u318D\u119E\u11A2\u2022\u2025\u00B7\uFE55]/gi; // 0223 eng 
	// var date = /[^가-힣ㄱ-ㅎㅏ-ㅣ0-9\s\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]/gi; 0222 delete
	var nick = /[^0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55]/gi;
	var email = /[^a-zA-Z0-9\{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
	target.on('keyup paste blur', function(){
	  if($(this).attr('data-type') === 'nickname') {
		$(this).val($(this).val().replace(nick, ''));
	  } else if($(this).attr('type') === 'email') {
		$(this).val($(this).val().replace(email, ''));
	  } else if($(this).attr('type') === 'date') {
		$(this).val(); // 0222 modify
	  } else if($(this).attr('readonly') !== 'readonly' && $(this).attr('type') !== 'number') { // 0221 number case 
		  $(this).val($(this).val().replace(kor, ''));
	  }
	}); 
	
}

function menuHeight() {
	var gnbTop = $('.gnb__toparea').outerHeight();
	var gnbMenu = $('.gnb__scroll');
	// var gnbFooter = $('.footer-wrap').outerHeight();
	var minHehght = gnbTop ;

	gnbMenu.css({
		'height' : 'calc(100vh - ' + minHehght + 'px)'
	});
}


// popup inner 
function layerInner() {
	$('.layerPopup').wrapInner('<div class="layerPopup-inner"></div>') 
	$(".body-mask").remove();
}
  
function slidelength(){
	$('.cate-coupon__content').each(function(){
	  var len = $(this).find('.cate-coupon__item.swiper-slide').length;
	  if(len === 1){
		$(this).find('.cate-coupon__item.swiper-slide').css('width', '100%');
	  }
	});
}

function textColorCtrl(){
	if($('input[name=cp_item]').val() == 0) {
	  $('.attention-link').addClass('disabled');
	  $('.signup-content.email .tit2').css({'color':'#999'})
	  $('.atSign').addClass('disabled')
	}
	$('.signup-content.email').hide();
	$('input[name=cp_item]').on('change', function(){
	  if($(this).val() == 1) {
		$('.attention-link').removeClass('disabled');
		$('.upload-name').addClass('disabled');
		// $('.signup-content.email .tit2').css({'color':'#111'})
		// $('.signup-content.studentId .tit2').css({'color':'#999'})
		$('.atSign').removeClass('disabled')
		$('.studentId').hide();
		$('.signup-content.email').show();
	  } else if($(this).val() == 0) {
		$('.attention-link').addClass('disabled');
		$('.upload-name').removeClass('disabled');
		// $('.signup-content.email .tit2').css({'color':'#999'})
		// $('.signup-content.studentId .tit2').css({'color':'#111'})
		$('.atSign').addClass('disabled')
		$('.studentId').show();
		$('.signup-content.email').hide();
	  }
	});
	// $('input[name=cp_item]').trigger('change');
}
  
function shadowNone(){
	  $('.submain-banner__slide').parents('.subpage__section--shadow-box').css('box-shadow','none');
}

$(document).ready(function(){
	shadowNone();
	slidelength();
	// os check
	deviceCheck();
	// popup
	// layerInner();
	layerClose(); // popup close
	// ui
	gnbCtrl();
	couponTab();
	mainTab();
	// form
	inputCheck();
	inputFile();
	radioChecked();
	selected();
	searchList();
	textCountCtrl();
	charValCtrl();
	dataSlideCtrl();
	textColorCtrl();
	
	if(typeof locationPathName=="undefined"){ //==> dev 동적 로딩 후 호출 이벤트 2회 씩 타는 현상 방지
		console.log('/pages/');
		topBtnCtrl(); 
		fullContents(); 
		headerTit();  
		// menuHeight();  
		indexCtrl(); // index.js  ==> dev 동적 로딩 후 호출
		bottomSheetCtrl(); // common2.js bottomsheet js  ==> dev 동적 로딩 후 호출
	}
	// pualugin init
	$("[data-element=accordion]").accordion();
	$("[data-element=tab]").tab();
});
// document end
