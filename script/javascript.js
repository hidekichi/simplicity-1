//閲覧履歴
(function($) {

	function prettyDate(time) {
		var
			date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);

		if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;

		return day_diff === 0 && (
				diff < 30 && "ほぼ今" ||
				diff < 60 && "ちょい前" ||
				diff < 120 && "1 分前" ||
				diff < 3600 && Math.floor(diff / 60) + " 分前" ||
				diff < 7200 && "1 時間前" ||
				diff < 86400 && Math.floor(diff / 3600) + " 時間前"
			) ||
			day_diff === 1 && "昨日" ||
			day_diff < 7 && day_diff + " 日前" ||
			day_diff < 31 && Math.ceil(day_diff / 7) + " 週間前";
	}

	var
		//object = localStorage.getItem('access_data') ? JSON.parse(localStorage.getItem('access_data')) : { items: [] };
		object = sessionStorage.getItem('access_data') ? JSON.parse(sessionStorage.getItem('access_data')) : { items: [] };

	var setLocalStorage = function(itemnum) {

		if ( $("body").hasClass("home") || $("body").hasClass("search") ) {
			return false;
		}

		var maxItem = parseInt(itemnum, 10);

		var
			thisUrl = window.location.href,
			url = thisUrl,
			entryTitle = $(".entry-title").text(),
			title = $.trim(entryTitle),
			thumb,
			modified;

		//アイキャッチがない場合はカラ
		if ($(".eye-catch").find("img").length) {
			var imgSrc = $(".eye-catch").find("img").attr("src"),
				reimgSrc = imgSrc.replace(".jpg", "-100x100.jpg");
			thumb = reimgSrc;
		}
		else {
			thumb = "/wp-content/themes/simplicity2/images/no-image.png";
		}

		//更新日時がある場合はそれ、ない場合は投稿時間
		var postmeta = $(".post-meta");
		if (postmeta.find(".post-update").length) {
			modified = $.trim(postmeta.find(".post-update").text());
		} else {
			modified = $.trim(postmeta.find(".post-date").text());
		}


		if ($("body").hasClass("home")) {
			title = "トップページ(ホーム)";
			modified = $.trim(postmeta.find(".post-date").first().text());
		}

		var
			archiveTitle = $("#archive-title").text(),
			trimArchiveTitle = archiveTitle.replace(/\n|\s+/g, "");
		if ($("body").hasClass("category") || $("body").hasClass("date")) {
			var cat_title = $.trim(trimArchiveTitle);
			title = "カテゴリ(" + cat_title + ")";
			modified = $.trim(postmeta.find(".post-date").first().text());
		}

		if ($("body").hasClass("tag")) {
			var tag_title = $.trim(trimArchiveTitle);
			title = "タグ(" + tag_title + ")";
			modified = $.trim(postmeta.find(".post-date").first().text());
		}

		//時間処理
		var d = new Date();
		var time = d.toLocaleString();

		//データ用意
		var data = {};
		data.url = url;
		data.title = title;
		data.thumb = thumb;
		data.modified = modified;
		data.time = time;

		if (object.items.length >= maxItem) {
			object.items.shift();
		}

		//データ追加
		object.items.push(data);

		//LSにデータ保管
		//window.localStorage.setItem("access_data", JSON.stringify(object));
		window.sessionStorage.setItem("access_data", JSON.stringify(object));

	};

	var getLocalStorage = function() {
		if (sessionStorage.getItem('access_data')) {
			//var json = JSON.parse(localStorage.getItem('access_data'));
			var json = JSON.parse(sessionStorage.getItem('access_data'));

			return json;
		}
	};

	//main
	$(function() {
		if ($("#b-history").length) {

			$(window).on("load", function() {
				setLocalStorage(5);
			});

			//リスト表示部分

			var target = $("#b-history"),
				json = getLocalStorage(),
				labeltext = "閲覧履歴";

			//ラベル設定
			if (!target.closest(".widget_text").children("h3").length && !target.closest(".widget_text").children("h3").text().trim.length) {
				target.closest(".widget_text")
					.prepend("<h3 class='widget_title sidebar_widget_title'>")
					.find(".sidebar_widget_title")
					.text(labeltext);
			}

			//リスト設定
			target.append("<ul>");

			var list = target.find("ul");

			var jdat = json.items;
			$.each(jdat, function(ji) {
				list
					.prepend("<li><a href='" + jdat[ji].url + "' title='" + jdat[ji].title + "'>" +
						"<div class='wrapper'>" +
						"<div class='thumb'><img src='" + jdat[ji].thumb + "' /></div>" +
						"<div class='title'>" + jdat[ji].title + "</div>" +
						"<div class='times'>" +
						"<div class='date'>" + jdat[ji].modified + "</div>" +
						"<div class='recTime' data-time='"+jdat[ji].time+"'>" + jdat[ji].time + "</div>" +
						"</div>" +
						"</div></a></li>");
			});

			var recTime = $(".recTime");
			recTime.each(function(i){
				var time = recTime.eq(i).attr("data-time");
				var relativeTime = prettyDate(time);
				$(this).html(relativeTime + "に<span class='rec'>REC.</span>");
			});

			if ( localStorage.getItem("access_data") ) {
				$("#b-history").after("<div class='clearStorage'>Clear LocalStorage Data</div>");
			}

			var transitionEnd = 'webkitTransitionEnd oTransitionEnd transitionend';
			$(".clearStorage").on("click", function(){
				localStorage.removeItem("access_data");
				$(this).addClass("del");
			}).one(transitionEnd, function(){
				$(this).addClass("del2");
				setTimeout(function(){
					$(this).remove();
				},800);
			});

		}
	});
})(jQuery);
