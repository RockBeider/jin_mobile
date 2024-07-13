document.addEventListener("DOMContentLoaded",domload);
function domload(e){
    mainSticky.init();
    tabControl.init();
    selectBoxControl.init();
    tooltipControl.init();
    goodsDetailTabControl.init();
    videoWrapControl.init();
    //postingView_control.init();
    allMenu_control.init();
    globalScroll_control.init();
    keywordUi_control.init();
    searchArea_control.init();
    selectControl.init();
    
    document.getElementsByTagName('html')[0].classList.add('pageLoadComple');
    
    //일정시간 로딩이 된 다음에 실행이되어야 오류가 없음
    setTimeout(function(){
        accordion.init();
        boardReplyBoxControl.init();
        boardReplyBoxControl_a.init();
        channelPlan_detail_control.init();
    },100)

    //스와이프 가로사이즈 계산이 윈도우 리사이즈후에 제대로 잡히는 문제때문에 추가
    setTimeout(() => {
        window.dispatchEvent(new Event("resize"))
    }, 200)

    //bottomFloating 이 존재하면 html 에 bottomFloating-on 클래스 추가
    if(document.querySelectorAll('body > section > [class *= bottomFloating]').length > 0){
        document.getElementsByTagName('html')[0].classList.add('bottomFloating-on');
    }

    // 레이어팝업에 bottomFloating 이 있을경우 하단 패딩설정
    document.querySelectorAll('.layerPop .bottomFloating-button').forEach((element,idx) => {
        element.closest('section').style.paddingBottom = (element.offsetHeight + 20) + 'px';
    });

    //categorySelectUi 가 존재하면 html에 categorySelectUi-on 클래스 추가
    if(document.getElementsByClassName('categorySelectUi').length > 0){
        document.getElementsByTagName('html')[0].classList.add('categorySelectUi-on');
        var deem = document.querySelector('.categorySelectUi .deem');
        deem.addEventListener('click',function(){
            categorySelectUi_layerClose();
        })
    }

    //sticky 상태의 톱메뉴 그리고 필터가 존재하면 html에 topMenuAdnFilter-on 클래스 추가
    if(document.querySelectorAll('.topMenuNav.sticky').length > 0){
        if(document.querySelectorAll('.prd-list-filter').length > 0){
            document.getElementsByTagName('html')[0].classList.add('topMenuAdnFilter-on');
        }
    }
    
}


var channelPlan_detail_control = {
    init: function(){
        // if(!document.querySelector('.channelPlan-detail.noFixed')){
        //     if(document.querySelector('.channelPlan-detail .contents')){
        //         var winHeight = window.innerHeight;
        //         var viewTop = document.querySelector('.channelPlan-detail .contents');
        //         var viewTop_height = 145;
        //         var top = (winHeight - viewTop_height) - 56 + 'px'
        //         window.scrollTo(0,0);
        //         document.getElementsByTagName('html')[0].classList.remove('scrollUp');
        //         viewTop.style.marginTop = top;
        //     }
        // };

        //channel 상세 : 이미지 사이즈에 맞춰 여백 조정
        if(document.querySelector('.channelPlan-detail')){
            var ch_visual = document.querySelector('.channelPlan-detail .visual');
            var ch_visualHeight = window.getComputedStyle(ch_visual.querySelector('.img img')).height;
            ch_visual.nextElementSibling.style.marginTop = ch_visualHeight;
        }
    }
}

// 20220801 케어페이지 리뉴얼 > 상단 페럴렉스 효과 스크립트 추가
var care_renewal_detail_control = {
    init: function(){
        //channel 상세 : 이미지 사이즈에 맞춰 여백 조정
        if(document.querySelector('.care-banner')){
            var care_visual = document.querySelector('.care-banner');
            var care_visualHeight = window.getComputedStyle(care_visual.querySelector('.care-banner')).height;
            care_visual.nextElementSibling.style.marginTop = care_visualHeight;
        }
    }
}

var searchArea_control = {
    init: function(){
        document.addEventListener('keyup',function(e){

            var search_area = e.target.closest('.search-area');
            if(search_area){
                if(e.target.value.length > 0){
                    search_area.classList.add('char-on');
                }else{
                    search_area.classList.remove('char-on');
                }
            }
        });
    },
    del: function(){
        var search_area = event.target.closest('.search-area');
        search_area.querySelector('.search-input').value = '';
        search_area.classList.remove('char-on');
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

//키워드 ui 컨트롤
var keywordUi_control = {
    init: function(){
        if(document.querySelectorAll('.brand-search-keyword')){
            // default on
            document.querySelectorAll('.brand-search-keyword').forEach((element,idx) => {
                element.querySelector('li').classList.add('on')
            });

            function heightSetting(){
                document.querySelectorAll('.brand-search-keyword').forEach((element,idx) => {
                    var h = 0;
                    if(element.closest('.layerPop-brandSelect')){ /* 브랜드 선택 레이어의 경우 */
                        h = window.innerHeight - 220;
                        element.querySelectorAll(':scope > ul')[0].style.height = h + 'px';
                    }else if(element.closest('.layerPop-allMenu')){ /* 전체메뉴 레이어의 경우 */
                        h = window.innerHeight - document.querySelectorAll('.cont > header')[0].offsetHeight - 70;
                        element.querySelectorAll(':scope > ul')[0].style.height = h + 'px';
                    }else{
                        h = window.innerHeight - 80;
                        element.querySelectorAll(':scope > ul')[0].style.height = h + 'px';
                    }
                });
            }
            window.addEventListener('resize',function(e){
                heightSetting();
            });

            document.addEventListener('click',function(e){
                if(e.target.closest('.brand-search-keyword')){
                    var brand_search_keyword = e.target.closest('.brand-search-keyword');
                    var brand_search_list = brand_search_keyword.nextElementSibling;
                    var keyword = e.target.textContent;
                    
                    brand_search_list.querySelectorAll('.keyword').forEach((element,idx) => {

                        if(element.textContent == keyword){
                            var scTop;
                            if(brand_search_keyword.closest('.layerPop-brandSelect')){ /* 브랜드 선택 레이어의 경우 */
                                scTop = element.offsetTop;
                                element.closest('.cont').scrollTo(0,scTop)
                            }else if(brand_search_keyword.closest('.layerPop-allMenu')){ /* 전체메뉴 레이어의 경우 */
                                scTop = element.offsetTop + 120;
                                element.closest('.cont').scrollTo(0,scTop)
                            }else{ /* 그외 페이지의 경우 */
                                scTop = element.offsetTop + getPosY(brand_search_list);
                                window.scrollTo(0,scTop);
                            }
                            
                            if(brand_search_keyword.querySelectorAll('li.on')[0]){
                                brand_search_keyword.querySelectorAll('li.on')[0].classList.remove('on');
                            }
                            e.target.closest('li').classList.add('on');
                        }
                    });
                }
            });
        }

    }
}

//스크롤 올릴때 html에 scrollUp class 추가
var globalScroll_control = {
    init: function(){
        var temp_wTop = 0;
        var wTop = window.scrollTop;
        document.addEventListener('scroll',function(e){
            wTop = window.scrollY;
            if(window.scrollY > 150){
                if(wTop > temp_wTop){
                    document.getElementsByTagName('html')[0].classList.add('scrollUp');
                }else{
                    document.getElementsByTagName('html')[0].classList.remove('scrollUp');
                }
                temp_wTop = wTop;
            }
            if(scrollY > 0){
                document.getElementsByTagName('html')[0].classList.add('goTop-visible');
            }else{
                document.getElementsByTagName('html')[0].classList.remove('goTop-visible');
            }
        })
    }
}

//전체메뉴 컨트롤
var allMenu_control = {
    init: function(){
        if(document.getElementsByClassName('allMenu').length > 0){
            document.addEventListener('click',function(e){
                if(e.target.closest('.allMenu')){
                    if(e.target.nodeName == 'A'){
                        if(e.target.nextElementSibling){
                            var li = e.target.closest('li');
                            li.classList.toggle('on');
                        }
                    }
                }
            });
        }
        
    }
}

//메인 sticky 컨트롤
var gf_mainSticky_NavView  = false;
//var gf_mainSvcGbCd = '';  // 접속 디바이스 값이 정의 되어 있음 :: /main 에 정의됨
var mainSticky = {
    init: function(){
        document.removeEventListener('scroll',main_scroll);
        if(document.getElementsByTagName('html')[0].classList.contains('main')){
            if(document.getElementsByClassName('mainNav').length > 0){
                
                if(document.querySelector('.topFixedBanner')){
                    document.getElementsByTagName('html')[0].classList.add('topFixedBanner-on');
                }

                var mainNav = document.getElementsByClassName('mainNav')[0];
                var mainNav_top = mainNav.offsetTop;
                
                document.addEventListener('scroll',main_scroll);
                window.addEventListener('resize',main_scroll);
                function main_scroll(e){
                    mainSticky_action();
                }
                
                function mainSticky_action(){
                    var header_height = 56;
                    var scrollY = window.scrollY;
                    
                    if(document.querySelector('.topFixedBanner')){
                        var topBannerHeight = document.querySelector('.topFixedBanner').offsetHeight;
                        if(scrollY > topBannerHeight){
                            //document.getElementsByTagName('html')[0].classList.add('mainHeaderFix');
                        }else{
                            //document.getElementsByTagName('html')[0].classList.remove('mainHeaderFix');
                        }
                    }

                    

                    if(scrollY > mainNav_top - header_height){
                        document.getElementsByTagName('html')[0].classList.add('main-sticy')
                    }else{
                        document.getElementsByTagName('html')[0].classList.remove('main-sticy')
                    }
                    
                    /* 20210831 static에 없는 소스로 변경 */
                    /*
                    if(scrollY > (mainNav_top - header_height) + 220){
                        document.getElementsByTagName('html')[0].classList.add('searchWrapHide');
                        if(gf_mainSticky_NavView  == false && typeof(gf_mainSvcGbCd) != 'undefined' && gf_mainSvcGbCd == '30'  ){  // 앱인 경우만 실행
	               			 $('.mainNav').css('top', parseInt($('.mainNav').css('top'))-3 );
							 $('.sticky-goods-detail').css('top', parseInt($('.sticky-goods-detail').css('top'))-3 );
							 $('.sticky-main').css('top', parseInt($('.sticky-main').css('top'))-3 );
	               			 gf_mainSticky_NavView  = true;
	               		}
                    }else{
                        document.getElementsByTagName('html')[0].classList.remove('searchWrapHide');
                        gf_mainSticky_NavView  = false;
                    }
                    */
                    
                    if(scrollY > (mainNav_top - header_height) + 220){
                        document.getElementsByTagName('html')[0].classList.add('searchWrapHide');
                    }else{
                        document.getElementsByTagName('html')[0].classList.remove('searchWrapHide');
                    }
                    /*//20210831 static에 없는 소스로 변경 */
                }
                mainSticky_action();
            }
        }
    }
};

//포스팅뷰 컨트롤, 터치로 bottomUi 하단영역 올리고 내리고 하는거
var postingView_control = {
    init: function(){
        if(document.querySelectorAll('.postingView').length > 0){
            var bottomUi = document.querySelectorAll('.postingView .bottomUi')[0];
            var startPos = 0;
            var scrollStart = false;
            var boardView_posting = document.getElementsByClassName('boardView-posting');
            var bottomUi_scrollWrap = bottomUi.getElementsByClassName('scrollWrap')[0];
            var bottomUi_scrollTop = 0;
            var bottomUi_startYpos = 0;
            var bottomUi_maxHeight = 260;
            
            function defaultPos(){
                if(boardView_posting[0].offsetHeight > bottomUi_maxHeight){
                    bottomUi_startYpos = window.innerHeight - bottomUi_maxHeight - 55;
                }else{
                    bottomUi_startYpos = window.innerHeight - boardView_posting[0].offsetHeight - 55;
                }
                
                bottomUi.style.transform = 'translateY(' + bottomUi_startYpos + 'px)';
                document.querySelector('.gallery-swiper').style.height = document.querySelector('.gallery-swiper').offsetWidth + 'px';
            }
            setTimeout(function(){
                defaultPos();
                bottomUi.style.transition = '';
            },200)

        
            var dragState = false;

            document.addEventListener('touchend',touchEnd);
            bottomUi.addEventListener('touchstart',touchStart);
            document.addEventListener('touchmove',touchMove);
        }

        function touchStart(e){
            var localY = getComputedTranslateY(bottomUi);
            startPos = e.changedTouches[0].pageY - localY;
            bottomUi.classList.add('isDrag');
            dragState = true;
        }
        function touchEnd(e){
            bottomUi.classList.remove('isDrag');
            
            if(dragState && !scrollStart){
                var posY = e.changedTouches[0].pageY - startPos;
                var activePos;
                if(bottomUi.classList.contains('open')){
                    activePos = 20;
                }else{
                    activePos = 400;
                }
                if(posY < activePos){
                    bottomUi.style.transform = ''
                    bottomUi.classList.add('open');
                    var event = document.createEvent('Event');
                    event.initEvent('postingViewBottomUiOpen', true, true);
                    document.dispatchEvent(event);
                    scrollStart = true;
                }else{
                    bottomUi.style.transform = 'translateY(' + bottomUi_startYpos + 'px)';
                    bottomUi.classList.remove('open');
                    var event = document.createEvent('Event');
                    event.initEvent('postingViewBottomUiClose', true, true);
                    document.dispatchEvent(event);
                }
            }
            
            dragState = false;
        }
        function touchMove(e){
            var posY = e.changedTouches[0].pageY - startPos;
            if(bottomUi_scrollTop <= 0){
                if(posY > 50){
                    scrollStart = false;
                }
            }
            if(posY < bottomUi_startYpos){
                if(dragState && !scrollStart){
                    bottomUi.style.transform = 'translateY(' + posY + 'px)';
                }else{
                    
                }
            }
            bottomUi_scrollTop = bottomUi_scrollWrap.scrollTop;
        }
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

//상품상세 탭 누르면 탭 상단으로 스크롤이동 하게 하는거
var goodsDetailTabControl = {
    init: function(){
        if(document.querySelectorAll('.tab-a.goodsDetail + .tab-cont')[0]){
            var tab = document.querySelectorAll('.tab-a.goodsDetail>ul>li>a');
            Array.from(tab).forEach((elem, index) => {
                elem.addEventListener('click',function(e){
                    var posY = document.querySelectorAll('.tab-a.goodsDetail + .tab-cont')[0].offsetTop;
                    window.scrollTo(0,posY);
                    return false;
                })
            });
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
        
        for (i = 0; i < acc.length; i++) {
            var btn = acc[i].querySelectorAll(':scope > button')[0]
            var accordionPnnel = acc[i].nextElementSibling;
            if(btn){
                if(acc[i].classList.contains('orderProductInfo')){ //주문상품정보일 경우 accrodionPnnel이 그냥 auto상태
                    if(accordionPnnel){
                        accordionPnnel.style.height = 'auto'
                    }
                }else{
                    if(accordionPnnel){
                        if(acc[i].classList.contains('open')){
                            accordionPnnel.style.height = 'auto'
                        }else{
                            accordionPnnel.style.height = '0px'
                        }
                    }
                }
                
                
                
                btn.addEventListener("click", function() {
                    var acc_title = this.parentNode;

                    if (acc_title.classList.contains('disabled')) { // 비활성화 상태
                        return false; 
                    }

                    var accordionPnnel = acc_title.nextElementSibling;
                    if(acc_title.classList.contains('orderProductInfo')){
                        acc_title.classList.toggle('open');
                    }
                    else if(this.closest('.accordion-wrap')){//아코디언 한개만 열리게 컨트롤하는거 (accordion-wrap 로 감싸져있고 oneActive 클래스가 있을경우)
                        if(this.closest('.accordion-wrap').classList.contains('oneActive')){
                            var root = this.closest('.accordion-wrap');
                            var root_acc_title = root.getElementsByClassName('accordion-title');
                            var this_acc_title = this.closest('.accordion-title');
                            
                            if(root.classList.contains('oneActive')){
                            	for(var index = 0; index < root_acc_title.length; index++) {
									var elem = root_acc_title[index];
                           		 	var accordionPnnel = elem.nextElementSibling;
								
                            	//Array.from(root_acc_title).forEach((elem, index) => {
                                	//var accordionPnnel = elem.nextElementSibling;
                                
                                    
                                    
                                    
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
                                }//);
                            }
                        }    
                    }else{
                        acc_title.classList.toggle("open");
                        if(accordionPnnel){
                            var accordionPnnel_parent = accordionPnnel.parentElement.closest('.accordion-panel');
                            if(acc_title.classList.contains('open')){
                                accordionPnnel.style.height = accordionPnnel.scrollHeight + 'px'
                                this.innerText = '닫힘'
                            }else{
                                accordionPnnel.style.height = accordionPnnel.scrollHeight + 'px'
                                setTimeout(function(){
                                    accordionPnnel.style.height = '0px'
                                    this.innerText = '열림'
                                },30)
                            }

                            //아코디언 안에 아코디언 들어가있는경우 상위 아코디언 패널에 사이즈 재조정 하는거
                            if(accordionPnnel_parent){
                                accordionPnnel_parent.style.height = 'auto'
                                setTimeout(function(){
                                    accordionPnnel_parent.style.height = accordionPnnel_parent.scrollHeight + 'px';
                                },300)
                            }
                        }
                    }
                    
                    return false;
                });
            }
        }
    }
}



//툴팁 컨트롤
var tooltipControl = {
    init: function(){
        var currentTip;
        document.addEventListener('click',function(e){
            var target = e.target;

            if(e.target.classList.contains('tipIcon')){

                var tooltip = document.getElementsByClassName('tooltip');
                Array.from(tooltip).forEach((elem, index) => {
                    var tipIcon = elem.getElementsByClassName('tipIcon')[0];
                    tipIcon.classList.remove('on');
                })

                currentTip = target;
                currentTip.classList.add('on');
                var clientRect = target.getBoundingClientRect();
                var relativeTop = clientRect.top;
                var tipCont = target.nextElementSibling;
                if(tipCont){
                    tipCont.style.top = relativeTop + 20 + 'px';
                }
                
            }
        })
        var currentTip;
        document.addEventListener('click',function(e){
            var tooltip = e.target.closest('.tooltip');

            if(tooltip){
                if(e.target.classList.contains('btn-close')){
                    var tipCont = e.target.closest('.tipCont');
                    currentTip = tipCont;
                    tipCont.previousElementSibling.classList.remove('on');
                }    
            }else{
                if(currentTip){
                    currentTip.classList.remove('on');
                }
            }
            return false;
            
        })
        document.addEventListener('scroll',function(e){
            if(currentTip){
                currentTip.blur();
                currentTip.classList.remove('on');
            }
        })
    }
}

//아코디언형태 게시판 컨트롤
var boardReplyBoxControl = {
    init: function(){
        var boardReplyBox = document.getElementsByClassName('boardReplyBox');
        var prev_boardReplyBox;
        Array.from(boardReplyBox).forEach((elem, index) => {
            var list = elem.querySelectorAll(':scope > .list')[0];
            var cont = list.querySelectorAll(':scope > .cont')[0];
            
            elem.style.height = list.offsetHeight + 'px';
            cont.addEventListener('click',function(e){

                var boardReplyBox = e.target.closest('.boardReplyBox');
                var list = boardReplyBox.querySelectorAll(':scope > .list')[0];
                var reply = boardReplyBox.querySelectorAll(':scope > .reply')[0];
                var default_height = list.offsetHeight;
                var height = list.offsetHeight + reply.offsetHeight;
                boardReplyBox.classList.toggle('viewReply');
                if(boardReplyBox.classList.contains('viewReply')){
                    if(prev_boardReplyBox){
                        if(boardReplyBox != prev_boardReplyBox){
                            var prev_list = prev_boardReplyBox.querySelectorAll(':scope > .list')[0];
                            prev_list_default_height = prev_list.offsetHeight;
                            prev_boardReplyBox.classList.remove('viewReply')
                            prev_boardReplyBox.style.height = prev_list_default_height + 'px';    
                        }
                    }
                    boardReplyBox.style.height = height + 'px';
                }else{
                    boardReplyBox.style.height = default_height + 'px';
                }
                prev_boardReplyBox = boardReplyBox;
            })
        })

        // 수정삭제버튼 레이어 열고닫고 하는거
        var temp_ui;
        document.addEventListener('click',function(e){
            if(e.target.closest('.boardReplyBox')){
                var ui = e.target.closest('.ui');
                if(temp_ui){
                    temp_ui.classList.remove('open')
                }
                if(ui){
                    temp_ui = ui;
                    ui.classList.add('open')
                }
            }
        })
    }
}

//아코디언형태 게시판 컨트롤 a타입
var boardReplyBoxControl_a = {
    init: function(){
        var board_replayAccrodion = document.querySelector('.board-replayAccrodion');
        if(board_replayAccrodion){
            var prev_repBox;
            board_replayAccrodion.addEventListener('click',function(e){
                var repBox = e.target.closest('.boardReplyBox-a');
                if(repBox){
                    var repBox_list_height = repBox.querySelector('.list').offsetHeight;
                    var repBox_reply_height = 0
                    if(repBox.querySelector('.reply')){
                        repBox_reply_height = repBox.querySelector('.reply').offsetHeight;
                    }
                    var repBox_height = repBox_list_height + repBox_reply_height;
                    if(e.target.classList.contains('toggle')){
                        if(repBox.classList.contains('viewReply')){
                            repBox.style.height = repBox.dataset.defheight + 'px';
                            repBox.classList.remove('viewReply');
                        }else{
                            if(prev_repBox){
                                prev_repBox.style.height = prev_repBox.dataset.defheight + 'px';
                                console.log(prev_repBox.dataset.defheight)
                                prev_repBox.classList.remove('viewReply');
                            }
                            repBox.classList.add('viewReply');
                            repBox.style.height = repBox_height + 'px';
                            prev_repBox = repBox;
                        }
                    }
                }
                
            })
        }
    }
}

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

//스크롤 애니메이션
var scrollToAni = function(to, duration) {
    var element = document.scrollingElement || document.documentElement,
    start = element.scrollTop,
    change = to - start,
    startTs = performance.now(),
    easeInOutQuad = function(t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    },
    animateScroll = function(ts) {
        var currentTime = ts - startTs;
        element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
        if(currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
        else {
            element.scrollTop = to;
        }
    };
    requestAnimationFrame(animateScroll);
};

function topFixedBanner_close(){
    document.querySelector('.topFixedBanner').remove();
    document.getElementsByTagName('html')[0].classList.remove('topFixedBanner-on');
    document.getElementsByTagName('header')[0].style.transition = '';
    document.getElementsByTagName('header')[0].style.transform = ''
    mainSticky.init();
}

function swiperCountRander(e){
    var total = Math.floor(e.wrapperEl.childElementCount / 2) + 1;
    var active = e.realIndex + 1;
    e.el.querySelector('.paginationWrap .count').innerText = active + ' / ' + total;
}

function careTooltipClose(obj){
    obj.parentElement.style.display = 'none'
}
        
function filterOpen(){
    document.getElementsByClassName('prd-list-filter')[0].classList.add('open');
}
function filterClose(){
    document.getElementsByClassName('prd-list-filter')[0].classList.remove('open');
}
function categorySelectUi_layerOpen(){
    document.getElementsByClassName('categorySelectUi')[0].classList.toggle('layerOpen');
}
function categorySelectUi_layerClose(){
    document.getElementsByClassName('categorySelectUi')[0].classList.remove('layerOpen');
}



function getComputedTranslateY(obj)
{
    if(!window.getComputedStyle) return;
    var style = getComputedStyle(obj),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}

//객체 index 구하는거
function getChildNumber(node) {
    return Math.ceil(Array.prototype.indexOf.call(node.parentNode.childNodes, node)/2);
}

//y값 구하는거
function getPosY(element){ let posY = element.offsetTop; if(element.offsetParent){ posY += element.offsetParent.offsetTop; } return posY; }


/* 기존 */
// //팝업열기
// function popOpen(id){
//     document.getElementById(id).classList.add('open')
//     document.getElementsByTagName('html')[0].classList.add('layerPopOpen');
//     // 팝업 외부 클릭 시 닫기 이벤트 추가
//     document.addEventListener('click', outsideClickListener);
// }

// //팝업닫기
// function popClose(id){
//     document.getElementsByTagName('html')[0].classList.remove('layerPopOpen');
//     document.getElementById(id).classList.remove('open')
//     // 팝업 닫기 시 외부 클릭 이벤트 제거
//     document.removeEventListener('click', outsideClickListener);
// }
// // 팝업 외부 클릭
// function outsideClickListener(event) {
//     const popups = document.querySelectorAll('.layerPop');
//     const isClickedOutside = !popups.some(popup => popup.contains(event.target));

//     if (isClickedOutside) {
//         for (let i = 0; i < popups.length; i++) {
//             popups[i].classList.remove('open');
//         }
//         document.getElementsByTagName('html')[0].classList.remove('layerPopOpen');
//         document.removeEventListener('click', outsideClickListener);
//     }
// }


/* 변경 */
//팝업열기
function popOpen(id){
    document.getElementById(id).classList.add('open')
    document.getElementsByTagName('html')[0].classList.add('layerPopOpen');
    // 팝업 외부 클릭 시 닫기 이벤트 추가
    document.addEventListener('click', outsideClickListener);

    if (document.getElementById(id).classList.contains('type_bar')) { //bar 타입의 경우
        let startY;
        let isDragging = false;
        let popupHeight;

        const popup = document.getElementById(id).querySelector('.cont');
        const popupBtn = document.getElementById(id).querySelector('.btn-close');
        popup.style.height = 'auto';
        popup.style.padding = '40px 20px 20px 20px';

        popupBtn.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            popupHeight = popup.offsetHeight;
            isDragging = true;
        });
        popupBtn.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touchY = e.touches[0].clientY;
            const moveY = touchY - startY;
            if (moveY > 0) {
                popup.style.height = `${popupHeight - moveY}px`;
            }
        });
        popupBtn.addEventListener('touchend', (e) => {
            isDragging = false;
            const touchY = e.changedTouches[0].clientY;
            const moveY = touchY - startY;
            if (moveY > 150) {
                popup.style.height = '0';
                popup.style.padding = '0';
                setTimeout(() => {
                    popClose(id);
                }, 200);
            } else {
                popup.style.height = 'auto';
            }
        });
    }

}

//팝업닫기
function popClose(id){
    document.getElementsByTagName('html')[0].classList.remove('layerPopOpen');
    document.getElementById(id).classList.remove('open')
    // 팝업 닫기 시 외부 클릭 이벤트 제거
    document.removeEventListener('click', outsideClickListener);

}
// 팝업 외부 클릭
function outsideClickListener(event) {
    const popups = document.querySelectorAll('.layerPop.open');
    popups.forEach(popup => {
        const cont = popup.querySelector('.cont');
        if (cont && !cont.contains(event.target) && popup.contains(event.target)) {
            popClose(popup.id);
        }
    });
}



//상품상세 이미지 숨겨논거 보이게하는거
function imgmoreHide(obj){
    obj.closest('.goodsImgMoreArea').classList.add('full');
}

$(document).ready(function(){
	
    /* 20220620 결제 페이지 쿠폰적용 UI 개선 > 상품 쿠폰 할인 아코디언 스크립트 추가 */
	$('.acd-data-tit').on("click",function(e){
		e.preventDefault();
		if($(this).hasClass("on")){
			$(this).removeClass("on").parent().find('.acd-data-cont').removeClass('on').stop().slideUp(300);
		}else{
			$(this).addClass('on').parent().find('.acd-data-cont').addClass('on').stop().slideDown(300);
		}
	});

    // 20220722 케어페이지 리뉴얼 > tab-accordion.rad-type 클릭이벤트 추가
    $('.tab-a.rad-type li').on("click",function(e){
        e.preventDefault();
        if($(this).hasClass("on")){
            $(this).removeClass("on");  
        }else{
            $(this).addClass('on').siblings().removeClass("on");
        }
    });

    /* 20230102 브랜드샵, 검색결과, 아울렛 카테고리 개선 > 필터 디자인 개선 요청 */
    var accPanel = $('.list-accord').parent(); //.accordion-panel

	$('.list-accord .accord-title').on("click",function(e){
		e.preventDefault();
        var accList = $(this).parent();

        $(accPanel).css('height', 'auto'); //자식 .list-accord 내부 클릭 시 > 부모 .accordion-panel 높이값 auto로 설정

		if($(accList).hasClass("on")){
			$(accList).removeClass("on").children('.accord-cont').stop().slideUp(300);
		}else{
			$(accList).addClass('on').children('.accord-cont').stop().slideDown(300);
            /* $(accList).siblings().removeClass("on").find('.accord-cont').stop().slideUp(300);
            $(accList).siblings().find('li').removeClass("on");
            $(accList).siblings().find('input:checkbox').prop("checked", false); */
            if($(this).parents().hasClass("depth04")){
                
            }else{
                $(accList).siblings().removeClass("on").find('.accord-cont').stop().slideUp(300);
                $(accList).siblings().find('li').removeClass("on");
                $(accList).siblings().find('input:checkbox').prop("checked", false);
            }
		}
	});
    //부모 .accordion-title 토글 닫음 시 > 자식 .list-accord 설정값 리셋
    /* $(accPanel).prev('.accordion-title').on("click",function(e){
        $(accPanel).find('.list-accord li').removeClass("on").find('.accord-cont').stop().slideUp(300);
        $(accPanel).find('.list-accord li').removeClass("on");
        $(accPanel).find('.list-accord li').find('input:checkbox').prop("checked", false);
    });  */

    /* 20230131 #3007, #3039 MO > 에디토리얼 > 이미지 슬라이드, 상품목록 더보기 기능 추가 : 시작  */
    //각 이미지 슬라이드 영역 슬라이드 갯수 체크 후 적용
    $('.event-img-slider').each(function(){
        if($(this).find(".swiper-slide").length == 1) {
            $(this).addClass( "disabled" );   
        }
    })
    //각 이미지 슬라이드 영역 활성화
    var imgSlide = new Swiper('.event-img-slider', {
        //slidesPerView: 'auto',
        //watchOverflow: false,
        speed:500,
        loop:true,
        pagination: {
            el: '.swiper-pagination',
            type: 'progressbar',
        },
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false,
        // },
    });

	//전시상품 갯수에 따른 더보기 버튼 활성화 스크립트
	$('.unitList.moresee').each(function(){
		
		var listHeight2 = $(this).find('li:nth-child(2)').outerHeight(true);
		var listHeight4 = $(this).find('li:nth-child(4)').outerHeight(true);

       /*  var maxHeight = 0;
        $(this).find('ul li:nth-child(-n+4)').each(function() {
            var listHeight3 = $(this).outerHeight(true);
            if (listHeight3 > maxHeight) {
                maxHeight = listHeight3;
            }
        });
        console.log('가장 높은 값: ' + maxHeight); */
		
        if($(this).find("li").length >= 5) {
			$(this).find('ul').height(listHeight2 + listHeight4);
            //$(this).find('ul').height(maxHeight*2);
			$(this).find('ul').css({"overflow":"hidden"});
			$(this).find('.btnWrap').show();
			
		}else{
			$(this).find('ul').css({"height":"auto","overflow:":"visible"});
			$(this).find('.btnWrap').hide();
		}
		
	});

    //더보기 버튼, 닫기 버튼 클릭 이벤트
    $(".unitList.moresee .btnWrap").on('click',function(){ 
        var listHeight = $(this).find('li').outerHeight(true);

        $(this).prev('ul').css({"height":"auto","overflow:":"visible"});
        $(this).hide();
    });    
   /* //20230131 #3007, #3039 MO > 에디토리얼 > 이미지 슬라이드, 상품목록 더보기 기능 추가 : 끝  */

    // 20230608 #3782 상품상세 이미지에 코디상품 버튼 추가 스크립트
    $(".btn-anchor").click(function(e){
        e.preventDefault();
        //$("html, body").stop().animate({scrollTop: $($(this).attr("href")).offset().top - 10}, 1000);
        $("html, body").scrollTop($($(this).attr("href")).offset().top - 10);
    });

});