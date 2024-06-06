// polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
}
  
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;

        do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

try {
	// test for scope support
	document.querySelector(':scope *');
} catch (error) {
	(function (ElementPrototype) {
		// scope regex
		var scope = /:scope(?![\w-])/gi;

		// polyfill Element#querySelector
		var querySelectorWithScope = polyfill(ElementPrototype.querySelector);

		ElementPrototype.querySelector = function querySelector(selectors) {
			return querySelectorWithScope.apply(this, arguments);
		};

		// polyfill Element#querySelectorAll
		var querySelectorAllWithScope = polyfill(ElementPrototype.querySelectorAll);

		ElementPrototype.querySelectorAll = function querySelectorAll(selectors) {
			return querySelectorAllWithScope.apply(this, arguments);
		};

		// polyfill Element#matches
		if (ElementPrototype.matches) {
			var matchesWithScope = polyfill(ElementPrototype.matches);

			ElementPrototype.matches = function matches(selectors) {
				return matchesWithScope.apply(this, arguments);
			};
		}

		// polyfill Element#closest
		if (ElementPrototype.closest) {
			var closestWithScope = polyfill(ElementPrototype.closest);

			ElementPrototype.closest = function closest(selectors) {
				return closestWithScope.apply(this, arguments);
			};
		}

		function polyfill(qsa) {
			return function (selectors) {
				// whether the selectors contain :scope
				var hasScope = selectors && scope.test(selectors);

				if (hasScope) {
					// fallback attribute
					var attr = 'q' + Math.floor(Math.random() * 9000000) + 1000000;

					// replace :scope with the fallback attribute
					arguments[0] = selectors.replace(scope, '[' + attr + ']');

					// add the fallback attribute
					this.setAttribute(attr, '');

					// results of the qsa
					var elementOrNodeList = qsa.apply(this, arguments);

					// remove the fallback attribute
					this.removeAttribute(attr);

					// return the results of the qsa
					return elementOrNodeList;
				} else {
					// return the results of the qsa
					return qsa.apply(this, arguments);
				}
			};
		}
	})(Element.prototype);
}


window.addEventListener("load",domload);

function domload(e){
    tabControl.init();
    selectControl.init();
    selectBoxControl.init();
    accordion.init();
    asideControl.init();
    videoWrapControl.init();
    //headerFixedControl.init();

    //스와이프 가로사이즈 계산이 윈도우 리사이즈후에 제대로 잡히는 문제때문에 추가
    setTimeout(function() {
        var event;
        if(typeof(Event) === 'function') {
            event = new Event('resize');
        }else{
            event = document.createEvent('Event');
            event.initEvent('resize', true, true);
        }

        window.dispatchEvent(event);
    }, 200)

    //bottomFloating 이 존재하면 html 에 bottomFloating-on 클래스 추가
    if(document.querySelectorAll('body > .bottomFloating').length > 0){
        document.getElementsByTagName('html')[0].classList.add('bottomFloating-on');
    }
}



// var headerFixedControl = {
//     init: function(){
//         window.addEventListener('scroll',function(){
//             headerFixedControl.topFixed();
//         });
//     },
//     topFixed: function(){
//         var sc = window.scrollY;
//         var topHeight = $('.topfixBanner').innerHeight() + $('.header-top').innerHeight() || $('.header-top').innerHeight();
//         if(sc > topHeight ){
//             $('header').addClass('fixed');
//         } else {
//             $('header').removeClass('fixed');
//         }
//     },
// }


// 비디오영역 컨트롤
var videoWrapControl = {
    init: function(){
        document.addEventListener('click',function(e){
            if(e.target.closest('.videoWrap')){
                var videoWrap = e.target.closest('.videoWrap');
                var video = videoWrap.getElementsByTagName('video')[0];
                if(video.paused){
                    video.play();
                    videoWrap.classList.add('play');
                }else{
                    video.pause();
                    videoWrap.classList.remove('play');
                }
            }
            return false;
        });
    }
}

//탭 컨트롤
var tabControl = {
    init: function(){
        document.addEventListener('click',tabUi_click);
        function tabUi_click(e){
            var tab_ui = e.target.closest('.tab-ui');
            if(tab_ui){
                if(e.target.closest('.tab-ui>ul>li')){
                    var active = getChildNumber(e.target.closest('.tab-ui>ul>li'));
                    var tabButton = e.target.closest('.tab-ui>ul>li');
                    tab_ui.querySelectorAll(':scope > ul > li').forEach(function(element,i){
                        element.classList.remove('on');
                    })
                    tabButton.classList.add('on');
                    if(tab_ui.nextElementSibling.classList.contains('tab-cont')){
                        var tabCont = tab_ui.nextElementSibling;
                        tabCont.querySelectorAll(':scope > div').forEach(function(element,i){
                            element.classList.remove('on');
                        })
                        var tabContButton = tabCont.querySelectorAll(':scope > div')[active-1];
                        tabContButton.classList.add('on');    
                    }
                    
                }
            }
            return false;
        }
    }
}

//셀렉트박스 컨트롤
var selectBoxControl = {
    init: function(){
        document.addEventListener('click',selectBoxTitle_click);
        function selectBoxTitle_click(e){
            var selectBox = e.target.closest('.selectbox');
            if(selectBox){
                var selectBoxTitle = selectBox.querySelectorAll(':scope > .title')[0];
                if(selectBoxTitle == e.target){
                    if(selectBox.classList.contains('open')){
                        selectBox.classList.remove('open');
                    }else{
                        selectBox.classList.add('open');
                    }
                }
                
            }
            return false;
        }
    }
}

// 아코디언 컨트롤
var accordion = {
    init: function(){
        var acc = document.getElementsByClassName("accordion-title");
        var i;
                
        var accordionAction = function(){
            var acc_title = this.parentNode;
            var accordionPnnel = acc_title.nextElementSibling;

            if(this.closest('.accordion-wrap')){//아코디언 한개만 열리게 컨트롤하는거 (accordion-wrap 로 감싸져있고 oneActive 클래스가 있을경우)
                if(this.closest('.accordion-wrap').classList.contains('oneActive')){
                    var root = this.closest('.accordion-wrap');
                    var root_acc_title = root.getElementsByClassName('accordion-title');
                    var this_acc_title = this.closest('.accordion-title');
                    
                    if(root.classList.contains('oneActive')){
                        for (var index = 0; index < root_acc_title.length; index++) {
                            var elem = root_acc_title[index];
                            var accordionPnnel = elem.nextElementSibling;
                            
                            if(accordionPnnel){
                                if(this_acc_title == elem){
                                    elem.classList.toggle('open');
                                    if(acc_title.classList.contains('open')){
                                        accordionPnnel.style.height = accordionPnnel.scrollHeight + 'px'
                                        this.innerText = '닫힘'
                                    }else{
                                        accordionPnnel.style.height = '0px'
                                        this.innerText = '열림'
                                    }
                                }else{
                                    elem.classList.remove('open');
                                    accordionPnnel.style.height = '0px'
                                    this.innerText = '열림'
                                }

                                var accordionPnnel_parent = accordionPnnel.parentElement.closest('.accordion-panel');
                                

                                //아코디언 안에 아코디언 들어가있는경우 상위 아코디언 패널에 사이즈 재조정 하는거
                                if(accordionPnnel_parent){
                                    accordionPnnel_parent.style.height = 'auto'
                                    setTimeout(function(){
                                        accordionPnnel_parent.style.height = accordionPnnel_parent.scrollHeight + 'px';
                                    },300)
                                }
                            }
                        }
                    }
                }    
            }else{
                acc_title.classList.toggle("open");
                if(accordionPnnel){
                    var accordionPnnel_parent = accordionPnnel.parentElement.closest('.accordion-panel');
                    // var havScroll = this.parentElement.closest('.scroll-wrap');
                    if(acc_title.classList.contains('open')){
                        accordionPnnel.style.height = accordionPnnel.scrollHeight+1 + 'px'
                        this.innerText = '닫힘'
                        // if(havScroll){
                        //     $('.aside-wrap .scroll-wrap').mCustomScrollbar('disable');
                        // }
                    }else{
                        accordionPnnel.style.height = accordionPnnel.scrollHeight+1 + 'px'
                        setTimeout(function(){
                            accordionPnnel.style.height = '0px'
                            this.innerText = '열림'
                        },30)
                    }

                    //아코디언 안에 아코디언 들어가있는경우 상위 아코디언 패널에 사이즈 재조정 하는거
                    if(accordionPnnel_parent){
                        accordionPnnel_parent.style.height = 'auto'
                        setTimeout(function(){
                            accordionPnnel_parent.style.height = accordionPnnel_parent.scrollHeight+1 + 'px';
                        },300)
                    }
                }
            }
            
            return false;
        }
 
        for (i = 0; i < acc.length; i++) {
            var btn = acc[i].querySelectorAll(':scope > button')[0]
            var accordionPnnel = acc[i].nextElementSibling;
            if(btn){
                if(accordionPnnel){
                    if(acc[i].classList.contains('open')){
                        accordionPnnel.style.height = 'auto'
                    }else{
                        accordionPnnel.style.height = '0px'
                    }
                }
                removeEventListener("click", accordionAction);
                btn.addEventListener("click", accordionAction);
            }
        }
    }
}

var asideControl = {
    init: function(){
		setTimeout(function(){
            var header_gnb_height = 0;
            var detail_tab_height = 0;
            var event_tab_height = 0; //20211013 기획전 내 테마 탭 영역 고정 > 해당 스크립트 추가
            
            /* if($(".header-top").length > 0){
                header_gnb_height = $('.header-top').innerHeight();
                //console.log(header_gnb_height);
            } */
            if($(".header-gnb").length > 0){
                header_gnb_height = $('.header-gnb').innerHeight();
                //console.log(header_gnb_height);
            }
            if($(".detail-tab").length > 0){
                detail_tab_height = $('.detail-tab').innerHeight();
                console.log(detail_tab_height);
            }
            if($(".event-tab").length > 0){
                detail_tab_height = $('.event-tab').innerHeight();
                console.log(detail_tab_height);
            }//20211013 기획전 내 테마 탭 영역 고정 > 해당 스크립트 추가

            /* $(".header-top").sticky({topSpacing:0});
            $(".header-gnb").sticky({topSpacing:77}); */
            $(".header-gnb").sticky({topSpacing:0});
            $(".detail-tab").sticky({topSpacing:header_gnb_height});
            $(".event-tab").sticky({topSpacing:header_gnb_height});//20211013 기획전 내 테마 탭 영역 고정 > 해당 스크립트 추가
            
            //$(".header-top").sticky('update');
            $(".header-gnb").sticky('update');
            $(".detail-tab").sticky('update');
            $(".event-tab").sticky('update');//20211013 기획전 내 테마 탭 영역 고정 > 해당 스크립트 추가

			if($('.aside-wrap').length > 0){
				var aside_fixed = new StickySidebar('.aside-wrap', {
	                topSpacing: header_gnb_height + detail_tab_height + 30,
	                bottomSpacing: 0,
	                containerSelector: '.aside-contents',
	                innerWrapperSelector: '.sidebar__inner'
	            });
                // asideSetHeight();
            }
            
        },10);
    }
}
function asideSetHeight() {
    // var scr_visible;
    var asideCont = document.querySelector('.aside-wrap');
    var innerCont = asideCont.querySelector('.mCustomScrollBox');
    if($('.aside-wrap').length > 0 && asideCont.hasChildNodes('.scroll-wrap')){
        var winHeight = window.innerHeight - 300;
        var innerConHeight = window.getComputedStyle(innerCont).height;
            innerConHeight = innerConHeight.replace(/px/, '');
        //console.log(innerConHeight + ' ' + winHeight);
        if(innerConHeight > winHeight) {
            innerCont.style.height = winHeight + 'px';
            // scr_visible=true;
        }else{
            innerCont.style.height = 'auto';
            // scr_visible=false;
        }
        // switch(scr_visible){
        //     case true : $(".aside-wrap .scroll-wrap").mCustomScrollbar('update');  
        //     break;
        //     case false : $(".aside-wrap .scroll-wrap").mCustomScrollbar('disable');
        //     break;
        // }
    }
}

var selectControl = {
    init: function(){
        document.addEventListener('change',function(e){
            if(e.target.localName == 'select'){
                e.target.classList.add('selected');
            }
        })
    }
}

function getChildNumber(node) {
    return Math.ceil(Array.prototype.indexOf.call(node.parentNode.childNodes, node)/2);
}


//메인에 나오는 상단 톱배너 삭제
function topFixBanner_remove(){
    var topfixBanner = document.querySelector('.topfixBanner');
    console.log(topfixBanner);
    if(topfixBanner){
        $(topfixBanner).animate({height:0});
        headerFixedControl.topFixed();
    }
}
// 팝업 열기
function popOpen(id) {
    document.getElementById(id).classList.add('open');
}

// 팝업 닫기
function popClose(id) {
    document.getElementById(id).classList.remove('open');
    // 팝업 내부 cont 영역에 대한 클릭 이벤트 제거
    document.getElementById(id).querySelector('.cont').removeEventListener('click', stopPropagation);
}

// 팝업 내부 cont 영역 클릭 시 이벤트 전파 중지 함수
function stopPropagation(event) {
    event.stopPropagation();
}

// 팝업 영역 클릭 시 닫기
document.addEventListener('click', function(event) {
    // 팝업 영역 클릭인 경우
    if (event.target.closest('.layerPop')) {
        // 팝업 영역 내부 cont 영역 클릭이 아닌 경우에만 팝업 닫기
        if (!event.target.closest('.cont')) {
            const popup = event.target.closest('.layerPop');
            const popupId = popup.getAttribute('id');
            popClose(popupId);
        }
    }
});


//스와이퍼카운트
function swiperCountRander(e){
    var totalIndex = Math.floor(e.wrapperEl.childElementCount / 3);
    var active = e.realIndex + 1;
    e.el.parentElement.querySelector('.swiper-count').innerText = active + ' / ' + totalIndex;
    //console.log(totalIndex + ' ' + active)
}

$.datepicker.setDefaults({
    dateFormat: 'yymmdd',
    prevText: '이전 달',
    nextText: '다음 달',
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    showMonthAfterYear: true,
    yearSuffix: '년'
});

$(document).ready(function(){
    var prdImg = $('.ratio').find('img');
    prdImg.each(function(){
        var ratio = $(this).outerHeight() / $(this).outerWidth();
        if( ratio > 1) {$(this).addClass('vertical')} else {$(this).addClass('horizontal')}
    }); // img Ratio Class add (IE)
    
    $(".scroll-wrap").mCustomScrollbar({
        mouseWheelPixels: 300,
        autoHideScrollbar: "true",
        scrollInertia : 200
    });//Design Scroll


    $('.form-box input, .form-box select').each(function() {
        $(this).data('holder', $(this).attr('placeholder'));
        $(this).focusin(function(){
            $(this).closest('.form-box').removeClass('reset').addClass('focus-line');
        });
        $(this).focusout(function(){
            $(this).closest('.form-box').removeClass('focus-line');
        });
    }); // input, select active-line toggleClass
    
    
    /* 20220620 결제 페이지 쿠폰적용 UI 개선 > 상품 쿠폰 할인 아코디언 스크립트 추가 */
	$('.acd-data-tit').on("click",function(e){
		e.preventDefault();
		if($(this).hasClass("on")){
			$(this).removeClass("on").parent().find('.acd-data-cont').removeClass('on').stop().slideUp(300);
		}else{
			$(this).addClass('on').parent().find('.acd-data-cont').addClass('on').stop().slideDown(300);
		}
	});

    // 20230608 #3782 상품상세 이미지에 코디상품 버튼 추가 스크립트
    $(".btn-anchor").click(function(e){
        e.preventDefault();
        // $("html, body").stop().animate({scrollTop: $($(this).attr("href")).offset().top - 155}, 1000);
        $("html, body").scrollTop($($(this).attr("href")).offset().top - 155);
    });

    /* 20240208 #4757 BO 에디토리얼 등록시 PC이미지 사이즈 변경 및 추가 기능 요청 : 시작  */
    //각 이미지 슬라이드 영역 슬라이드 갯수 체크 후 적용
    $('.event-img-slider').each(function(){
        if($(this).find(".swiper-slide").length == 1) {
            $(this).addClass( "disabled" );   
        }
    });
    //각 이미지 슬라이드 영역 활성화
    var imgSlide = new Swiper('.event-img-slider', {
        //slidesPerView: 'auto',
        //watchOverflow: false,
        slidesPerView: 1,
        slidesPerGroup: 1,
        speed:500,
        loop:true,
        observer: true,
        observeParents: true,
        pagination: {
            el: '.swiper-pagination',
        },
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false,
        // },
    });
    /* //20240208 #4757 BO 에디토리얼 등록시 PC이미지 사이즈 변경 및 추가 기능 요청 : 끝  */
    
});