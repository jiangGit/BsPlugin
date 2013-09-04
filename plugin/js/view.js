var View = {
	currentView:null,
	data:[],
	/*
		��ͼid����ͼ��ʾʱִ�з�����Ϊ��ͼʵ�ּ���
	*/
	register:function(viewId,fun,listener,data){
		var has = false;
		for(var i = 0; i < View.data.length; i++){
			var v = View.data[i];
			if(v.viewId == viewId){
				has = true;
				return;
			}
		}
		View.data.push({viewId:viewId,fun:fun,data:data});
		try{
			if(typeof listener == "function"){
				listener();
			}	
		}catch(e){
			console.log(e);
		}
	},
	/*
		��ͼid����ͼ��ʾʱִ�з���
	*/
	toView:function(viewId,fun){
		if(View.currentView != null){
			$(View.currentView).slideUp();
		}
		View.currentView = viewId;
		for(var i = 0; i < View.data.length; i++){
			var v = View.data[i];
			if(v.viewId == viewId){
				if(typeof v.fun == "function"){
					//try{
						v.fun();
					//}catch(e){
						//console.log(e);
					//}
				}
			}
		}
		try{
			if(typeof fun == "function"){
				fun();
			}	
		}catch(e){
			console.log(e);
		}
		$(View.currentView).slideDown();
	},
	getData:function(viewId){
		for(var i = 0; i < View.data.length; i++){
			var v = View.data[i];
			if(v.viewId == viewId){
				return v.data;
			}
		}
		return {};
	},
	setData:function(viewId,data){
		for(var i = 0; i < View.data.length; i++){
			var v = View.data[i];
			if(v.viewId == viewId){
				v.data = data;
			}
		}
	}
	
}