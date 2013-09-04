var Wacom ={
	getList:function(callback,isCloud){
		if(isCloud){
			Wacom.fetchAll(callback,function(res){
				callback(null);
			});
		}else{
			DB.query(Config.wacomTable," * ",null,[],function(rs){
				var list = [];
				for(var i =0; i< rs.rows.length;i++){
					list.push(rs.rows.item(i));
				}
				callback(list);
			});
		}
	},
	get:function(id,callback,isCloud){
		if(isCloud){
			Wacom.fetch(id,callback,function(){
				callback(null);
			});
		}else{
			DB.query(Config.wacomTable,"* "," id = ?",[id],function(rs){
				if(rs.rows.length > 0){
					var wacom = rs.rows.item(0);
					callback(wacom);
				}else{
					callback(null);
				}
			});
		}
	},
	fetch:function(id,success,fail){
		$.post(Config.home+"/wacom/get",{id:id},function(data){
			if(data.res.state == "ok"){
				var wacom = data.wacom;
				DB.query(Config.wacomTable,"count(*) as c"," id = ?",[id],function(rs){
					var row = rs.rows.item(0);
					var count = row["c"];
					if(count > 0){
						/*记录存在*/
						DB.update(Config.wacomTable,
							"title = ?, content = ?,versions = ?,creat_time = ?, update_time =?",
							"id = "+ id,
							[wacom.title,wacom.content,wacom.versions,wacom.creatTime,wacom.updateTime]);
					}else{
						/*记录不存在*/
						DB.insert(Config.wacomTable,
							"id,title,content,versions,creat_time,update_time",
							[wacom.id,wacom.title,wacom.content,wacom.versions,wacom.creatTime,wacom.updateTime]);
					}
				});
				if(typeof success == "function"){
					success(wacom);
				}
		
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}	
			}
		},"json");
	},
	fetchAll:function(success,fail,dbSuccess){
		$.post(Config.home+"/wacom/list",{},function(data){
			if(data.res.state == "ok"){
				var list = data.list;
				DB.clearTable(Config.wacomTable,function(){
					for(var i=0;i< list.length; i++){
						var wacom = list[i];					
						DB.insert(Config.wacomTable,
							"id,title,content,versions,creat_time,update_time",
							[wacom.id,wacom.title,wacom.content,wacom.versions,wacom.creatTime,wacom.updateTime],dbSuccess);
					}
				});		
				if(typeof success == "function"){
					success(list);
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}	
			}
		},"json");
	},
	del:function(id,success,fail){
		$.post(Config.home+"/wacom/del",{id:id},function(data){
			if(data.res.state == "ok"){
				var wacom = data.wacom;
				DB.del(Config.wacomTable,"id =?",[id]);
				if(typeof success == "function"){
					success();
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}
			}
		},"json");
	},
	update:function(w,success,conflict,fail){
		$.post(Config.home+"/wacom/update",w,function(data){
			if(data.res.state == "ok"){
				var wacom = data.wacom;
				DB.update(Config.wacomTable,
					"title = ?, content = ?,versions = ?,creat_time = ?, update_time =?",
					"id = "+ wacom.id,
					[wacom.title,wacom.content,wacom.versions,wacom.creatTime,wacom.updateTime]);
				if(typeof success == "function"){
					success(wacom);
				}
			}else if(data.res.state == "conflict"){
				if(typeof conflict == "function"){
					conflict(data.wacom,w);
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}
			}
		},"json");
	},
	force:function(wacom,success,fail){
		$.post(Config.home+"/wacom/update/force",wacom,function(data){
			if(data.res.state == "ok"){
				var wacom = data.wacom;
				DB.update(Config.wacomTable,
					"title = ?, content = ?,versions = ?,creat_time = ?, update_time =?",
					"id = "+ wacom.id,
					[wacom.title,wacom.content,wacom.versions,wacom.creatTime,wacom.updateTime]);
				if(typeof success == "function"){
					success(wacom);
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}
			}
		},"json");
	},
	add:function(wacom,success,fail){
		$.post(Config.home+"/wacom/add",wacom,function(data){
			if(data.res.state == "ok"){
				var wacom = data.wacom;
				DB.insert(Config.wacomTable,
					"id,title,content,versions,creat_time,update_time",
					[wacom.id,wacom.title,wacom.content,wacom.versions,wacom.creatTime,wacom.updateTime],
					function(){
					
					});
				if(typeof success == "function"){
					success(wacom);
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}
			}
		},"json");
	}
	
}