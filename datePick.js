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
                    var startTy = void 0,
                        startOriginTy = void 0,
                        endTy = void 0,
                        $bUl = $('.b-ul').eq(i),
                        lTapTimer = void 0,
                        lDurTimer = void 0,
                        a = $bUl.css("transform"),
                        $itemHeight = $bUl.find('.item-on').height(),
                        $maxheight = $bUl.height(),
                        dy = a.match(/\-?[0-9]+\.?[0-9]*/g)[0]; //获取初始transform值
                    $bUl[0].addEventListener('touchstart', function (e) {
                        $maxheight = $bUl.height();
                        e.preventDefault();
                        lTapTimer = new Date().getTime();
                        var touches = e.touches[0];
                        startOriginTy = startTy = touches.clientY;
                    });
                    $bUl[0].addEventListener('touchmove', function (e) {
                        e.preventDefault();
                        var touches = e.touches[0];
                        endTy = touches.clientY;
                        /*判断手势方向*/
                        if (startTy >= endTy) {
                            /*手势向上*/
                            var sum = parseInt(startTy - endTy);
                            sum += parseInt(startTy - endTy);
                            dy = dy > 180 - $maxheight ? parseInt(dy) - sum : 180 - $maxheight;
                            $bUl.css('transform', 'translateY(' + dy + 'px)');
                        } else {
                            /*手势向下*/
                            var sum = parseInt(endTy - startTy);
                            sum += parseInt(endTy - startTy);
                            dy = dy < 0 ? parseInt(dy) + sum : 0;
                            $bUl.css('transform', 'translateY(' + dy + 'px)');
                        }
                        startTy = touches.clientY;
                    });
                    $bUl[0].addEventListener('touchend', function (e) {
                        lDurTimer = new Date().getTime() - lTapTimer;
                        e.preventDefault();
                        $bUl.find('.item').removeClass('item-on');
                        _this.slowSpeed(parseInt(startOriginTy - endTy) / lDurTimer, i, $itemHeight);
                    });
                });
                $('.lekePop').click(function () {
                    _this.swipeOut();
                });
            }
        }, {
            key: 'slowSpeed',
            value: function slowSpeed(speed, i, $itemHeight) {
                var $bUl = $('.b-ul').eq(i),
                    a = $bUl.css("transform"),
                    $maxheight = $bUl.height(),
                    dy = a.match(/\-?[0-9]+\.?[0-9]*/g)[0],
                //获取初始transform值
                    $duSpeed = Math.abs(speed / 30),
                    $duration = speed * 0.3 + $duSpeed * $duSpeed * 0.3 / 2,
                    _this = this;
                if (speed >= 0) {
                    dy = dy > 180 - $maxheight ? parseInt(dy) + $duration * 2 : 180 - $maxheight;
                } else {
                    dy = dy < 0 ? parseInt(dy) - $duration * 2 : 0;
                }
                dy = Math.round(dy / $itemHeight) * $itemHeight;
                var $index = Math.abs(Math.round(dy / $itemHeight));
                $bUl.find('.item').eq($index).addClass('item-on');
                $bUl.css('transform', 'translateY(' + dy + 'px)');
                _this.swipe(i);
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
                var doms = '<div class="Pop-box ' + type + '"><p class="Pop-box-tar"></p><ul class="b-ul" style="transform:translateY(' + (0 - num * 36) + 'px)">' + list + '</ul></div>';
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
                    $('.b-ul').eq(2).css('transform', 'translateY(' + -(allDay - 1) * 36 + 'px)');
                    $('.b-ul').eq(2).find('.item').eq(allDay - 1).addClass('item-on');
                }
            }
        }]);

        return datePick;
    }();
