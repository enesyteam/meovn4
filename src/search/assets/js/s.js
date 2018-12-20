recordMessageActionFrecencyEvent: function e(a) {
	return t(R(a))
}
}
};
var Ea = Object(y["connect"])(wa, Ca)(Oa);
var Sa = rt["selectMessageActions"];
var ja = new j["b"]("app_actions");
var Ia = 64;
var Ta = "/apps/collection/actions?utm_source=overflow&utm_medium=inprod&utm_content=overflow-more actions&utm_campaign=inprod";
var Na = {
	channelId: _["b"].string.isRequired,
	onClose: _["b"].func,
	ts: _["b"].string.isRequired,
	onSelectAction: _["b"].func,
	slackActions: _["b"].arrayOf(A["a"].MessageAction).isRequired,
	appActions: _["b"].arrayOf(A["a"].AppActionMenuItem),
	isLoading: _["b"].bool.isRequired,
	onLoad: _["b"].func.isRequired,
	handleMessageAction: _["b"].func.isRequired,
	closeModal: _["b"].func.isRequired,
	clogger: _["b"].object.isRequired
};
var Aa = {
	appActions: [],
	onClose: k["noop"],
	onSelectAction: k["noop"]
};
var Pa = function (e) {
	v()(t, e);

	function t(e) {
		u()(this, t);
		var a = h()(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
		a.state = {
			filterQuery: "",
			normalizedFilterQuery: ""
		};
		Object(k["bindAll"])(a, ["onFilterUpdate", "onFooterLinkClick", "onSelectAction", "filterAction", "formatSlackAction", "renderSingleAction", "handleSelectEvent"]);
		return a
	}
	p()(t, [{
		key: "componentDidMount",
		value: function e() {
			var t = this.props.clogger;
			t.track(O["j"].MSG_ACTION, {
				contexts: {
					ui_context: {
						action: O["o"].IMPRESSION,
						step: O["r"].MESSAGE_ACTION_DIALOG,
						ui_element: O["q"].MESSAGE_ACTION_DIALOG
					},
					platform: {
						app_actions_showing: this.props.appActions.length
					}
				}
			});
			this.props.onLoad()
		}
	}, {
		key: "shouldComponentUpdate",
		value: function e() {
			var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
				a = t.channelId,
				r = t.ts,
				n = t.isLoading;
			var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
				s = i.normalizedFilterQuery;
			if (this.state.normalizedFilterQuery !== s) return true;
			if (this.props.isLoading && !n) return true;
			if (this.props.channelId !== a) return true;
			if (this.props.ts !== r) return true;
			return false
		}
	}, {
		key: "onFooterLinkClick",
		value: function e() {
			var t = this.props.clogger;
			t.track(O["j"].MSG_ACTION, {
				contexts: {
					ui_context: {
						action: O["o"].CLICK,
						step: O["r"].MESSAGE_ACTION_DIALOG,
						ui_element: O["q"].GET_MORE_APP_ACTIONS
					},
					platform: {
						app_actions_showing: this.props.appActions.length
					}
				}
			})
		}
	}, {
		key: "onSelectAction",
		value: function e(t, a) {
			var r = this.props,
				n = r.ts,
				i = r.channelId,
				s = r.closeModal,
				o = r.handleMessageAction,
				e = r.onSelectAction,
				l = r.clogger;
			s();
			this.props.onClose && this.props.onClose(t);
			var c = e(t, a, {
				ts: n,
				channelId: i
			});
			c || o(t, a, {
				ts: n,
				channelId: i
			});
			Object(L["b"])(a, this.state.normalizedFilterQuery);
			var u = {
				ui_context: {
					action: O["o"].CLICK,
					step: O["r"].MESSAGE_ACTION_DIALOG,
					ui_element: a.uiElement
				}
			};
			a.appId && (u.platform = {
				app_id: a.appId,
				action_id: a.id
			});
			l.track(O["j"].MSG_ACTION, {
				contexts: u
			})
		}
	}, {
		key: "onFilterUpdate",
		value: function e(t) {
			var a = Object(tt["a"])(t);
			this.setState(function () {
				return {
					filterQuery: t,
					normalizedFilterQuery: a
				}
			})
		}
	}, {
		key: "getActions",
		value: function e() {
			var t = [].concat(l()(Object(k["map"])(this.props.slackActions, this.formatSlackAction)), l()(Object(k["map"])(this.props.appActions, et)));
			t = Object(k["filter"])(t, this.filterAction);
			t = Object(L["c"])(t, this.state.normalizedFilterQuery);
			return t
		}
	}, {
		key: "handleSelectEvent",
		value: function e(t, a, r) {
			this.onSelectAction(r, a.props.action)
		}
	}, {
		key: "filterAction",
		value: function e(t) {
			return at(t, this.state.normalizedFilterQuery)
		}
	}, {
		key: "formatSlackAction",
		value: function e(t) {
			return n()({}, t, {
				danger: false,
				description: ja.t("Slack")
			})
		}
	}, {
		key: "renderTitle",
		value: function e(t) {
			return g.a.createElement("div", {
				className: "p-app_actions_dialog__title",
				"data-qa-app-actions-dialog-title": true
			}, g.a.createElement("div", {
				className: "p-app_actions_dialog__title_text"
			}, t))
		}
	}, {
		key: "renderMessagePreview",
		value: function e() {
			var t = this.props,
				a = t.channelId,
				r = t.ts;
			return g.a.createElement("div", {
				className: "p-app_actions_dialog__message",
				"data-qa-app-actions-dialog-message": true
			}, g.a.createElement(fa, {
				channelId: a,
				ts: r
			}))
		}
	}, {
		key: "renderLoading",
		value: function e() {
			return g.a.createElement("div", {
				className: "p-app_actions_dialog__loader"
			}, g.a.createElement(Bt["a"], null))
		}
	}, {
		key: "renderSingleAction",
		value: function e(t) {
			var a = g.a.createElement(ta, {
				key: t.id,
				pillarClassName: "p-app_actions_dialog_option",
				action: t
			});
			return {
				label: a,
				value: t.id
			}
		}
	}, {
		key: "renderSelect",
		value: function e() {
			var t = ja.t("Search message actions\u2026");
			return g.a.createElement(Ut["b"], {
				"data-qa": "app-actions-dialog-list",
				isAlwaysOpen: true,
				usePlaceholderOption: false,
				autoSelectFirstOption: true,
				focusInputOnMount: true,
				placeholder: t,
				icon: "search",
				id: "p-app_actions_dialog__select",
				className: "p-app_actions_dialog__select",
				pillarClassName: "p-app_actions_dialog",
				onChange: this.handleSelectEvent,
				onFilterInputChange: this.onFilterUpdate,
				options: Object(k["map"])(this.getActions(), this.renderSingleAction),
				optionsRowHeight: Ia
			})
		}
	}, {
		key: "render",
		value: function e() {
			var t = this.props.isLoading;
			var a = ja.t("Get more message actions");
			var r = ja.t("Use an action");
			return g.a.createElement(Ft["a"], {
				contentLabel: r,
				className: "p-app_actions_dialog",
				overlayClassName: "p-app_actions_dialog__overlay",
				footerIcon: "external-link",
				footerLink: Ta,
				onFooterLinkClick: this.onFooterLinkClick,
				footerText: a,
				goOnEnterPressed: false,
				onCancel: this.props.onClose,
				showCancelButton: false,
				showGoButton: false,
				title: this.renderTitle(r),
				ariaContent: {
					describedby: "p-app_actions_pillow__body"
				},
				useSlackScrollbar: false
			}, this.renderMessagePreview(), t ? this.renderLoading() : this.renderSelect())
		}
	}]);
	return t
}(b["Component"]);
Pa.displayName = "AppActionsDialog";
Pa.defaultProps = Aa;

function Ra(e, t) {
	var a = Sa(e),
		r = a.loading,
		n = a.actions;
	var i = Object(k["filter"])([q(e, t), K(e, t), Z(e, t), te(e, t), se(e, t), pe(e, t), _e(e, t), Ue(e, t), We(e, t), Ye(e, t), $e(e, t)]);
	var s = !!(r || Object(k["find"])(i, "isLoading"));
	return {
		slackActions: i,
		appActions: n,
		isLoading: s,
		clogger: Object(w["a"])({
			state: e
		})
	}
}
var Ma = function e(t) {
	return {
		closeModal: function e() {
			return t(Object(Et["closeModal"])())
		},
		onLoad: function e() {
			return t(Object(rt["ensureFresh"])())
		},
		handleMessageAction: function e() {
			for (var a = arguments.length, r = Array(a), n = 0; n < a; n++) r[n] = arguments[n];
			return Lt.apply(void 0, r.concat([t]))
		}
	}
};
var xa = {};
Object.defineProperty(xa, "selectMessageActions", {
	get: function e() {
		return Sa
	},
	set: function e(t) {
		Sa = t
	}
});
var Da = Object(y["connect"])(Ra, Ma)(Pa);
var La = function e(t) {
	var a = t.featureAppActionsFeRefactor,
		r = s()(t, ["featureAppActionsFeRefactor"]);
	if (a) return g.a.createElement(Ea, r);
	return g.a.createElement(Da, r)
};
La.displayName = "AppActionsSwitcher";
var Fa = function e(t) {
	return {
		featureAppActionsFeRefactor: Object(S["isFeatureEnabled"])(t, "feature_app_actions_fe_refactor")
	}
};
var Ba = Object(y["connect"])(Fa)(La);
var Ua = Object(E["b"])("Open app actions dialog", function (e, t, a) {
	var r = g.a.createElement(Ba, a);
	e(Object(Et["openModal"])({
		element: r
	}))
});
Ua.propTypes = {
	channelId: _["b"].string.isRequired,
	ts: _["b"].string.isRequired,
	onSelectAction: _["b"].func.isRequired
};
var qa = Ua;
var Ga = new j["b"]("message");
var Ha = 3;
var Wa = "/apps/collection/actions?utm_source=messagemenu&utm_medium=inprod&utm_content=overflow-more actions&utm_campaign=inprod";
var Va = {
	ts: _["b"].string.isRequired,
	channelId: _["b"].string.isRequired,
	onSelectAction: _["b"].func.isRequired,
	hasActions: _["b"].bool.isRequired,
	hasOverflow: _["b"].bool.isRequired,
	browseAppActions: _["b"].func.isRequired,
	clogger: _["b"].object.isRequired
};
var za = function (e) {
	v()(t, e);

	function t(e) {
		u()(this, t);
		var a = h()(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
		a.onSelected = a.onSelected.bind(a);
		a.state = {
			hasActions: e.hasActions
		};
		return a
	}
	p()(t, [{
		key: "onSelected",
		value: function e(t) {
			var a = this.props,
				r = a.ts,
				n = a.channelId,
				i = a.onSelectAction,
				s = a.clogger;
			this.props.hasOverflow ? this.props.browseAppActions({
				ts: r,
				channelId: n,
				onSelectAction: i
			}) : t && "click" !== t.type && window.open(Wa, "_blank");
			s.track(O["j"].MSG_ACTION, {
				contexts: {
					ui_context: {
						action: O["o"].CLICK,
						step: O["r"].MORE_ACTIONS_MENU,
						ui_element: O["q"].MORE_MESSAGE_ACTIONS_BUTTON
					}
				}
			})
		}
	}, {
		key: "render",
		value: function e() {
			var t = this.props,
				a = t.ts,
				r = t.channelId,
				i = t.onSelectAction,
				o = t.hasActions,
				l = t.browseAppActions,
				c = s()(t, ["ts", "channelId", "onSelectAction", "hasActions", "browseAppActions"]);
			var u = this.state.hasActions ? Ga.t("More message actions\u2026") : Ga.t("Add a message action\u2026");
			return g.a.createElement(C["b"], n()({}, c, {
				label: u,
				"data-qa": this.props.hasOverflow ? "app_message_actions_dialog" : "app_directory_link",
				onSelected: this.onSelected,
				href: this.props.hasOverflow ? void 0 : Wa
			}))
		}
	}]);
	return t
}(b["Component"]);
za.displayName = "BrowseAppActions";
var Ka = function e(t) {
	var a = Object(rt["selectMessageActions"])(t),
		r = a.actions,
		n = a.loading;
	var i = r.length;
	return {
		hasActions: n || !!i,
		hasOverflow: n || i > Ha,
		clogger: Object(w["a"])({
			state: t
		})
	}
};
var Ya = function e(t) {
	return {
		browseAppActions: function e() {
			return t(qa.apply(void 0, arguments))
		}
	}
};
var Qa = Object(C["h"])(Object(y["connect"])(Ka, Ya)(za));
var Ja = a(448);
var Za = a(16);
var Xa = 56;
var $a = 40;
var er = {
	type: _["b"].oneOf(Object(k["values"])(Ja["a"])),
	action: A["a"].MessageAction.isRequired,
	onSelected: _["b"].func.isRequired,
	app: A["a"].maybeUnknown(A["a"].App),
	defaultAppIcon: _["b"].string.isRequired
};
var tr = {
	type: Ja["a"].default,
	app: void 0
};
var ar = function (e) {
	v()(t, e);

	function t(e) {
		u()(this, t);
		var a = h()(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
		a.onSelected = a.onSelected.bind(a);
		return a
	}
	p()(t, [{
		key: "onSelected",
		value: function e(t) {
			var a = this.props,
				r = a.action,
				e = a.onSelected;
			e(t, r)
		}
	}, {
		key: "renderIcon",
		value: function e() {
			var t = this.props,
				a = t.action,
				r = t.app,
				n = t.type,
				i = t.defaultAppIcon;
			var s = r && r.icons || a.iconSet;
			if (s) {
				var o = n === Ja["a"].compactItem ? $a : Xa;
				var l = Object(Qt["a"])({
					icons: s
				}, o, i);
				return g.a.createElement("img", {
					alt: "",
					className: "p-message-actions__icon",
					src: l
				})
			}
			if (a.iconType) return g.a.createElement(zt["b"], {
				type: a.iconType
			});
			return null
		}
	}, {
		key: "render",
		value: function e() {
			var t = this.props,
				a = t.action,
				r = t.app,
				i = t.onSelected,
				o = t.type,
				l = s()(t, ["action", "app", "onSelected", "type"]);
			var c = r && r.name || a.description;
			!c && r && (c = g.a.createElement(Vt["a"], {
				type: Object(Kt["d"])(r) ? "unknown" : "non-existent"
			}));
			return g.a.createElement(C["b"], n()({
				type: o,
				label: a.label || a.name,
				description: c,
				icon: this.renderIcon(),
				danger: a.danger,
				onSelected: this.onSelected,
				"data-qa": a["data-qa"]
			}, l))
		}
	}]);
	return t
}(b["PureComponent"]);
ar.displayName = "MessageActionMenuItem";
ar.defaultProps = tr;
var rr = function e(t, a) {
	var r = a.action;
	return {
		app: r && r.appId && Object(Yt["getAppById"])(t, r.appId),
		defaultAppIcon: Object(Yt["getDefaultAppIcon"])(t)
	}
};
var nr = Object(y["connect"])(rr)(ar);
var ir = Object(C["h"])(nr);
var sr = a(2241);
var or = 3;
var lr = {
	ts: _["b"].string.isRequired,
	channelId: _["b"].string.isRequired,
	rollup: A["a"].Rollup(),
	messageContainerType: _["b"].oneOf(Object(k["values"])(M["MESSAGE_CONTAINERS"])),
	onSelectAction: _["b"].func,
	onMenuItemSelected: _["b"].func,
	onLoad: _["b"].func,
	slackActions: _["b"].arrayOf(_["b"].oneOfType([A["a"].MessageAction, _["b"].node])).isRequired,
	canRunAppAction: _["b"].bool,
	appActions: _["b"].array,
	handleMessageAction: _["b"].func.isRequired,
	recordMessageActionFrecencyEvent: _["b"].func.isRequired,
	clogger: _["b"].object.isRequired
};
var cr = {
	messageContainerType: M["MESSAGE_CONTAINERS"].MESSAGE_PANE,
	onSelectAction: k["noop"],
	onMenuItemSelected: k["noop"],
	onLoad: k["noop"],
	canRunAppAction: false,
	appActions: [],
	runAppAction: k["noop"],
	rollup: void 0
};
var ur = function (e) {
	v()(t, e);

	function t(e) {
		u()(this, t);
		var a = h()(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
		a.state = {
			appActions: e.appActions
		};
		Object(k["bindAll"])(a, ["onSelectAction", "renderSingleAppAction", "renderSingleSlackAction"]);
		return a
	}
	p()(t, [{
		key: "componentDidMount",
		value: function e() {
			this.props.onLoad();
			var t = this.props.clogger;
			t.track(O["j"].MSG_ACTION, {
				contexts: {
					ui_context: {
						action: O["o"].IMPRESSION,
						step: O["r"].MORE_ACTIONS_MENU,
						ui_element: O["q"].MORE_ACTIONS_MENU
					},
					platform: {
						app_actions_showing: Math.min(this.state.appActions.length, or)
					}
				}
			})
		}
	}, {
		key: "onSelectAction",
		value: function e(t, a) {
			var r = this.props,
				n = r.ts,
				i = r.channelId,
				s = r.handleMessageAction,
				e = r.onSelectAction,
				o = r.rollup,
				l = r.clogger;
			var c = e(t, a, {
				ts: n,
				channelId: i
			});
			c || s(t, a, {
				ts: n,
				channelId: i,
				rollup: o
			});
			this.props.recordMessageActionFrecencyEvent({
				action: a
			});
			var u = {
				ui_context: {
					action: O["o"].CLICK,
					step: O["r"].MORE_ACTIONS_MENU,
					ui_element: a.uiElement
				}
			};
			a.appId && (u.platform = {
				app_id: a.appId,
				action_id: a.id
			});
			l.track(O["j"].MSG_ACTION, {
				contexts: u
			})
		}
	}, {
		key: "renderAppActions",
		value: function e() {
			var t = this.props,
				a = t.onSelectAction,
				r = t.ts,
				n = t.channelId;
			var i = this.state.appActions;
			var s = i.slice(0, or).map(this.renderSingleAppAction);
			return [].concat(l()(s), [g.a.createElement(Qa, {
				key: "browse_app_actions",
				ts: r,
				channelId: n,
				onSelectAction: a
			})])
		}
	}, {
		key: "renderSingleAppAction",
		value: function e(t) {
			var a = et(t);
			return g.a.createElement(ir, {
				key: a.id,
				type: Ja["a"].compactItem,
				action: a,
				onSelected: this.onSelectAction
			})
		}
	}, {
		key: "renderSlackActions",
		value: function e() {
			return this.props.slackActions.map(this.renderSingleSlackAction)
		}
	}, {
		key: "renderSingleSlackAction",
		value: function e(t, a) {
			if (!t) return null;
			if (g.a.isValidElement(t)) return g.a.cloneElement(t, {
				key: a
			});
			var r = Object(k["omit"])(t, ["iconType", "iconSet"]);
			return g.a.createElement(ir, {
				key: r.id,
				className: "p-message_actions_menu__" + r.id,
				action: r,
				onSelected: this.onSelectAction
			})
		}
	}, {
		key: "render",
		value: function e() {
			var t = this.props,
				a = t.ts,
				r = t.channelId,
				i = t.messageContainerType,
				o = t.onLoad,
				l = t.onMenuItemSelected,
				c = t.onSelectAction,
				u = t.canRunAppAction,
				d = t.appActions,
				p = t.slackActions,
				m = t.handleMessageAction,
				h = s()(t, ["ts", "channelId", "messageContainerType", "onLoad", "onMenuItemSelected", "onSelectAction", "canRunAppAction", "appActions", "slackActions", "handleMessageAction"]);
			return g.a.createElement(C["f"], n()({
				menuClassNames: "p-message_actions_menu",
				onMenuItemSelected: l,
				stripTerminalSeparators: true
			}, h), this.renderSlackActions(), g.a.createElement(C["d"], null), u && this.renderAppActions())
		}
	}]);
	return t
}(b["PureComponent"]);
ur.displayName = "MessageActionsMenu";
ur.defaultProps = cr;
var dr = function e(t, a) {
	var r = a.channelId,
		i = a.ts;
	var s = a.messageContainerType || M["MESSAGE_CONTAINERS"].MESSAGE_PANE;
	var o = Object(x["getMessageByTimestamp"])(t, r, i);
	var l = Object(S["isFeatureEnabled"])(t, "feature_file_threads");
	var c = Object(D["canRunAppAction"])(o, l);
	var u = Object(Za["canRunAppAction"])(t);
	var d = Object(rt["selectMessageActions"])(t),
		p = d.actions;
	var m = u && c;
	var h = Object(k["filter"])([$e(t, a), g.a.createElement(C["d"], null), Object(k["includes"])([M["MESSAGE_CONTAINERS"].THREADS_FLEXPANE, M["MESSAGE_CONTAINERS"].THREADS_VIEW, M["MESSAGE_CONTAINERS"].SLI_BRIEFING], s) && We(t, a), Z(t, a), Object(k["includes"])([M["MESSAGE_CONTAINERS"].MESSAGE_PANE, M["MESSAGE_CONTAINERS"].UNREAD_VIEW], s) && pe(t, n()({}, a, {
		allUnreads: s === M["MESSAGE_CONTAINERS"].UNREAD_VIEW
	})), De(t, a), _e(t, a), se(t, a), Ue(t, a), te(t, a)]);
	return {
		slackActions: h,
		appActions: p,
		canRunAppAction: m,
		clogger: Object(w["a"])({
			state: t
		})
	}
};
var pr = function e(t) {
	return {
		onLoad: function e() {
			return t(Object(rt["ensureFresh"])())
		},
		handleMessageAction: function e() {
			for (var a = arguments.length, r = Array(a), n = 0; n < a; n++) r[n] = arguments[n];
			return Lt.apply(void 0, r.concat([t]))
		},
		recordMessageActionFrecencyEvent: function e(a) {
			return t(R(a))
		}
	}
};
var mr = Object(y["connect"])(dr, pr)(ur);
a.d(t, false, function () {
	return ir
});
var hr = t["a"] = mr
}