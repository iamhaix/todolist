describe("index.js测试",function(){
	
	describe("user",function(){

		var uname = null;
		var passwd = null;
		var email = null;

		it("isRightFormat:'h12'应该是一个合格的用户名",function(){
			
			uname = 'h12';
			expect(user.isRightFormat('username',uname)).toBeTruthy();
		});

		it("isRightFormat:'ha'应该是一个不合格的用户名",function(){
			
			uname = 'ha';
			expect(user.isRightFormat('username',uname)).toBeFalsy();
		});

		it("isRightFormat:'haixis1234567812'应该是一个合格的用户名",function(){
			
			uname = 'haixis1234567812';
			expect(user.isRightFormat('username',uname)).toBeTruthy();
		});

		it("isRightFormat:'haix1234567891234'应该是一个不合格的用户名",function(){
			
			uname = 'haix1234567891234';
			expect(user.isRightFormat('username',uname)).toBeFalsy();
		});

		it("isRightFormat:'h1a2i3x'应该是一个合格的用户名",function(){
			
			uname = 'h1a2i3x';
			expect(user.isRightFormat('username',uname)).toBeTruthy();
		});

		//--------------测密码------------
		
		it("isRightFormat:'12ha@x'应该是一个合格的密码",function(){
			
			passwd = '12haix';
			expect(user.isRightFormat('password',passwd)).toBeTruthy();
		});
		
		it("isRightFormat:'h1a2i'应该是一个不合格的密码",function(){
			
			passwd = 'h1a2i';
			expect(user.isRightFormat('password',passwd)).toBeFalsy();
		});

		it("isRightFormat:'haix12345678901#'应该是一个合格的密码",function(){
			
			passwd = 'haix12345678901#';
			expect(user.isRightFormat('password',passwd)).toBeTruthy();
		});

		it("isRightFormat:'haix12345678901#0'应该是一个不合格的密码",function(){
			
			passwd = 'haix12345678901#0';
			expect(user.isRightFormat('password',passwd)).toBeFalsy();
		});
	
		
	});

});