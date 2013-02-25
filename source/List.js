enyo.kind({
	name: "QuickActions.List",
	kind: enyo.SlidingView,
	layoutKind: enyo.VFlexLayout,
	components : [
		{kind: enyo.Header, style: "min-height: 60px;", components: [
			{content: $L("webOS Quick Actions")}
		]},
		{flex: 1, name: "actionList", kind: "DbList", pageSize: 50, onQuery: "listQuery", onSetupRow: "setupActions", components: [
			{kind: enyo.SwipeableItem, onclick:"doListTap", onConfirm: "doDeleteAction", layoutKind: enyo.VFlexLayout, tapHighlight: true, components: [
				{name: "listItemName", content: "", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"},
				{name: "listItemType", content: "", style: "font-size: 0.75em"},
			]}
		]},
		{kind: enyo.Toolbar, pack: "justify", components: [
			{flex: 1},
			{icon: "images/menu-icon-new.png", onclick: "doNewActionTap", align: "right"}
		]},
	],

	setupActions: function(inSender, inRecord, inIndex) {
		if (inRecord.name != "") {
			this.$.listItemName.setContent(inRecord.name);
		}
		else {
			this.$.listItemName.setContent($L("Untitled"));
		}
		this.$.listItemType.setContent(inRecord.type);
	},

	listQuery: function(inSender, inQuery) {
		//inQuery.orderBy = "name";
		return this.owner.$.dbFind.call({query: inQuery});
	},

	events: {
		"onListTap": "",
		"onNewActionTap": "",
		"onDeleteAction": ""
	} 
});
