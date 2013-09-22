describe("base.js的测试", function(){
	
	it("ceshi",function(){
		var a = 12;
		expect(a).toEqual(12);
	});

	it("include方法，应该能正确引入javascript文件",function(){
		var scripts = base.include("scripts/b.js");
		expect(scripts).toMatch(/<script type="text\/javascript" src="scripts\/b.js"><\/script>/);
	});

});
