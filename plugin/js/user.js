var User = {
	name:null,
	verify:false,
	login:function(name,psw,success,fail){
		$.post(Config.home+"/user/login",{username:name,psw:psw},function(data){
			if(data.res.state == "ok"){
				var uid = DB.getValue(Config.userIdKey);
				if(data.user.id != uid){
					DB.clearTable(Config.noteTable);
					DB.clearTable(Config.wacomTable);
					DB.setValue(Config.userIdKey,data.user.id);
					DB.setValue(Config.usernameKey,name);
					DB.setValue(Config.pswKey,psw);
				}else{
					DB.setValue(Config.pswKey,psw);
				}
				if(typeof success == "function"){
					success(data.user);
				}	
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}	
			}
		},"json");
	},
	register:function(name,psw,success,fail){
		$.post(Config.home+"/user/register",{username:name,psw:psw},function(data){
			if(data.res.state == "ok"){
				if(typeof success == "function"){
					success(data.user);
				}	
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}	
			}
		},"json");
	},
	checkName:function(name,success,fail){
		$.post(Config.home+"/user/check",{username:name},function(data){
			if(data.res.state == "ok"){
				if(typeof success == "function"){
					success(data.user);
				}	
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}	
			}
		},"json");
	},
	quit:function(callback){
		DB.clearValue(Config.userIdKey);
		DB.clearValue(Config.usernameKey);
		DB.clearValue(Config.pswKey);
		$.get(Config.home+"/user/logout",{},function(data){
			if(data.res.state == "ok"){
				if(typeof callback == "function"){
					callback(data.res);
				}
			}	
		},"json");
	},
	checkLogin:function(success,fail){
		$.get(Config.home+"/user/me",{},function(data){
			if(data.res.state == "ok"){
				if(typeof success == "function"){
					success(data.user);
				}	
			}else{
				if(typeof fail == "function"){
					fail(data.res);
				}	
			}
		},"json");
	},
	autoLogin:function(success,fail){
		User.checkLogin(success,function(){
			var username = DB.getValue(Config.usernameKey);
			var psw = DB.getValue(Config.pswKey);
			if(username ==null || psw == null){
				if(typeof fail == "function"){
					fail();
				}
			}else{
				User.login(username,psw,success,fail);
			}
		});
	}
}