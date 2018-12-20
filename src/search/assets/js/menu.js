function (e, r, t) {
	"use strict";
	t.d(r, "b", function () {
		return M
	});
	var n = t(3);
	var a = t.n(n);
	var s = t(5);
	var l = t.n(s);
	var i = t(6);
	var o = t.n(i);
	var u = t(7);
	var c = t.n(u);
	var d = t(8);
	var h = t.n(d);
	var _ = t(129);
	var f = t(1);
	var m = t.n(f);
	var v = t(2);
	var p = t.n(v);
	var g = t(15);
	var b = t.n(g);
	var R = t(17);
	var y = t(177);
	var w = t(2181);
	var k = t(314);
	var j = t(649);
	var O = t(774);
	var E = t(1518);
	var S = t.n(E);
	var x = {
		children: _["b"].arrayOf(_["b"].node).isRequired,
		menuClassNames: _["b"].string,
		onMenuItemSelected: _["b"].func,
		onMouseEnterMenuItem: _["b"].func,
		onTriggerClose: _["b"].func,
		noMargin: _["b"].bool,
		width: _["b"].oneOfType([_["b"].number, _["b"].string]),
		kbNavActive: _["b"].bool,
		stripTerminalSeparators: _["b"].bool,
		temporaryCustomStatusOverrideMakeMenuInaccessibleForKeyboard: _["b"].bool,
		preventHighlightChange: _["b"].func,
		allowHighlightChange: _["b"].func
	};
	var T = {
		menuClassNames: void 0,
		onMenuItemSelected: v["noop"],
		onMouseEnterMenuItem: v["noop"],
		onTriggerClose: v["noop"],
		width: 300,
		noMargin: false,
		kbNavActive: true,
		stripTerminalSeparators: false,
		temporaryCustomStatusOverrideMakeMenuInaccessibleForKeyboard: void 0,
		preventHighlightChange: v["noop"],
		allowHighlightChange: v["noop"]
	};

	function I(e) {
		var r = e && e.type;
		return r && Object(j["c"])(r)
	}

	function C(e) {
		var r = e && e.type;
		return r && Object(w["b"])(r)
	}

	function N(e) {
		var r = e && e.type;
		return r && Object(O["b"])(r)
	}
	var A = 0;

	function M() {
		return A > 0
	}
	var q = function (e) {
		h()(r, e);

		function r(e) {
			l()(this, r);
			var t = c()(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e));
			t.state = {
				highlightedMenuItemIndex: -1,
				contingentHighlightedMenuItemIndex: -1,
				kbNavActive: t.props.kbNavActive,
				highlightCanChangeOnMouseMovement: true
			};
			t.setAriaMenuRef = t.setAriaMenuRef.bind(t);
			t.onMouseLeaveMenu = t.onMouseLeaveMenu.bind(t);
			t.onMenuItemSelected = t.onMenuItemSelected.bind(t);
			t.activeMenuId = "menu-" + Object(k["a"])();
			return t
		}
		o()(r, [{
			key: "componentDidMount",
			value: function e() {
				if (this.state.kbNavActive && !this.props.temporaryCustomStatusOverrideMakeMenuInaccessibleForKeyboard) {
					this.bindKeyCommands();
					this.ariaMenuNode.focus()
				}
				A += 1
			}
		}, {
			key: "componentWillReceiveProps",
			value: function e(r) {
				this.props.kbNavActive !== r.kbNavActive && r.kbNavActive !== this.state.kbNavActive && (r.kbNavActive ? this.activateKBNav() : this.deactivateKBNav())
			}
		}, {
			key: "componentWillUnmount",
			value: function e() {
				this.keyCommands && this.keyCommands.reset();
				A -= 1
			}
		}, {
			key: "onArrowKey",
			value: function e(r, t) {
				if (this.props.temporaryCustomStatusOverrideMakeMenuInaccessibleForKeyboard) return;
				t && t.preventDefault && t.preventDefault();
				var n = this.getIndexOfNextMenuItemInDirection(r);
				this.setState(function () {
					return {
						highlightedMenuItemIndex: n
					}
				})
			}
		}, {
			key: "onMenuItemSelected",
			value: function e(r, t) {
				this.props.onMenuItemSelected(r, t)
			}
		}, {
			key: "onMouseLeaveMenu",
			value: function e() {
				var r = this.state.highlightCanChangeOnMouseMovement ? -1 : this.state.highlightedMenuItemIndex;
				this.setState(function () {
					return {
						highlightedMenuItemIndex: r,
						contingentHighlightedMenuItemIndex: -1
					}
				})
			}
		}, {
			key: "onMouseEnterMenuItem",
			value: function e(r) {
				var t = this.state.highlightCanChangeOnMouseMovement ? r : this.state.highlightedMenuItemIndex;
				this.setState(function () {
					return {
						highlightedMenuItemIndex: t,
						contingentHighlightedMenuItemIndex: r
					}
				});
				if (!this.state.highlightCanChangeOnMouseMovement) return;
				this.props.onMouseEnterMenuItem();
				this.state.kbNavActive || this.activateKBNav()
			}
		}, {
			key: "getAllMenuItemIndices",
			value: function e() {
				var r = [];
				m.a.Children.toArray(this.props.children).forEach(function (e, t) {
					(I(e) || C(e)) && r.push(t)
				});
				return r
			}
		}, {
			key: "getIndexOfNextMenuItemInDirection",
			value: function e(r) {
				var t = this.getAllMenuItemIndices();
				var n = t.indexOf(this.state.highlightedMenuItemIndex);
				var a = t.length - 1;
				if ("down" === r) {
					var s = n < a ? n + 1 : 0;
					return t[s]
				}
				var l = n - 1 >= 0 ? n - 1 : a;
				return t[l]
			}
		}, {
			key: "setAriaMenuRef",
			value: function e(r) {
				this.ariaMenuNode = r
			}
		}, {
			key: "activateKBNav",
			value: function e() {
				var r = this;
				this.ariaMenuNode.focus();
				this.setState(function (e) {
					return {
						kbNavActive: true,
						highlightedMenuItemIndex: -1 === e.highlightedMenuItemIndex ? r.getIndexOfNextMenuItemInDirection("down") : e.highlightedMenuItemIndex
					}
				}, this.bindKeyCommands)
			}
		}, {
			key: "deactivateKBNav",
			value: function e() {
				this.ariaMenuNode.blur();
				this.keyCommands && this.keyCommands.reset();
				this.setState(function () {
					return {
						kbNavActive: false
					}
				})
			}
		}, {
			key: "preventHighlightChange",
			value: function e() {
				this.setState(function () {
					return {
						highlightCanChangeOnMouseMovement: false
					}
				});
				this.props.preventHighlightChange && this.props.preventHighlightChange()
			}
		}, {
			key: "allowHighlightChange",
			value: function e() {
				this.setState(function (e) {
					return {
						highlightedMenuItemIndex: e.contingentHighlightedMenuItemIndex,
						highlightCanChangeOnMouseMovement: true
					}
				});
				this.props.allowHighlightChange && this.props.allowHighlightChange()
			}
		}, {
			key: "bindKeyCommands",
			value: function e() {
				var r = [{
					keys: ["up", "shift+up", "shift+tab"],
					handler: this.onArrowKey.bind(this, "up")
				}, {
					keys: ["down", "shift+down", "tab"],
					handler: this.onArrowKey.bind(this, "down")
				}, {
					keys: ["esc"],
					handler: this.props.onTriggerClose
				}];
				this.keyCommands || (this.keyCommands = new y["a"]);
				this.keyCommands.bindAll(r)
			}
		}, {
			key: "renderMenuItem",
			value: function e(r, t) {
				var n = this.onMouseEnterMenuItem.bind(this, t);
				var s = this.state,
					l = s.highlightedMenuItemIndex,
					i = s.kbNavActive;
				var o = this.props.stripTerminalSeparators;
				var u = a()({}, r.props, {
					onMouseEnter: n,
					key: t
				});
				if (I(r) || C(r)) {
					u.menuCallback = this.onMenuItemSelected;
					u.menuCallbackId = t;
					u.highlighted = l === t && (C(r) || i);
					u.activeMenuId = this.activeMenuId + "-" + t
				}
				if (C(r)) {
					u.kbNavActive = !i;
					u.stealKBNav = this.deactivateKBNav.bind(this);
					u.returnKBNav = this.activateKBNav.bind(this);
					u.preventHighlightChange = this.preventHighlightChange.bind(this);
					u.allowHighlightChange = this.allowHighlightChange.bind(this)
				}
				if (N(r) && o)
					if (this.menuChildren) {
						var c = this.menuChildren[t - 1];
						if (N(c)) return null;
						u.noFirstChild = true;
						u.noLastChild = true
					} else Object(R["b"])().warn("Menu.renderMenuItem called without this.menuChildren");
				return m.a.cloneElement(r, u)
			}
		}, {
			key: "renderMenuItems",
			value: function e() {
				this.menuChildren = m.a.Children.toArray(this.props.children);
				return this.menuChildren.map(this.renderMenuItem, this)
			}
		}, {
			key: "render",
			value: function e() {
				var r = this.props,
					t = r.noMargin,
					n = r.menuClassNames;
				var a = b()("c-menu__items", {
					"c-menu__items--no_margin": t
				});
				var s = b()("c-menu", n);
				var l = this.state.kbNavActive && -1 !== this.state.highlightedMenuItemIndex ? this.activeMenuId + "-" + this.state.highlightedMenuItemIndex : null;
				return m.a.createElement("div", {
					className: s,
					"data-qa": "menu",
					style: {
						width: this.props.width
					}
				}, m.a.createElement("div", {
					className: "c-menu__items_scroller"
				}, m.a.createElement("div", {
					"aria-activedescendant": l,
					ref: this.setAriaMenuRef,
					className: a,
					onMouseLeave: this.onMouseLeaveMenu,
					"data-qa": "menu_items",
					role: "menu",
					tabIndex: "-1",
					"no-bootstrap": 1
				}, this.renderMenuItems())))
			}
		}]);
		return r
	}(f["PureComponent"]);
	q.displayName = "Menu";
	q.defaultProps = T;
	r["a"] = q
},
// function (e, r, t) {
// 	"use strict";
// 	t.d(r, "a", function () {
// 		return a
// 	});
// 	var n = t(70);

// 	function a(e) {
// 		return -1 !== n["MENTION_BROADCAST_KEYWORDS"].indexOf(e)
// 	}
// },
// function (e, r, t) {
// 	"use strict";
// 	t.d(r, "a", function () {
// 		return a
// 	});
// 	t.d(r, "b", function () {
// 		return s
// 	});
// 	t.d(r, "c", function () {
// 		return l
// 	});
// 	var n = t(13);
// 	var a = Object(n["b"])("TS.calls.closeCall");
// 	var s = Object(n["b"])("TS.utility.calls.maybeHandleCallLink", function () {
// 		return true
// 	});
// 	var l = Object(n["b"])("TS.utility.calls.startCallInModelOb", function () {
// 		return true
// 	});
// 	var i = Object(n["b"])("TS.utility.calls.isEnabled", function () {
// 		return true
// 	})
// },
// function (e, r, t) {
// 	"use strict";
// 	var n = t(5);
// 	var a = t.n(n);
// 	var s = t(6);
// 	var l = t.n(s);
// 	var i = t(7);
// 	var o = t.n(i);
// 	var u = t(8);
// 	var c = t.n(u);
// 	var d = t(1);
// 	var h = t.n(d);
// 	var _ = t(14);
// 	var f = t(129);
// 	var m = t(2);
// 	var v = t.n(m);
// 	var p = t(10);
// 	var g = t(11);
// 	var b = t(162);
// 	var R = t(65);
// 	var y = t(87);
// 	var w = t(171);
// 	var k = t(603);
// 	var j = t(319);
// 	var O = new p["b"]("attachments");
// 	var E = {
// 		bot: f["b"].oneOfType([f["b"].bool, f["b"].object]),
// 		botId: f["b"].string,
// 		icon: f["b"].string,
// 		isAppUnfurl: f["b"].bool,
// 		text: f["b"].node,
// 		humanTs: f["b"].string,
// 		tsLink: f["b"].string,
// 		permalinkText: f["b"].string,
// 		clogLinkClick: f["b"].func,
// 		featureSlackUnfurlLinks: f["b"].bool.isRequired
// 	};
// 	var S = {
// 		bot: null,
// 		botId: null,
// 		icon: null,
// 		isAppUnfurl: false,
// 		text: null,
// 		humanTs: null,
// 		tsLink: null,
// 		permalinkText: null,
// 		clogLinkClick: m["noop"]
// 	};
// 	var x = function (e) {
// 		c()(r, e);

// 		function r() {
// 			a()(this, r);
// 			return o()(this, (r.__proto__ || Object.getPrototypeOf(r)).apply(this, arguments))
// 		}
// 		l()(r, [{
// 			key: "renderIconMaybe",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.icon,
// 					n = r.text;
// 				if (!t) return null;
// 				return h.a.createElement("img", {
// 					className: "c-message_attachment__footer_icon",
// 					alt: n,
// 					src: Object(k["a"])({
// 						url: t,
// 						width: j["d"],
// 						height: j["d"]
// 					}),
// 					width: j["a"],
// 					height: j["a"],
// 					"data-qa": "message_attachment_footer_icon"
// 				})
// 			}
// 		}, {
// 			key: "renderTextMaybe",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.text,
// 					n = r.clogLinkClick;
// 				if (!t) return null;
// 				return h.a.createElement("span", {
// 					className: "c-message_attachment__footer_text c-message_attachment__part",
// 					"data-qa": "message_attachment_footer_text"
// 				}, "string" === typeof t ? h.a.createElement(y["a"], {
// 					text: t,
// 					clogLinkClick: n
// 				}) : t)
// 			}
// 		}, {
// 			key: "renderTsMaybe",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.humanTs,
// 					n = r.tsLink,
// 					a = r.clogLinkClick;
// 				if (!t) return null;
// 				var s = n ? h.a.createElement(R["a"], {
// 					href: n,
// 					target: "_blank",
// 					rel: "noopener noreferrer",
// 					clogLinkClick: a
// 				}, t) : t;
// 				return h.a.createElement("span", {
// 					className: "c-message_attachment__footer_ts c-message_attachment__part"
// 				}, s)
// 			}
// 		}, {
// 			key: "renderAttributionMaybe",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.bot,
// 					n = r.botId,
// 					a = r.isAppUnfurl;
// 				if (!a && !t) return null;
// 				var s = void 0;
// 				var l = O.t("a bot");
// 				var i = t ? t.name : l;
// 				var o = "/services/" + n;
// 				s = t.isNonExistent || t.isUnknown ? l : h.a.createElement(R["a"], {
// 					href: o,
// 					target: "_blank",
// 					title: i,
// 					"data-attribution-bot-id": n
// 				}, i);
// 				return h.a.createElement("span", {
// 					className: "c-message_attachment__footer_attribution c-message_attachment__part",
// 					"data-qa-attachment-attribution": true
// 				}, O.t("Added by "), s)
// 			}
// 		}, {
// 			key: "renderPermalinkMaybe",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.permalinkText,
// 					n = r.tsLink,
// 					a = r.featureSlackUnfurlLinks;
// 				if (!a || !t || !n) return null;
// 				return h.a.createElement("span", {
// 					className: "c-message_attachment__part sk_link_blue"
// 				}, h.a.createElement(R["a"], {
// 					href: n
// 				}, t))
// 			}
// 		}, {
// 			key: "render",
// 			value: function e() {
// 				return h.a.createElement("span", {
// 					className: "c-message_attachment__footer"
// 				}, this.renderIconMaybe(), this.renderTextMaybe(), this.renderTsMaybe(), this.renderAttributionMaybe(), this.renderPermalinkMaybe())
// 			}
// 		}]);
// 		return r
// 	}(d["PureComponent"]);
// 	x.displayName = "AttachmentFooter";
// 	x.defaultProps = S;
// 	var T = function e(r, t) {
// 		var n = t.botId,
// 			a = t.ts;
// 		return {
// 			bot: Object(b["getBotById"])(r, n),
// 			humanTs: a && Object(w["m"])(r, a, {
// 				uncapitalized: false
// 			}),
// 			featureSlackUnfurlLinks: Object(g["isFeatureEnabled"])(r, "feature_slack_unfurl_links")
// 		}
// 	};
// 	r["a"] = Object(_["connect"])(T)(x)
// },
// function (e, r, t) {
// 	"use strict";
// 	t.r(r);
// 	var n = t(9);
// 	var a = t.n(n);
// 	var s = t(3);
// 	var l = t.n(s);
// 	var i = t(129);
// 	var o = t(4);
// 	var u = t(314);
// 	var c = t(164);
// 	var d = Object(o["e"])("Clog a query session event using data from redux", function (e, r) {
// 		var t = e(C());
// 		var n = e(I());
// 		var a = Object(c["a"])({
// 			state: r()
// 		});
// 		a.track("SEARCH_QUERY_SESSION", {
// 			search_session_id: t,
// 			client_request_id: n
// 		})
// 	});
// 	d.propTypes = null;
// 	var h = d;
// 	t.d(r, "SEARCH_SESSION_TIMEOUT_MS", function () {
// 		return f
// 	});
// 	t.d(r, "endQuerySession", function () {
// 		return g
// 	});
// 	t.d(r, "startQuerySession", function () {
// 		return b
// 	});
// 	t.d(r, "endSearchSession", function () {
// 		return w
// 	});
// 	t.d(r, "startSearchSession", function () {
// 		return k
// 	});
// 	t.d(r, "getQuerySessionId", function () {
// 		return I
// 	});
// 	t.d(r, "getSearchSessionId", function () {
// 		return C
// 	});
// 	var _;
// 	var f = 3e5;
// 	var m = Object(o["a"])("Set the timestamp for the query session the current time");
// 	m.propTypes = {};
// 	var v = Object(o["a"])("Sets a new ID for the query session");
// 	v.propTypes = {
// 		querySessionId: i["b"].string.isRequired
// 	};
// 	var p = Object(o["a"])("Destroy a query session ID by emptying it");
// 	p.propTypes = {};
// 	var g = Object(o["e"])("Sets a new ID for the query session", function (e) {
// 		e(p())
// 	});
// 	g.propTypes = {};
// 	var b = Object(o["e"])("Sets a new ID for the query session", function (e) {
// 		var r = Object(u["a"])();
// 		e(v({
// 			querySessionId: r
// 		}));
// 		e(m());
// 		e(h());
// 		return r
// 	});
// 	b.propTypes = {};
// 	var R = Object(o["a"])("Sets a new ID for the search session");
// 	R.propTypes = {
// 		searchSessionId: i["b"].string.isRequired
// 	};
// 	var y = Object(o["a"])("Destroy a search session ID by emptying it");
// 	y.propTypes = {};
// 	var w = Object(o["e"])("Sets a new ID for the search and query sessions", function (e) {
// 		e(g());
// 		e(y())
// 	});
// 	g.propTypes = {};
// 	var k = Object(o["e"])("Sets a new ID for the search session", function (e) {
// 		var r = Object(u["a"])();
// 		e(R({
// 			searchSessionId: r
// 		}));
// 		e(b());
// 		return r
// 	});
// 	k.propTypes = {};
// 	var j = {
// 		lastEventTimeMs: void 0,
// 		querySessionId: void 0,
// 		searchSessionId: void 0
// 	};
// 	var O = Object(o["c"])((_ = {}, a()(_, m, function (e) {
// 		return l()({}, e, {
// 			lastEventTimeMs: (new Date).getTime()
// 		})
// 	}), a()(_, v, function (e) {
// 		var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
// 			t = r.querySessionId;
// 		return l()({}, e, {
// 			querySessionId: t
// 		})
// 	}), a()(_, p, function (e) {
// 		return l()({}, e, {
// 			querySessionId: void 0
// 		})
// 	}), a()(_, R, function (e) {
// 		var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
// 			t = r.searchSessionId;
// 		return l()({}, e, {
// 			searchSessionId: t
// 		})
// 	}), a()(_, y, function (e) {
// 		return l()({}, e, {
// 			searchSessionId: void 0
// 		})
// 	}), _), j);
// 	O.propTypes = {
// 		lastEventTimeMs: i["b"].number,
// 		querySessionId: i["b"].string,
// 		searchSessionId: i["b"].string
// 	};
// 	var E = r["default"] = O;
// 	var S = Object(o["d"])(function (e) {
// 		return e && e.searchSession && e.searchSession.lastEventTimeMs
// 	});
// 	var x = Object(o["d"])(function (e) {
// 		return e && e.searchSession && e.searchSession.querySessionId
// 	});
// 	var T = Object(o["d"])(function (e) {
// 		return e && e.searchSession && e.searchSession.searchSessionId
// 	});
// 	var I = Object(o["e"])("Get a Query Session ID", function (e, r) {
// 		var t = r();
// 		var n = S(t);
// 		var a = x(t);
// 		if (!a || !n || (new Date).getTime() - n > f) return e(b());
// 		e(m());
// 		return a
// 	});
// 	I.propTypes = {};
// 	var C = Object(o["e"])("Get a Search Session ID", function (e, r) {
// 		var t = r();
// 		var n = S(t);
// 		var a = T(t);
// 		if (!a || !n || (new Date).getTime() - n > f) return e(k());
// 		e(m());
// 		return a
// 	});
// 	C.propTypes = {}
// },
// function (e, r, t) {
// 	"use strict";
// 	t.d(r, "a", function () {
// 		return u
// 	});
// 	var n = t(5);
// 	var a = t.n(n);
// 	var s = t(6);
// 	var l = t.n(s);
// 	var i = t(2);
// 	var o = t.n(i);
// 	var u = function () {
// 		function e(r, t) {
// 			a()(this, e);
// 			this.call = r;
// 			this.timeoutMs = t;
// 			this.updateDate = void 0;
// 			this.cachedData = void 0;
// 			this.pendingPromise = void 0;
// 			this.pendingPromiseRequestDate = void 0
// 		}
// 		l()(e, [{
// 			key: "get",
// 			value: function e() {
// 				if (this.isStaleOrUndefined()) return this._callCacheGet();
// 				return Promise.resolve(this.cachedData)
// 			}
// 		}, {
// 			key: "getStaleWhileRevalidate",
// 			value: function e(r) {
// 				if (this.isStaleOrUndefined()) {
// 					this._callCacheGet();
// 					return Promise.resolve(void 0 === this.cachedData ? r : this.cachedData)
// 				}
// 				return Promise.resolve(this.cachedData)
// 			}
// 		}, {
// 			key: "flushAll",
// 			value: function e() {
// 				this.updateDate = void 0;
// 				this.cachedData = void 0;
// 				this.pendingPromise && this.pendingPromise.cancel();
// 				this.pendingPromise = void 0;
// 				this.pendingPromiseRequestDate = void 0
// 			}
// 		}, {
// 			key: "onCacheData",
// 			value: function e(r) {
// 				Object(i["noop"])()
// 			}
// 		}, {
// 			key: "isStaleOrUndefined",
// 			value: function e() {
// 				return void 0 === this.updateDate || void 0 === this.cachedData || new Date - this.updateDate > this.timeoutMs
// 			}
// 		}, {
// 			key: "_callCacheGet",
// 			value: function e() {
// 				var r = this;
// 				if (this.pendingPromise) {
// 					if (new Date - this.pendingPromiseRequestDate < 3e4) return this.pendingPromise;
// 					this.pendingPromise.cancel();
// 					this.pendingPromiseRequestDate = void 0;
// 					this.pendingPromiseRequestDate = void 0
// 				}
// 				this.pendingPromiseRequestDate = new Date;
// 				this.pendingPromise = this.call.apply(this).then(function (e) {
// 					r.cachedData = e;
// 					r.updateDate = new Date;
// 					r.pendingPromise = void 0;
// 					r.onCacheData(e);
// 					return r.cachedData
// 				});
// 				return this.pendingPromise
// 			}
// 		}]);
// 		return e
// 	}()
// },
// function (e, r, t) {
// 	"use strict";
// 	var n = t(5);
// 	var a = t.n(n);
// 	var s = t(6);
// 	var l = t.n(s);
// 	var i = t(7);
// 	var o = t.n(i);
// 	var u = t(8);
// 	var c = t.n(u);
// 	var d = t(129);
// 	var h = t(1);
// 	var _ = t.n(h);
// 	var f = t(15);
// 	var m = t.n(f);
// 	var v = t(2);
// 	var p = t(255);
// 	var g = t(177);
// 	var b = t(20);
// 	var R = t(18);
// 	var y = t(1322);
// 	var w = {
// 		id: d["b"].string.isRequired,
// 		name: d["b"].node.isRequired,
// 		onClick: d["b"].func.isRequired,
// 		isSelected: d["b"].bool,
// 		isFocused: d["b"].bool,
// 		isDisabled: d["b"].bool,
// 		icon: d["b"].string,
// 		fullWidth: d["b"].bool,
// 		count: d["b"].number,
// 		"data-qa": d["b"].string
// 	};
// 	var k = {
// 		isSelected: false,
// 		isFocused: false,
// 		isDisabled: false,
// 		icon: "",
// 		content: "",
// 		fullWidth: false,
// 		count: NaN,
// 		"data-qa": void 0
// 	};
// 	var j = function (e) {
// 		c()(r, e);

// 		function r(e) {
// 			a()(this, r);
// 			var t = o()(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e));
// 			t.maybeCallOnClick = t.maybeCallOnClick.bind(t);
// 			return t
// 		}
// 		l()(r, [{
// 			key: "maybeCallOnClick",
// 			value: function e(r) {
// 				if (this.props.isDisabled) return;
// 				this.props.onClick(r, this.props.id)
// 			}
// 		}, {
// 			key: "maybeRenderCount",
// 			value: function e() {
// 				var r = this.props.count;
// 				if (isNaN(r)) return null;
// 				return _.a.createElement("span", {
// 					className: "c-tabs__tab_count",
// 					"data-qa": "tabs_item_render_count"
// 				}, r)
// 			}
// 		}, {
// 			key: "maybeRenderIcon",
// 			value: function e() {
// 				var r = this.props.icon;
// 				if (!r) return null;
// 				return _.a.createElement(R["b"], {
// 					type: r,
// 					className: "c-tabs__tab_icon",
// 					size: "inherit",
// 					inline: true,
// 					"data-qa": "tabs_item_render_icon"
// 				})
// 			}
// 		}, {
// 			key: "render",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.name,
// 					n = r.isSelected,
// 					a = r.isFocused,
// 					s = r.isDisabled,
// 					l = r.fullWidth;
// 				var i = m()("c-tabs__tab", "js-tab", {
// 					"c-tabs__tab--active": n,
// 					"c-tabs__tab--disabled": s,
// 					"c-tabs__tab--full_width": l,
// 					"focus-ring": a
// 				});
// 				return _.a.createElement(b["c"], {
// 					role: "tab",
// 					className: i,
// 					onClick: this.maybeCallOnClick,
// 					"aria-selected": n,
// 					tabIndex: n ? 0 : "-1",
// 					"data-qa": this.props["data-qa"]
// 				}, t, this.maybeRenderCount(), this.maybeRenderIcon())
// 			}
// 		}]);
// 		return r
// 	}(h["PureComponent"]);
// 	j.displayName = "TabsItem";
// 	j.defaultProps = k;
// 	var O = j;
// 	var E = {
// 		content: d["b"].node.isRequired,
// 		fullHeight: d["b"].bool
// 	};
// 	var S = {
// 		fullHeight: false
// 	};
// 	var x = function (e) {
// 		c()(r, e);

// 		function r() {
// 			a()(this, r);
// 			return o()(this, (r.__proto__ || Object.getPrototypeOf(r)).apply(this, arguments))
// 		}
// 		l()(r, [{
// 			key: "render",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.content,
// 					n = r.fullHeight;
// 				var a = m()("c-tabs__tab_panel", "js-panel", "c-tabs__tab_panel--active", {
// 					"c-tabs__tab_panel--full_height": n
// 				});
// 				return _.a.createElement("div", {
// 					role: "tabpanel",
// 					className: a,
// 					"data-qa": "tabs_content_container"
// 				}, t)
// 			}
// 		}]);
// 		return r
// 	}(h["PureComponent"]);
// 	x.displayName = "TabsContent";
// 	x.defaultProps = S;
// 	var T = x;
// 	var I = {
// 		tabs: d["b"].array.isRequired,
// 		defaultTabId: d["b"].string,
// 		onTabChange: d["b"].func,
// 		fullHeight: d["b"].bool,
// 		fullWidthMenu: d["b"].bool
// 	};
// 	var C = {
// 		defaultTabId: "",
// 		onTabChange: v["noop"],
// 		fullHeight: false,
// 		fullWidthMenu: false
// 	};
// 	var N = function (e) {
// 		c()(r, e);

// 		function r(e) {
// 			a()(this, r);
// 			var t = o()(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e));
// 			t.setTabsRef = t.setTabsRef.bind(t);
// 			t.onFocusEnter = t.onFocusEnter.bind(t);
// 			t.onFocusLeave = t.onFocusLeave.bind(t);
// 			t.onItemClick = t.onItemClick.bind(t);
// 			t.onKeyPressLeft = t.onKeyPressLeft.bind(t);
// 			t.onKeyPressRight = t.onKeyPressRight.bind(t);
// 			t.onKeyPressEnter = t.onKeyPressEnter.bind(t);
// 			t.selectTab = t.selectTab.bind(t);
// 			t.renderTabsItems = t.renderTabsItems.bind(t);
// 			var n = void 0;
// 			var s = void 0;
// 			var l = void 0;
// 			var i = t.props,
// 				u = i.defaultTabId,
// 				c = i.tabs;
// 			if (c && c.length) {
// 				var d = Object(v["findIndex"])(c, {
// 					id: u
// 				});
// 				if (u && d) {
// 					n = u;
// 					s = d
// 				} else {
// 					n = c[0].id;
// 					s = 0
// 				}
// 			}
// 			t.state = {
// 				selectedTabId: n,
// 				selectedTabIndex: s,
// 				focusedTabIndex: l,
// 				hasFocus: false
// 			};
// 			return t
// 		}
// 		l()(r, [{
// 			key: "componentDidMount",
// 			value: function e() {
// 				if (this.tabsRef) {
// 					this.keyCommands = new g["a"](this.tabsRef);
// 					this.keyCommands.bindAll([{
// 						keys: ["left"],
// 						handler: this.onKeyPressLeft.bind(this)
// 					}, {
// 						keys: ["right"],
// 						handler: this.onKeyPressRight.bind(this)
// 					}, {
// 						keys: ["enter", "space"],
// 						handler: this.onKeyPressEnter.bind(this)
// 					}])
// 				}
// 			}
// 		}, {
// 			key: "componentWillReceiveProps",
// 			value: function e(r) {
// 				var t = this.props.defaultTabId;
// 				if (t !== r.defaultTabId && r.defaultTabId) {
// 					if (!this.props.tabs || !this.props.tabs.length) return;
// 					this.selectTab(r.defaultTabId)
// 				}
// 			}
// 		}, {
// 			key: "componentWillUnmount",
// 			value: function e() {
// 				this.keyCommands && this.keyCommands.reset()
// 			}
// 		}, {
// 			key: "onItemClick",
// 			value: function e(r, t) {
// 				this.setState(function () {
// 					return {
// 						focusedTabIndex: void 0
// 					}
// 				});
// 				this.selectTab(t)
// 			}
// 		}, {
// 			key: "onFocusEnter",
// 			value: function e(r) {
// 				this.setState(function () {
// 					return {
// 						hasFocus: true
// 					}
// 				});
// 				var t = r.relatedEvent;
// 				t && "keydown" === t.type && this.focusTab(this.state.selectedTabIndex)
// 			}
// 		}, {
// 			key: "onFocusLeave",
// 			value: function e() {
// 				this.setState(function () {
// 					return {
// 						hasFocus: false,
// 						focusedTabIndex: void 0
// 					}
// 				})
// 			}
// 		}, {
// 			key: "onKeyPressLeft",
// 			value: function e(r) {
// 				var t = this.state.focusedTabIndex;
// 				var n = t - 1;
// 				r.preventDefault();
// 				if (true !== this.state.hasFocus) return;
// 				Object(v["isUndefined"])(t) ? this.focusTab(this.state.selectedTabIndex) : n >= 0 ? this.focusTab(n) : this.focusTab(this.props.tabs.length - 1)
// 			}
// 		}, {
// 			key: "onKeyPressRight",
// 			value: function e(r) {
// 				var t = this.state.focusedTabIndex;
// 				var n = t + 1;
// 				r.preventDefault();
// 				if (true !== this.state.hasFocus) return;
// 				Object(v["isUndefined"])(t) ? this.focusTab(this.state.selectedTabIndex) : n < this.props.tabs.length ? this.focusTab(n) : this.focusTab(0)
// 			}
// 		}, {
// 			key: "onKeyPressEnter",
// 			value: function e(r) {
// 				var t = this.state.focusedTabIndex;
// 				r.preventDefault();
// 				if (true !== this.state.hasFocus) return;
// 				if (t >= 0) {
// 					var n = this.props.tabs[t];
// 					this.selectTab(n.id)
// 				}
// 			}
// 		}, {
// 			key: "setTabsRef",
// 			value: function e(r) {
// 				this.tabsRef = r
// 			}
// 		}, {
// 			key: "focusTab",
// 			value: function e(r) {
// 				this.setState(function () {
// 					return {
// 						focusedTabIndex: r
// 					}
// 				})
// 			}
// 		}, {
// 			key: "selectTab",
// 			value: function e(r) {
// 				var t = this;
// 				var n = this.props.tabs;
// 				var a = Object(v["findIndex"])(n, {
// 					id: r
// 				});
// 				var s = n[a];
// 				if (s.isExternalLink) return s.onClick(r);
// 				this.setState(function () {
// 					return {
// 						selectedTabId: r,
// 						selectedTabIndex: a
// 					}
// 				}, function () {
// 					t.props.onTabChange(r)
// 				});
// 				return null
// 			}
// 		}, {
// 			key: "renderTabsItems",
// 			value: function e() {
// 				var r = this;
// 				var t = this.props,
// 					n = t.tabs,
// 					a = t.fullWidthMenu;
// 				var s = this.onItemClick;
// 				var l = Object(v["map"])(n, function (e, t) {
// 					function n(r, t) {
// 						e.isExternalLink || s(r, t);
// 						e.onClick && e.onClick(t)
// 					}
// 					return _.a.createElement(O, {
// 						key: e.id,
// 						id: e.id,
// 						icon: e.icon,
// 						name: e.title,
// 						onClick: n,
// 						isSelected: r.state.selectedTabId === e.id,
// 						isDisabled: e.isDisabled,
// 						isFocused: r.state.focusedTabIndex === t,
// 						fullWidth: a,
// 						count: e.titleCount,
// 						"data-qa": e["data-qa"]
// 					})
// 				});
// 				return l
// 			}
// 		}, {
// 			key: "render",
// 			value: function e() {
// 				var r = this.props,
// 					t = r.tabs,
// 					n = r.fullHeight,
// 					a = r.fullWidthMenu;
// 				var s = this.state.selectedTabId;
// 				var l = Object(v["find"])(t, {
// 					id: s
// 				}, "").content;
// 				var i = m()({
// 					"c-tabs__tab_container--full_height": n
// 				});
// 				var o = m()("c-tabs__tab_menu", {
// 					"c-tabs__tab_menu--full_width": a
// 				});
// 				return _.a.createElement(p["a"], {
// 					onFocusEnter: this.onFocusEnter,
// 					onFocusLeave: this.onFocusLeave
// 				}, _.a.createElement("div", {
// 					className: i,
// 					ref: this.setTabsRef,
// 					"data-qa": "tabs_full_height_class"
// 				}, _.a.createElement("div", {
// 					role: "tablist",
// 					className: o,
// 					"data-qa": "tabs_full_width_class"
// 				}, this.renderTabsItems()), _.a.createElement(T, {
// 					content: l,
// 					fullHeight: n,
// 					fullWidthMenu: a
// 				})))
// 			}
// 		}]);
// 		return r
// 	}(h["PureComponent"]);
// 	N.displayName = "Tabs";
// 	N.defaultProps = C;
// 	var A = N;
// 	var M = r["a"] = A
// },
// function (e, r, t) {
// 	"use strict";
// 	t.d(r, "a", function () {
// 		return u
// 	});
// 	t.d(r, "b", function () {
// 		return c
// 	});
// 	var n = t(2);
// 	var a = t.n(n);
// 	var s = t(129);
// 	var l = t(25);
// 	var i = t(22);
// 	var o = t(419);
// 	var u = Object(i["a"])("fetch a list of app actions", function (e) {
// 		return e(Object(l["a"])({
// 			method: "apps.actions.list",
// 			args: {}
// 		})).then(function (e) {
// 			return Object(n["get"])(e, "app_actions", {})
// 		})
// 	});
// 	var c = Object(i["a"])("run an app action", function (e, r) {
// 		var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
// 			n = t.type,
// 			a = t.actionId,
// 			s = t.appId,
// 			i = t.channelId,
// 			u = t.messageTs;
// 		return e(Object(l["a"])({
// 			method: "apps.actions.run",
// 			args: {
// 				action_id: a,
// 				type: n,
// 				app_id: s,
// 				channel: i,
// 				message_ts: u,
// 				client_token: o["a"].generateAndEnqueue()
// 			}
// 		}))
// 	});
// 	c.propTypes = {
// 		type: s["b"].string,
// 		actionId: s["b"].string,
// 		appId: s["b"].string,
// 		channelId: s["b"].string,
// 		messageTs: s["b"].string
// 	}
// },
// function (e, r, t) {
// 	"use strict";
// 	t.d(r, "a", function () {
// 		return R
// 	});
// 	var n = t(2);
// 	var a = t.n(n);
// 	var s = t(27);
// 	var l = t(16);
// 	var i = t(11);
// 	var o = t(33);
// 	var u = t(362);
// 	var c = {
// 		24: cdn_url + "/66f9/img/avatars/ava_0002-24.png",
// 		32: cdn_url + "/0180/img/avatars/ava_0002-32.png",
// 		36: cdn_url + "/66f9/img/avatars/ava_0002-48.png",
// 		72: cdn_url + "/66f9/img/avatars/ava_0002-72.png",
// 		192: cdn_url + "/7fa9/img/avatars/ava_0002-192.png"
// 	};
// 	var d = {
// 			sad_surprise: {
// 				20: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_20.png",
// 				24: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_24.png",
// 				32: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_32.png",
// 				36: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_36.png",
// 				48: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_48.png",
// 				72: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_72.png",
// 				192: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_192.png",
// 				512: cdn_url + "/c6db/img/slackbot/slackbot_sad_surprise_512.png"
// 			}