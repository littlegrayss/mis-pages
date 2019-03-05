var $$ = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};
var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        }
    }
}
Object.extend = function (destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}
var Calendar = Class.create();
Calendar.prototype = {
    initialize: function (container, options) {
        this.Container = $$(container); //瀹瑰櫒(table缁撴瀯)
        this.Days = []; //鏃ユ湡瀵硅薄鍒楄〃
        this.SetOptions(options);
        this.Year = this.options.Year;
        this.Month = this.options.Month;
        this.onToday = this.options.onToday;
        this.onSignIn = this.options.onSignIn;
        this.onFinish = this.options.onFinish;
        this.qdDay = this.options.qdDay;
        this.isSignIn = false;
        this.Draw();
    },
    //璁剧疆榛樿灞炴€�
    SetOptions: function (options) {
        this.options = { //榛樿鍊�
            Year: new Date().getFullYear(), //鏄剧ず骞�
            Month: new Date().getMonth() + 1, //鏄剧ず鏈�
            qdDay: null,
            onToday: function () { }, //宸茬鍒�
            onSignIn: function () { }, //浠婂ぉ鏄惁绛惧埌
            onFinish: function () { } //鏃ュ巻鐢诲畬鍚庤Е鍙�
        };
        Object.extend(this.options, options || {});
    },
    //涓婁竴涓湀
    PreMonth: function () {
        //鍏堝彇寰椾笂涓€涓湀鐨勬棩鏈熷璞�
        var d = new Date(this.Year, this.Month - 2, 1);
        //鍐嶈缃睘鎬�
        this.Year = d.getFullYear();
        this.Month = d.getMonth() + 1;
        //閲嶆柊鐢绘棩鍘�
        this.Draw();
    },
    //涓嬩竴涓湀
    NextMonth: function () {
        var d = new Date(this.Year, this.Month, 1);
        this.Year = d.getFullYear();
        this.Month = d.getMonth() + 1;
        this.Draw();
    },
    //鐢绘棩鍘�
    Draw: function () {
        //绛惧埌鏃ユ湡
        var day = this.qdDay;
        //鏃ユ湡鍒楄〃
        var arr = [];
        //鐢ㄥ綋鏈堢涓€澶╁湪涓€鍛ㄤ腑鐨勬棩鏈熷€间綔涓哄綋鏈堢绗竴澶╃殑澶╂暟
        for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
            arr.push("&nbsp;");
        }
        //鐢ㄥ綋鏈堟渶鍚庝竴澶╁湪涓€涓湀涓殑鏃ユ湡鍊间綔涓哄綋鏈堢殑澶╂暟
        for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
            arr.push(i);
        }
        var frag = document.createDocumentFragment();
        this.Days = [];
        while (arr.length > 0) {
            //姣忎釜鏄熸湡鎻掑叆涓€涓猼r
            var row = document.createElement("tr");
            //姣忎釜鏄熸湡鏈�7澶�
            for (var i = 1; i <= 7; i++) {
                var cell = document.createElement("td");
                cell.innerHTML = "&nbsp;";
                if (arr.length > 0) {
                    var d = arr.shift();
                    cell.innerHTML = "<span>" + d + "</span>";
                    if (d > 0 && day.length) {
                        for (var ii = 0; ii < day.length; ii++) {
                            this.Days[d] = cell;
                            //宸茬鍒�
                            if (this.IsSame(new Date(this.Year, this.Month - 1, d), day[ii])) {
                                this.onToday(cell);
                            }
                            //鍒ゆ柇浠婂ぉ鏄惁绛惧埌
                            if (this.checkSignIn(new Date(), day[ii])) {
                                this.onSignIn();
                            }
                        }
                    }
                }
                row.appendChild(cell);
            }
            frag.appendChild(row);
        }
        //鍏堟竻绌哄唴瀹瑰啀鎻掑叆(ie鐨則able涓嶈兘鐢╥nnerHTML)
        while (this.Container.hasChildNodes()) {
            this.Container.removeChild(this.Container.firstChild);
        }
        this.Container.appendChild(frag);
        this.onFinish();
        if (this.isSignIn) {
            this.isSignIn = false;
            return this.SignIn();
        }
    },
    //鏄惁绛惧埌
    IsSame: function (d1, d2) {
        d2 = new Date(d2 * 1000);
        return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
    },
    //浠婂ぉ鏄惁绛惧埌
    checkSignIn: function (d1, d2) {
        d2 = new Date(d2 * 1000);
        return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
    },
    //绛惧埌
    SignIn: function () {
        var now = new Date();
        var Year = now.getFullYear();
        var Month = now.getMonth() + 1;
        if (Year != this.Year || Month != this.Month) {
            this.Year = Year;
            this.Month = Month;
            this.isSignIn = true;
            return this.Draw();
        }
        var day = now.getDate();
        var arr = new Array();
        var tb = document.getElementById('idCalendar');
        for (var i = 0; i < tb.rows.length; i++) {
            for (var j = 0; j < tb.rows[i].cells.length; j++) {
                if (day == tb.rows[i].cells[j].innerText && Year == this.Year && Month == this.Month) {
                    if (tb.rows[i].cells[j].className == "onToday") {
                        return 2;
                    }
                    tb.rows[i].cells[j].className = "onToday"
                    this.qdDay.push(Date.parse(new Date()) / 1000)
                    return 1;

                }
            }
        }
    }
};
