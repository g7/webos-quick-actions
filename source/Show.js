enyo.kind({
	name: "QuickActions.Show",
	kind: enyo.SlidingView,
	layoutKind: enyo.VFlexLayout,
	components : [
		{kind: enyo.Header, style: "min-height: 60px;", layoutKind: enyo.HFlexLayout, components: [
			{content: "", name: "selectedItemName", style: "text-overflow: ellipsis; overflow: hidden;  white-space: nowrap;", flex: 1},
		]},
		{kind: enyo.Scroller, name: "showScroller", flex: 20, autoHorizontal: false, horizontal: false, components: [
			{kind: "RowGroup", caption: $L("General"), name: "row_general", onSaveData: "doSaveData", components: [
				{kind: "Picker", label: $L("Choose an action"), name: "actionPicker", onChange: "setAction"},
				{kind: "Input", autoCapitalize: "lowercase", name: "actionName", hint: $L("Name"), onchange: "doSaveData"},
			]},
			
			{kind: "RowGroup", caption: "", name: "row_type", components: []},
		]},
		{flex :1},
		{kind: enyo.Toolbar, pack: "justify", components: [
			{kind: enyo.GrabButton},
			//{flex: 1},
			//{caption: "Salva", onclick: "doSaveData"},
			//{caption: "Genera", onclick: "doGenerateCodice"},
		]}
	],
	
	setAction: function(inSender, inValue) {
		this.owner.actionSet(inValue);
		
		this.owner.doSave();
	},
	
	events: {
		"onClipboardCopy": "",
		"onGenerateCodice": "",
		"onSaveData": "",
		"onListTap": "",
		"onRefreshTap": ""
	} 

});
