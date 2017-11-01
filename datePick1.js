    "use strict";
    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var datePick = function () {
        function datePick(options) {
            _classCallCheck(this, datePick);

            this.init(options);
        }

        _createClass(datePick, [{
            key: 'init',
            value: function init(options) {
                this.callback = options.callback || function () {
                    };
                this.render();
            }
        }, {
            key: 'bind',
            value: function bind() {
                var _this = this;
                $('.Pop-box').forEach(function (item, i) {
                    var $dom = $('.b-ul').eq(i),
                        $itemHeight = $dom.find('.item-on').height(),
                        star = '',
                        lastTime = '',
                        lastmoveStar = '',
                        dur = '',
                        end = '',
                        dy = '',
                        $maxheight = '',
                         stopInertiaMove = '';
                    $dom[0].addEventListener('touchstart', function (e) {
                        var a = $dom.css("transform");
                        dy = a.match(/\-?[0-9]+\.?[0-9]*/g)[2];
                        $maxheight = $dom.height()-180;
                        e.preventDefault();
                        lastmoveStar = star = e.touches[0].clientY;
                        lastTime = e.timeStamp || Date.now();
                        stopInertiaMove = true;
                    });
                    $dom[0].addEventListener('touchmove', function (e) {
                        e.preventDefault();
                        end = e.touches[0].clientY;
                        dur = end - star + parseInt(dy);
                        $dom.css('transform', 'translate3d(0,'+ dur +'px,0)');
                        stopInertiaMove = true;
                        var nowTime = e.timeStamp || Date.now();
                        if(nowTime - lastTime > 300){
                            lastTime = nowTime;
                            lastmoveStar = end;
                        }
                    });
                    $dom[0].addEventListener('touchend', function (e) {
                        e.preventDefault();
                        var nowY = e.changedTouches[0].pageY;
                        var nowTime = e.timeStamp || Date.now();
                        var v = (nowY - lastmoveStar) / (nowTime - lastTime);
                        stopInertiaMove = false;
                        (function(v, startTime, dur,e) {
                            var dir = v > 0 ? -1 : 1; //加速度方向
                            var deceleration = dir*0.0006;
                            var duration = Math.abs(v / deceleration); // 速度消减至0所需时间
                            var dist = v * duration / 2; //最终移动多少
                            function inertiaMove() {
                                if(stopInertiaMove) return;
                                var nowTime = new Date().getTime();
                                var t = nowTime - startTime;
                                var nowV = v + 10*deceleration;
                                // 速度方向变化表示速度达到0了
                                duration = duration-50;
                                _this.slowSpeed(i,$itemHeight);

                                if(duration < 0) {
                                    if(dur % 36 != 0){
                                        dur = Math.round(dur/36) * 36;
                                    }
                                    $dom.css('transform', 'translate3d(0,'+ dur +'px,0)');
                                    if(dur >= 0){
                                        $dom.css('transform', 'translate3d(0,'+ 0 +'px,0)');
                                    }else if(dur <= -$maxheight){
                                        $dom.css('transform', 'translate3d(0,'+ -$maxheight +'px,0)');
                                    }
                                    _this.swipe(i);
                                    return;
                                }
                                var moveY = (v + nowV)/2 * 10;
                                dur = (dur + moveY);
                                $dom.css('transform', 'translate3d(0,'+ dur +'px,0)');
                                if(dur >= 0){
                                    $dom.css('transform', 'translate3d(0,'+ 0 +'px,0)');
                                }else if(dur <= -$maxheight){
                                    $dom.css('transform', 'translate3d(0,'+ -$maxheight +'px,0)');
                                }
                                setTimeout(inertiaMove, 10);
                            }
                            inertiaMove();
                        })(v,nowTime,dur);

                    });
                });
                $('.lekePop').click(function () {
                    _this.swipeOut();
                });
            }
        }, {
            key: 'slowSpeed',
            value: function slowSpeed(i,$itemHeight) {
                var $bUl = $('.b-ul').eq(i),
                    a = $bUl.css("transform"),
                    $dy = a.match(/\-?[0-9]+\.?[0-9]*/g)[2],
                //获取初始transform值
                    _this = this;
                $dy = Math.round($dy / $itemHeight) * $itemHeight;
                var $index = Math.abs(Math.round($dy / $itemHeight));
                $bUl.find('.item').removeClass('item-on');
                $bUl.find('.item').eq($index).addClass('item-on');
            }
        }, {
            key: 'swipeOut',
            value: function swipeOut() {
                $('.lekePop').animate({
                    background: 'rgba(0,0,0,0)',
                    top: '100%',
                    bottom: '-180px'
                }, 1000, 'ease-out');
                var arr = [];
                var _this = this;
                $('.item-on').forEach(function (item, i) {
                    arr.push($(item).html());
                });
                this.callback(arr);
            }
        }, {
            key: 'swipeIn',
            value: function swipeIn() {
                $('.lekePop').animate({
                    background: 'rgba(0,0,0,0.6)',
                    top: '0',
                    bottom: '0'
                }, 1000, 'ease-out');
            }
        }, {
            key: 'render',
            value: function render() {
                var _date = new Date(),
                    nowYear = _date.getFullYear(),
                    nowMonth = _date.getMonth() + 1,
                    allDay = new Date(nowYear, nowMonth, 0).getDate(),
                    nowDay = _date.getDate(),
                    doms = '<div class="lekePop"></div>';
                $('body').append(doms);
                /*年份渲染*/
                this.renderList(nowYear, 1900, 2900, 'y');
                /*月份渲染*/
                this.renderList(nowMonth, 1, 12, 'm');
                /*日渲染*/
                this.renderList(nowDay, 1, allDay, 'd');
                this.bind();
            }
        }, {
            key: 'swipe',
            value: function swipe(i) {
                switch (i) {
                    case 0:
                        var nowYear = $('.item-on').eq(0).html();
                        var nowMonth = $('.item-on').eq(1).html();
                        var allDay = new Date(nowYear, nowMonth, 0).getDate();
                        this.swipeChange(allDay, 'y');
                        break;
                    case 1:
                        var nowYear = $('.item-on').eq(0).html();
                        var nowMonth = $('.item-on').eq(1).html();
                        var allDay = new Date(nowYear, nowMonth, 0).getDate();
                        this.swipeChange(allDay, 'm');
                        break;
                    case 2:
                        break;

                }
                ;
            }
        }, {
            key: 'renderList',
            /*渲染列表函数*/
            value: function renderList(nowNum, star, end, type) {
                var type = type || '',
                    list = '',
                    num = 0;
                for (var i = star; i <= end; i++) {
                    if (i == nowNum) {
                        num = nowNum - star;
                        list += '<li class="item item-on">' + i + '</li>';
                    } else {
                        list += '<li class="item">' + i + '</li>';
                    }
                }
                var doms = '<div class="Pop-box ' + type + '"><p class="Pop-box-tar"></p><ul class="b-ul" style="transform:translate3d(0,' + (0 - num * 36) + 'px,0)">' + list + '</ul></div>';
                $('.lekePop').append(doms);
                /*动态计算list数量然后定义宽度*/
                var $width = 1 / $('.Pop-box').length * 100;
                $('.Pop-box').forEach(function (item, i) {
                    $('.Pop-box').eq(i).css({'width': $width + '%', 'float': 'left', 'left': $width * i + '%'});
                });
            }
        }, {
            key: 'swipeChange',
            /*滑动后替换数据*/
            value: function swipeChange(end, string) {
                var allDay = end;
                var nowDay = $('.item-on').eq(2).html();
                var list = '';
                for (var i = 1; i <= allDay; i++) {
                    if (i == nowDay) {
                        list += '<li class="item item-on">' + i + '</li>';
                    } else {
                        list += '<li class="item">' + i + '</li>';
                    }
                }
                $('.b-ul').eq(2).empty().append(list);
                if (nowDay >= allDay) {
                    var $distance = (allDay-1) * 36;
                    setTimeout(function(){
                        $('.b-ul').eq(2).css('transform', 'translate3d(0,-' + $distance + 'px,0');
                    },100)
                    $('.b-ul').eq(2).find('.item').eq(allDay - 1).addClass('item-on');
                }
            }
        }]);

        return datePick;
    }();
