var Note ={
	getList:function(callback,isCloud){
		if(isCloud){
			Note.fetchAll(callback,function(res){
				callback(null);
			});
		}else{
			DB.query(Config.noteTable,"* ",null,[],function(rs){
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
			Note.fetch(id,callback,function(){
				callback(null);
			});
		}else{
			DB.query(Config.noteTable,"* "," id = ?",[id],function(rs){
				if(rs.rows.length > 0){
					var note = rs.rows.item(0);
					callback(note);
				}else{
					callback(null);
				}
			});
		}
	},
	fetch:function(id,success,fail){
		$.post(Config.home+"/note/get",{id:id},function(data){
			if(data.res.state == "ok"){
				var note = data.note;
				DB.query(Config.noteTable,"count(*) as c"," id = ?",[id],function(rs){
					var row = rs.rows.item(0);
					var count = row["c"];
					if(count > 0){
						/*记录存在*/
						DB.update(Config.noteTable,
							"title = ?, content = ?,versions = ?,creat_time = ?, update_time =?",
							"id = "+ id,
							[note.title,note.content,note.versions,note.creatTime,note.updateTime]);
					}else{
						/*记录不存在*/
						DB.insert(Config.noteTable,
							"id,title,content,versions,creat_time,update_time",
							[note.id,note.title,note.content,note.versions,note.creatTime,note.updateTime]);
					}
				});
				if(typeof success == "function"){
					success(note);
				}
		
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}	
			}
		},"json");
	},
	fetchAll:function(success,fail,dbSuccess){
		$.post(Config.home+"/note/list",{},function(data){
			if(data.res.state == "ok"){
				var list = data.list;
				DB.clearTable(Config.noteTable,function(){
					for(var i=0;i< list.length; i++){
						var note = list[i];					
						DB.insert(Config.noteTable,
							"id,title,content,versions,creat_time,update_time",
							[note.id,note.title,note.content,note.versions,note.creatTime,note.updateTime],dbSuccess);
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
		$.post(Config.home+"/note/del",{id:id},function(data){
			if(data.res.state == "ok"){
				var note = data.note;
				DB.del(Config.noteTable,"id =?",[id]);
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
	update:function(note,success,conflict,fail){
		$.post(Config.home+"/note/update",note,function(data){
			if(data.res.state == "ok"){
				DB.update(Config.noteTable,
					"title = ?, content = ?,versions = ?,creat_time = ?, update_time =?",
					"id = "+ data.note.id,
					[data.note.title,data.note.content,data.note.versions,data.note.creatTime,data.note.updateTime]);
				if(typeof success == "function"){
					success(data.note);
				}
			}else if(data.res.state == "conflict"){
				if(typeof conflict == "function"){
					conflict(data.note,note);
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}
			}
		},"json");
	},
	force:function(n,success,fail){
		console.log(n);
		$.post(Config.home+"/note/update/force",n,function(data){
			if(data.res.state == "ok"){
				var note = data.note;
				DB.update(Config.noteTable,
					"title = ?, content = ?,versions = ?,creat_time = ?, update_time =?",
					"id = "+ note.id,
					[note.title,note.content,note.versions,note.creatTime,note.updateTime]);
				if(typeof success == "function"){
					success(note);
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}
			}
		},"json");
	},
	add:function(n,success,fail){
		$.post(Config.home+"/note/add",n,function(data){
			if(data.res.state == "ok"){
				var note = data.note;
				DB.insert(Config.noteTable,
					"id,title,content,versions,creat_time,update_time",
					[note.id,note.title,note.content,note.versions,note.creatTime,note.updateTime],
					function(){
					
					});
				if(typeof success == "function"){
					success(note);
				}
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}
			}
		},"json");
	}
}