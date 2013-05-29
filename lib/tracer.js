(function() {
//	var start = new Date().getTime();

    // [Browser detect] http://www.quirksmode.org/js/detect.html
	var BrowserDetect = {
		init: function() {
			this.browser = this.searchString(this.dataBrowser)||"unknown browser";
			this.version = this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"unknown version";
			this.OS = this.searchString(this.dataOS)||"unknown OS";
		},
		searchString: function(data) {
			var size = data.length;
			for (var i = 0; i < size; i++) {
				var dataString = data[i].string, dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch||data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1) { return data[i].identity; }
				} else if (dataProp) {
					return data[i].identity;
				}
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) { return; }
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{
				string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera",
				versionSearch: "Version"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS: [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				 string: navigator.userAgent,
				 subString: "iPhone",
				 identity: "iPhone/iPod"
			},
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]
	};
	BrowserDetect.init();

	var win = window, doc = document, displayed = -1, limit = doc.body.clientHeight - 30;
	var category = BrowserDetect.browser; category += ' '; category += BrowserDetect.version; category += ' / '; category += BrowserDetect.OS;

	var Trace = {
		run: function() {
			this.add(document, 'scroll', function() {
				if (displayed == 'bottom') { return; }
				var self = this, position = win.pageYOffset;
				if (position) {
					position += self.documentElement.clientHeight;
				} else {
					var element = self.documentElement;
					position = (self.body.scrollTop||element.scrollTop||0) + element.clientHeight;
				}
				if (displayed < position) {
					displayed = (position < limit ? position : 'bottom');
				} 
			});
			this.add(win, 'unload', function() {
				if (displayed == 'bottom') {
					Trace.script('scroll', 'bottom');
				} else {
					Trace.script('scroll', 'document', displayed);
				}
			});
		},
		label: function(element, attributes) { // data-trace-label
			var dataset = element.dataset;
			var label = (dataset ? dataset.traceLabel : element.getAttribute('data-trace-label'));
			if (!label) {
				label = element.tagName.toLowerCase();
				if (attributes) {
					var i = attributes.length, s = '';
					while (i--) {
						s = element.getAttribute(attributes[i]);
						if (s) { label += ' '; label += attributes[i]; label += '="'; label += s; label += '"'; }
					}
				}
				var html = element.innerHTML;
				var text = html.replace(/<\/?[^>]+>/gi, '').replace(/^\s+|\s+$/, '').replace(/\s+/g, ' ');
				text = text||html.replace(/<img[^>]*\s+alt=['"]([^'"]+)['"][^>]*>/gi, '$1 ').replace(/\s+$/, '');
				if (text) { label += ' > '; label+= text; }
			}
			return label;
		},
		object: function(target, action, options) {
//			var f = function() {
//				var self = target, label = Trace.label(self, options);
//				Trace.script(action, label);
//			};
//            this.add(target, action, f);
			this.add(target, action, function() {
				var self = this, label = Trace.label(self, options);
				Trace.script(action, label);
			});
		},
		form: function(target, action) {
			this.add(target, action, function() {
				var self = this;
				var label = 'form action="'; label += self.form.action; label += '" > ';
				label += Trace.label(self, ['value', 'name', 'type']);
				Trace.script(action, label);
			});
		},
		add: function(target, type, listener) {
			if (target.addEventListener) {
				target.addEventListener(type, listener, false);
			} else {
				target.attachEvent('on'+type, listener);
			}
		},
		script: function(action, label, value) {
			//console.log("_gaq.push(['_trackEvent', "+ category +", "+ action +", "+ label +", "+ (value||1) + ", true]);");
			_gaq.push(['_trackEvent', category, action, label, (value||1), true]);
		}
	};

    // TODO JavaScript であとから追加された要素への対応
	// Click
	var elements = doc.getElementsByTagName('a');
	var i = elements.length;
	while (i--) { Trace.object(elements[i], 'click', ['href']); }
	elements = doc.getElementsByTagName('button');
	i = elements.length;
	while (i--) { Trace.object(elements[i], 'click'); }
	elements = doc.getElementsByTagName('label');
	i = elements.length;
	while (i--) { Trace.object(elements[i], 'click'); }
	elements = doc.getElementsByTagName('img');
	i = elements.length;
	while (i--) { Trace.object(elements[i], 'click', ['src', 'alt']); }

	// Trace <form> objects
	elements = doc.getElementsByTagName('input');
	i = elements.length;
	while (i--) {
		if (elements[i].getAttribute('type').toLowerCase() == 'submit') {
			Trace.form(elements[i], 'click');
		} else {
			Trace.form(elements[i], 'focus');
			Trace.form(elements[i], 'change');
		}
	}
	elements = doc.getElementsByTagName('textarea');
	i = elements.length;
	while (i--) {
		Trace.form(elements[i], 'focus');
		Trace.form(elements[i], 'change');
	}
	elements = doc.getElementsByTagName('select');
	i = elements.length;
	while (i--) {
		Trace.form(elements[i], 'focus');
		Trace.form(elements[i], 'change');
	}

	Trace.run();

//	var end = new Date().getTime();
//	console.log(end-start);
})();
