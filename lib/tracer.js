(function(w,d,t,e,c,a,i) {
	e=w[e];
	var displayed=-1,limit=d.body.clientHeight-30;

	var Trace = {
		run: function() {
			this.add(document, 'scroll', function() {
				if (displayed == 'bottom') { return; }
				var self = this, position = w.pageYOffset;
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
			this.add(w, 'unload', function() {
				if (displayed == 'bottom') {
					w[e]('document', 'scroll', 'bottom');
				} else {
					w[e]('document', 'scroll', 'position', displayed);
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
			this.add(target, action, function() {
				var self = this, label = Trace.label(self, options);
				w[e](target.tagName, action, label);
			});
		},
		form: function(target, action) {
			this.add(target, action, function() {
				var self = this;
				var label = 'form action="'; label += self.form.action; label += '" > ';
				label += Trace.label(self, ['value', 'name', 'type']);
				w[e]('form', action, label);
			});
		},
		add: function(target, type, listener) {
			if (target.addEventListener) {
				target.addEventListener(type, listener, false);
			} else {
				target.attachEvent('on'+type, listener);
			}
		}
	};

    // TODO JavaScript であとから追加された要素への対応
	w.onload = function() {
		a = d.getElementsByTagName('a');
		i = a.length;
		while (i--) { Trace.object(a[i], 'click', ['href']); }
		a = d.getElementsByTagName('button');
		i = a.length;
		while (i--) { Trace.object(a[i], 'click'); }
		a = d.getElementsByTagName('label');
		i = a.length;
		while (i--) { Trace.object(a[i], 'click'); }
		a = d.getElementsByTagName('img');
		i = a.length;
		while (i--) { Trace.object(a[i], 'click', ['src', 'alt']); }
		a = d.getElementsByTagName('input');
		i = a.length;
		while (i--) {
			if (a[i].getAttribute('type').toLowerCase() == 'submit') {
				Trace.form(a[i], 'click');
			} else {
				Trace.form(a[i], 'focus');
				Trace.form(a[i], 'change');
			}
		}
		a = d.getElementsByTagName('textarea');
		i = a.length;
		while (i--) {
			Trace.form(a[i], 'focus');
			Trace.form(a[i], 'change');
		}
		a = d.getElementsByTagName('select');
		i = a.length;
		while (i--) {
			Trace.form(a[i], 'focus');
			Trace.form(a[i], 'change');
		}
		Trace.run();
	}
})(window,document,new Date(),'TracerObject');
