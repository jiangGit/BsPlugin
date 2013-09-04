function tip(msg){
	$.blockUI({ 
				message: msg,
				css: {
					border: 'none',
					padding: '15px',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius': '10px',
					opacity: .8,
					color: '#fff'
				}
			});
	$('.blockOverlay').attr('title','单击关闭').click($.unblockUI); 
	setTimeout($.unblockUI, 1200); 
}