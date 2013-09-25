describe("base.js的测试", function(){

	it("include方法:引入javascript文件",function(){
		var scripts = base.include('todolist/msg.js');
		expect(scripts).toMatch(/todolist\/msg.js/);
	});

	it("setCookie:添加cookie",function(){

		var s = base.setCookie({name:'uname',value:'haix',path:'/'});
		expect(s).toBeTruthy();

	});
	
	it("getCookie:获取cookie", function(){
	
		var s = base.getCookie('uname');
		expect(s).toMatch(/haix/);
	});

});


