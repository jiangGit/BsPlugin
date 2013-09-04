$(function(){
	init();
});
function init(){
	DB.init();
	initView();
	User.autoLogin(function(user){
			View.toView("#menu");
			$(".me .info").text(user.name);
		},function(){
			View.toView("#login");	
		});
		
	setInterval(function(){
		if(navigator.onLine){
			User.autoLogin(function(){
				Note.fetchAll();
				Wacom.fetchAll();
			});		
		}
	},60000);
}
function initView(){
	var main = Main();
	
	main.initHeader();
	main.initUnload();
	
	View.register("#menu",
		main.view_menu_fun,
		main.view_menu_listener,
		main.view_menu_data
	)
	
	View.register("#login",
		main.view_login_fun,
		main.view_login_listener,
		main.view_login_data
	)
	
	View.register("#register",
		main.view_register_fun,
		main.view_register_listener,
		main.view_register_data
	)
	
	View.register("#note_list",
		main.view_note_list_fun,
		main.view_note_list_listener,
		main.view_note_list_data
	)
	
	View.register("#note_edit",
		main.view_note_edit_fun,
		main.view_note_edit_listener,
		main.view_note_edit_data
	)
	
	View.register("#note_conflict",
		main.view_note_conflict_fun,
		main.view_note_conflict_listener,
		main.view_note_conflict_data
	)
	
	View.register("#wacom_list",
		main.view_wacom_list_fun,
		main.view_wacom_list_listener,
		main.view_wacom_list_data
	)
	
	View.register("#wacom_edit",
		main.view_wacom_edit_fun,
		main.view_wacom_edit_listener,
		main.view_wacom_edit_data
	)
	
	View.register("#wacom_conflict",
		main.view_wacom_conflict_fun,
		main.view_wacom_conflict_listener,
		main.view_wacom_conflict_data
	)
}

var Main=function(){
	
	return {
		initHeader:function(){
			$(".home").click(function(){
				User.autoLogin(function(user){
					View.toView("#menu");
					$(".me .info").text(user.username);
				},function(){
					View.toView("#login");	
				});
			});
			$(".quit").click(function(){
				User.quit(function(){
					View.toView("#login");
				});
			});
		
		},
		/*主菜单*/
		view_menu_fun:function(){
			
		},
		view_menu_listener:function(){
			$("#menu_note").click(function(){
				View.toView("#note_list");		
			});
			$("#menu_wacom").click(function(){
				View.toView("#wacom_list");		
			});
			$("#menu_quit").click(function(){
				User.quit(function(){
					tip("退出成功");
					View.toView("#login");
				});	
			});
		},
		view_menu_data:{},
	
		/*登录*/
		view_login_fun:function(){
			$(".header .ht").hide();		
		},
		view_login_listener:function(){
			function loginSuccess(user){
				var data = View.getData("#login");
				data.user = user;
				View.toView("#menu");
				$(".me .info").text(user.username);
				$(".header .ht").show();
				$(".header .back").hide();
				Note.fetchAll();
				Wacom.fetchAll();
			}
			function loginFail(){
				tip("登录失败！");
			}
			$("#login_btn").click(function(){
				var name = $("#login_username").val();
				var psw = $("#login_password").val();
				if(name == ""){
					tip("请填写用户名！");
					return;
				}
				if(psw == ""){
					tip("请填写密码！");
					return;
				}
				psw = $.md5(psw);
				User.login(name,psw,loginSuccess,loginFail);
			});
			
			$("#to_register").click(function(){
				View.toView("#register");
			});
		},
		view_login_data:{user:null},
		
		/*注册*/
		view_register_fun:function(){
		
		},
		view_register_listener:function(){
			function checkNameSuccess(){
			
			}
			function checkNameFail(){
				tip("用户名不可用！");
			}
			function registerSuccess(){
				tip("注册成功！");
				View.toView("#login");
			}
			function registerFail(){
				tip("注册失败！");
			}
			$("#register_btn").click(function(){
				var name = $("#register_username").val();
				var psw = $("#register_password").val();
				var pswR = $("#register_password_r").val();
				if(name == ""){
					tip("请填写用户名！");
					return;
				}
				if(psw == ""){
					tip("请填写密码！");
					return;
				}
				if(pswR == ""){
					tip("请填写确认密码！");
					return;
				}
				if(psw != pswR){
					tip("密码不一致！");
					return;
				}
				User.checkName( name,function(){
					psw = $.md5(psw);
					User.register(name,psw,registerSuccess,registerFail);
				},checkNameFail);
				
			});
			 $("#register_username").blur(function(){
				User.checkName( $(this).val(),checkNameSuccess,checkNameFail);
			 });
		},
		view_register_data:{},
		
		/*记事本列表*/
		view_note_list_fun:function(){
			tip("读取数据……");
			var data = View.getData("#note_list");
			function showNote(note){
				$("#note_view h2").html(note.title);
				$("#note_view .content").html(note.content);
				data.currentNote = note;
			}
			Note.getList(function(list){
				var oul = $("#note_list .left_list ul");
				var ul = $("<ul></ul>");
				var li ,note;
				for(var i=0;i<list.length;i++){
					note = list[i];
					li = $("<li></li>");
					li.attr("nid",note.id).html('<a>'+note.title+'</a><span class="rmBtn"></span>');
					if(i == 0){
						li.addClass("on");
						showNote(note);
					}
					ul.append(li);
				}
				if(list.length == 0){
					showNote({id:-1,title:"",content:""});
				}
				oul.after(ul).remove();
			},data.needFetch);
			data.needFetch = false;
		},
		view_note_list_listener:function(){
			var data = View.getData("#note_list");
			function showNote(note){
				$("#note_view h2").html(note.title);
				$("#note_view .content").html(note.content);
				data.currentNote = note;
			}
			$("#note_list .left_list").delegate("li","click",function(){
				$(this).siblings().removeClass("on").end().addClass("on");
				Note.get($(this).attr("nid"),function(note){
					showNote(note);
				});
			});
			$("#note_list .newBtn").click(function(){
				View.getData("#note_edit").currentNote = null;
				View.toView("#note_edit");
			});
			$("#note_list .edit_btn").click(function(){
				View.getData("#note_edit").currentNote = data.currentNote;
				View.toView("#note_edit");
			});
			$("#note_list .left_list").delegate(".rmBtn","click",function(){
				var id = $(this).parent().attr("nid");
				Note.del(id,function(){
					Note.fetchAll(function(){},function(){},function(){
						View.toView("#note_list");
					});
				},function(){
					tip("删除失败");
				});
			});
		},
		view_note_list_data:{currentNote:null,needFetch:false},
		
		/*记事本*/
		view_note_edit_fun:function(){
			var data = View.getData("#note_edit");
			if(data.currentNote){
				$("#note_edit input").val(data.currentNote.title);
				$("#note_edit .content").html(data.currentNote.content);
				$('#note_edit .content').wysiwyg('setContent',data.currentNote.content);
			}else{
				$("#note_edit input").val("");
				$("#note_edit .content").html("");
				$('#note_edit .content').wysiwyg('clear',"");
			}
			
		},
		view_note_edit_listener:function(){
			var data = View.getData("#note_edit");
			$('#note_edit .content').wysiwyg();
			$("#note_edit .save_btn").click(function(){
				if(data.currentNote && data.currentNote.id != -1){
					Note.update({id:data.currentNote.id,title:$("#note_edit input").val(),content:$("#note_edit .content").val(),versions:data.currentNote.versions},
						function(){
							var listData = View.getData("#note_list");
							listData.needFetch = true;
							View.toView("#note_list");
						},function(pre,loca){
							tip("版本冲突！");
							var conflictData = View.getData("#note_conflict");
							conflictData.pre=pre;
							conflictData.loca=loca;
							View.toView("#note_conflict");
						},function(res){
							tip(res.info);
						});
				}else{
					var note={
						title:$("#note_edit input").val(),
						content:$("#note_edit .content").val()
					};
					Note.add(note,function(n){
						var listData = View.getData("#note_list");
						listData.needFetch = true;
						View.toView("#note_list");
					},function(res){
						tip(res.info);
					});
				}
			});
		},
		view_note_edit_data:{currentNote:null},
		/*记事本冲突*/
		view_note_conflict_fun:function(){
			var data = View.getData("#note_conflict");
			console.log(data);
			$("#note_conflict .pre h2").text(data.pre.title);
			$("#note_conflict .pre .content").html(data.pre.content);
			$("#note_conflict .loca h2").text(data.loca.title);
			$("#note_conflict .loca .content").html(data.loca.content);
		},
		view_note_conflict_listener:function(){
			
			$("#note_conflict .pre .select_btn").click(function(){
				var listData = View.getData("#note_list");
				listData.needFetch = true;
				View.toView("#note_list");
			});
			$("#note_conflict .loca .select_btn").click(function(){
				var data = View.getData("#note_conflict");
				console.log(data);
				Note.force(data.loca,function(){
					var listData = View.getData("#note_list");
					listData.needFetch = true;
					View.toView("#note_list");
				},function(res){
					tip(res.info);
				});
			});
		},
		view_note_conflict_data:{pre:null,loca:null},
		/*手写板列表*/
		view_wacom_list_fun:function(){
			tip("读取数据……");
			var data = View.getData("#wacom_list");
			var ctx = data.ctx;
			function showWacom(wacom){
				data.currentWacom = wacom;
				$("#wacom_view h2").html(wacom.title);
				if(wacom != null && wacom.id != -1){
					var img = new Image();
					img.onload = function(){
						ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
						ctx.drawImage(img,0,0); 						
					};
					img.src = wacom.content;
				}else{
					ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				}			
			}
			Wacom.getList(function(list){
				var oul = $("#wacom_list .left_list ul");
				var ul = $("<ul></ul>");
				var li ,wacom;
				for(var i=0;i<list.length;i++){
					wacom = list[i];
					li = $("<li></li>");
					li.attr("nid",wacom.id).html('<a>'+wacom.title+'</a><span class="rmBtn"></span>');
					if(i == 0){
						li.addClass("on");
						showWacom(wacom);
					}
					ul.append(li);
				}
				if(list.length == 0){
					showWacom({id:-1,title:"",content:null});
				}
				oul.after(ul).remove();
			},data.needFetch);
			data.needFetch = false;
		},
		view_wacom_list_listener:function(){
			var data = View.getData("#wacom_list");
			var ctx = data.ctx;
			function showWacom(wacom){
				data.currentWacom = wacom;
				if(wacom != null){
					$("#wacom_view h2").html(wacom.title);
					var img = new Image();
					img.onload = function(){
						ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
						ctx.drawImage(img,0,0); 						
					};
					img.src = wacom.content;
				}else{
					ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				}			
			}
			$("#wacom_list .left_list").delegate("li","click",function(){
				$(this).siblings().removeClass("on").end().addClass("on");
				Wacom.get($(this).attr("nid"),function(wacom){
					showWacom(wacom);
				});
			});
			$("#wacom_list .newBtn").click(function(){
				View.getData("#wacom_edit").currentWacom = null;
				View.toView("#wacom_edit");
			});
			$("#wacom_list .edit_btn").click(function(){
				View.getData("#wacom_edit").currentWacom = data.currentWacom;
				View.toView("#wacom_edit");
			});
			$("#wacom_list .left_list").delegate(".rmBtn","click",function(){
				var id = $(this).parent().attr("nid");
				Wacom.del(id,function(){
					Wacom.fetchAll(function(){},function(){},function(){
						View.toView("#wacom_list");
					});
				},function(){
					alert("删除失败");
				});
			});
			
		},
		view_wacom_list_data:{
			ctx:$("#wacom_view canvas")[0].getContext('2d'),
			currentWacom:null,
			needFetch:false},
		
		/*手写板*/
		view_wacom_edit_fun:function(){
			var data = View.getData("#wacom_edit");
			var ctx = data.ctx;
			if(data.currentWacom){
				$("#wacom_edit input[name=title]").val(data.currentWacom.title);
				var img = new Image();
				img.onload = function(){
					ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
					ctx.drawImage(img,0,0); 
					ctx.beginPath();
				};
				img.src = data.currentWacom.content;
			}else{
				$("#wacom_edit input").val("");
				ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
				ctx.beginPath();
			}
		},
		view_wacom_edit_listener:function(){
			/*视图初始化 & 事件监听*/
			var data = View.getData("#wacom_edit");
			var ctx = data.ctx;
			var isDown = data.isDown;
			var size = 5;
			$("#wacom_edit canvas").mousedown(function(e){
				e.preventDefault();
			});
			$("#wacom_edit .tool").delegate("li","click",function(){
				var c = $(this).attr("class");
				$("#wacom_edit canvas").attr("class",c +"-pen");
				ctx.strokeStyle = $(this).attr("title");
				ctx.beginPath();
			});
			$("#wacom_edit .size").delegate("li","click",function(){
				var c = $(this).attr("class");
				size = parseInt(c.substring(1));
				ctx.lineWidth = size;
				ctx.beginPath();
			});
			
			$("#file").change(function(){
				var str = $(this).val();
				var pos = str.lastIndexOf(".");
				var lastname = str.substring(pos,str.length)  //此处文件后缀名也可用数组方式获得str.split(".")
				if (lastname.toLowerCase()!=".jpg" && lastname.toLowerCase()!=".gif" && lastname.toLowerCase()!=".png")
				{
					tip("必须是图片文件！");
					return false;
				}else{
					var img = new Image();
					img.onload = function(){
						ctx.drawImage(img,0,0); 
						ctx.beginPath();
					};
					var imageReader = new FileReader();
					imageReader.onload = (function(aFile) {
						return function(e) {
								img.src=e.target.result;
							};
						})($(this)[0].files.item(0));
					imageReader.readAsDataURL($(this)[0].files.item(0)); 
				}
			});
			
			ctx.strokeStyle = 'black'; //线条颜色，默认黑笔
			ctx.beginPath(); //开始画线
			$("#wacom_edit canvas").bind("mousedown",function(e){
				e = e || window.event; 
				isDown = true;
				ctx.moveTo(e.offsetX-1 , e.offsetY-1); 
			});
			$("#wacom_edit canvas").mousemove(function(e){
				!isDown || ctx.lineTo(e.offsetX -1 , e.offsetY -1 , 5, 5); //画笔画到哪一点
				ctx.stroke(); //画线函数
				ctx.save();
			}); 
			$("#wacom_edit canvas").bind("mouseleave mouseup",function(e){
				isDown = false;
			});

			$("#wacom_edit .save_btn").click(function(){
				ctx.beginPath();
				ctx.save();
				if(data.currentWacom){
					Wacom.update({id:data.currentWacom.id,title:$("#wacom_edit input").val(),content:ctx.canvas.toDataURL(),versions:data.currentWacom.versions},
							function(){
								var listData = View.getData("#wacom_list");
								listData.needFetch = true;
								View.toView("#wacom_list");
							},function(pre,loca){
								tip("版本冲突！");
								var conflictData = View.getData("#wacom_conflict");
								conflictData.pre=pre;
								conflictData.loca=loca;
								View.toView("#wacom_conflict");
							},function(res){
								tip(res.info);
							});

				}else{
					var wacom={
						title:$("#wacom_edit input").val(),
						content:ctx.canvas.toDataURL()
					};
					Wacom.add(wacom,function(n){
						var listData = View.getData("#wacom_list");
						listData.needFetch = true;
						View.toView("#wacom_list");
					},function(res){
						tip(res.info);
					});
				}
			});
		},
		view_wacom_edit_data:{
			/*视图使用数据*/
			ctx:$("#wacom_edit canvas")[0].getContext('2d'),
			isDown:false,
			currentWacom:null
		},
		/*手写板冲突*/
		view_wacom_conflict_fun:function(){
			var data = View.getData("#wacom_conflict");
			$("#wacom_conflict .pre h2").text(data.pre.title);
			var preCtx = $("#wacom_conflict .pre canvas")[0].getContext('2d');
			var preImg = new Image();
			preImg.onload = function(){
				preCtx.clearRect(0,0,preCtx.canvas.width,preCtx.canvas.height);
				preCtx.drawImage(preImg,0,0,650,450,0,0,500,350); 
			};
			preImg.src = data.pre.content;
			$("#wacom_conflict .loca h2").text(data.loca.title);
			var locaCtx = $("#wacom_conflict .loca canvas")[0].getContext('2d');
			var locaImg = new Image();
			locaImg.onload = function(){
				locaCtx.clearRect(0,0,locaCtx.canvas.width,locaCtx.canvas.height);
				locaCtx.drawImage(locaImg,0,0,650,450,0,0,500,350); 
			};
			locaImg.src = data.loca.content;
		},
		view_wacom_conflict_listener:function(){
			
			$("#wacom_conflict .pre .select_btn").click(function(){
				var listData = View.getData("#wacom_list");
				listData.needFetch = true;
				View.toView("#wacom_list");
			});
			$("#wacom_conflict .loca .select_btn").click(function(){
				var data = View.getData("#wacom_conflict");
				Wacom.force(data.loca,function(){
					var listData = View.getData("#wacom_list");
					listData.needFetch = true;
					View.toView("#wacom_list");
				},function(res){
					tip(res.info);
				});
			});
		},
		view_wacom_conflict_data:{pre:null,loca:null},
		
		initUnload:function(){
			var editView=["#note_edit","note_conflict","wacom_edit","wacom_conflict","#register"];
			$(window).bind('beforeunload',      
				function() {
					for(var i =0;i<editView.length;i++){
						if(View.currentView == editView[i]){
							return "确认离开将不会保存当前数据。";
						}
					}
				});
		}
	
	}
}
