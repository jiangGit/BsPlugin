var DB ={
	Database:null,
	init:function(){
		DB.databas = openDatabase(Config.database,"1.0","数据库",50 * 1024 * 1024);
		DB.databas.transaction(function(tx){
			tx.executeSql('create table if not exists '+Config.noteTable+'( id integer PRIMARY KEY, title text,content text,versions integer,creat_time text,update_time text)',[]);
		});
		DB.databas.transaction(function(tx){
			tx.executeSql('create table if not exists '+Config.wacomTable+'( id integer PRIMARY KEY, title text,content text,versions integer,creat_time text,update_time text)',[]);
		});
	},
	clear:function(){
		DB.databas.transaction(function(tx){
			tx.executeSql('drop table '+Config.noteTable,[]);
		});
		DB.databas.transaction(function(tx){
			tx.executeSql('drop table '+Config.wacomTable,[]);
		});
	},
	clearTable:function(table,callback){
		DB.databas.transaction(function(tx){
			tx.executeSql('delete from '+table,[],function(){
				if(typeof callback == "function"){
					callback();
				}
			},
			DB.errorHandler);
		});
	},
	query:function(table,arg,where,data,callback){
		DB.databas.transaction(function(tx){
			tx.executeSql('select ' +arg+ ' from ' +table+(where && where.length >0 ? ' where '+where: ''),data,
				function(tx,rs){
					callback(rs);
				},
				DB.errorHandler);
		});
	},
	update:function(table,set,where,data,callback){
		DB.databas.transaction(function(tx){
			tx.executeSql('update '+table+' set '+ set +(where && where.length >0 ? ' where '+where: ''),data,
				callback,
				DB.errorHandler);
		});
	},
	insert:function(table,arg,data,callback){
		DB.databas.transaction(function(tx){
			var str ='';
			for(var i = 0;i< data.length -1;i++){
				str += '?,'
			}
			if(data.length > 0){
				str += '?'
			}		
			tx.executeSql('insert into '+table+' ('+arg+') values( '+str+' )',data,
				callback,
				DB.errorHandler);
		});
	},
	del:function(table,where,data,callback){
		DB.databas.transaction(function(tx){
			tx.executeSql('delete from '+table+(where && where.length >0 ? ' where '+where: ''),data,
				callback,
				DB.errorHandler);
		});
	},
	getValue:function(key){
		return window.localStorage.getItem(key);
	},
	setValue:function(key,value){
		window.localStorage.setItem(key,value);
	},
	clearValue:function(key){
		window.localStorage.removeItem(key);
	},
	nullDataHandler:function(tx,rs){
	
	},
	errorHandler:function(tx,err){
		console.log(err);
	}
	
}