describe("base.js的测试", function(){
	
	it("include方法，应该能正确引入javascript文件",function(){
		var scripts = base.include("scripts/b.js");
		expect(scripts).toMatch(/<script type="text\/javascript" src="scripts\/b.js"><\/script>/);
	});

	//	var si = base.setCookies('uname','haix',1);
	/*it("setCookie方法用来添加cookie",function(){
	
		var s = base.setCookie({name:'uname',value:'haix'});
		expect(s).toBeTruthy();

	});*/

	it("setCookie方法用来添加cookie",function(){

		var s = base.setCookie({name:'uname',value:'haix',path:'/'});
		expect(s).toBeTruthy();

	});
	

	it("getCookie方法用来获取cookie", function(){
	
		var s = base.getCookie('uname');
		expect(s).toMatch(/haix/);
	});
});
