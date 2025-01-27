========================== AUTHENTICATION ==============================
1. REGISTER
[POST]: https://localhost:8888/register
[Body]: email, name, phone, password, confirmedPassword
[response]: 
- Thành công: 201: success': `New user with email ${email} created!
- Thất bại:
 + 400: Thiếu dữ liệu
 + 500: Lỗi server
2. LOGIN
[POST]: https://localhost:8888/login
[Body]: email, password
[Headers]: Authorization: Bearer <accessToken>
[response]:
- Thành công: 200: accessToken
- Thất bại: 
 + 400: Thiếu dữ liệu
 + 401: Lỗi xác thực/Không tồn tại người dùng
 + 500: Lỗi server
3. REFRESH
[GET]: https://localhost:8888/refresh
[response]:
- Thành công: 200: accessToken
- Thất bại:
 + 401
   --> Nếu không có refresh token trong cookie.
   --> Nếu refresh token đã hết hạn hoặc không hợp lệ.
 + 403: Forbidden
   --> Mã refreshToken hết hạn
4. LOGOUT
[POST]: https://localhost:8888/logout
[response]:
- Thành công: 204: Đăng xuất thành công
- Thất bại: 500: Lỗi server

========================== ACCOUNT ==============================
1. Profile: Xem thông tin người dùng
[GET]: https://localhost:8888/account/profile
[Headers]: Authorization: Bearer <accessToken>
[response]:
- Thành công: 200
{
    "message": "Thông tin tài khoản được lấy thành công",
    "user": {
        "email": "example@example.com",
        "name": "John Doe",
        "phone": "0123456789",
        "gender": "male",
        "birthday": "1990-01-01"
    }
}
- Thất bại:
+ 404: "Người dùng không tồn tại"
+ 500: "Đã có lỗi trong quá trình lấy thông tin người dùng"

2. Update Profile: Cập nhật thông tin người dùng
[PUT]: https://localhost:8888/account/profile
[Headers]: Authorization: Bearer <accessToken>
[Body]
{
    "name": "John Doe",
    "phone": "0123456789",
    "gender": "male",
    "birthday": "1990-01-01"
}
[Response]:
- Thành công: 200
{
    "message": "Tài khoản được cập nhật thành công",
    "updatedUser": {
        "email": "example@example.com",
        "name": "John Doe",
        "phone": "0123456789",
        "gender": "male",
        "birthday": "1990-01-01"
    }
}
- Thất bại:
+ 400: "Mọi trường đều phải được nhập"
+ 404: "Người dùng không tồn tại"
+ 500: "Đã có lỗi trong quá trình cập nhật tài khoản"

3. Get all address: Hiển thị toàn bộ địa chỉ đã thêm
[GET]: https://localhost:8888/account/address
[Headers]: Authorization: Bearer <accessToken>
[Response]:
- Thành công: 200
{
    "message": "Địa chỉ được lấy thành công",
    "allAddress": [
        {
            "id": 1,
            "name": "John Doe",
            "phone": "0123456789",
            "country": "Vietnam",
            "city": "Hanoi",
            "district": "Cau Giay",
            "ward": "Dich Vong",
            "address": "123 ABC Street"
        }
    ]
}
- Thất bại:
+ 404: "Chưa có địa chỉ"
+ 500: "Đã có lỗi trong quá trình lấy địa chỉ"

4. Create Address: Thêm địa chỉ mới
[POST]: https://localhost:8888/account/create-address
[Headers]: Authorization: Bearer <accessToken>
[Body]:
{
    "name": "John Doe",
    "phone": "0123456789",
    "country": "Vietnam",
    "city": "Hanoi",
    "district": "Cau Giay",
    "ward": "Dich Vong",
    "address": "123 ABC Street"
}
[Response]:
- Thành công: 200
{
    "message": "Địa chỉ được tạo thành công",
    "address": {
        "id": 2,
        "name": "John Doe",
        "phone": "0123456789",
        "country": "Vietnam",
        "city": "Hanoi",
        "district": "Cau Giay",
        "ward": "Dich Vong",
        "address": "123 ABC Street"
    }
}
- Thất bại:
 + 400: "Mọi trường đều phải được nhập"
 + 500: "Đã có lỗi trong quá trình thêm địa chỉ"

5. Update Address: Cập nhật thông tin địa chỉ đã đăng ký
[PUT]: https://localhost:8888/account/update-address/:id_address
[Headers]: Authorization: Bearer <accessToken>
[Body]:
{
    "name": "Jane Doe",
    "phone": "0987654321",
    "country": "Vietnam",
    "city": "HCMC",
    "district": "District 1",
    "ward": "Ben Nghe",
    "address": "456 XYZ Street"
}
[Response]:
- Thành công: 200
{
    "message": "Địa chỉ được cập nhật thành công",
    "updatedAddress": {
        "id": 2,
        "name": "Jane Doe",
        "phone": "0987654321",
        "country": "Vietnam",
        "city": "HCMC",
        "district": "District 1",
        "ward": "Ben Nghe",
        "address": "456 XYZ Street"
    }
}
- Thất bại:
+ 400: "Mọi trường đều phải được nhập"
+ 404: "Không tìm thấy địa chỉ"
+ 500: "Đã có lỗi trong quá trình cập nhật địa chỉ"

6. Delete Address: Xóa một địa chỉ
[DELETE]: http://localhost:8888/account/delete-address
[Headers]: Authorization: Bearer <accessToken>
[Body]: Cái này thì gửi kẹp theo phương thức đi lên 
{
    "id_address": 2
}
[Response]:
- Thành công: 200
{
    "message": "Địa chỉ được xóa thành công"
}
- Thất bại:
 + 400: "Mọi trường đều phải được nhập"
 + 404: "Không tìm thấy địa chỉ"
 + 500: "Đã có lỗi trong quá trình xóa địa chỉ"

7. Change Password: Thay đổi mật khẩu người dùng
[PUT]: http://localhost:8888/account/password
[Headers]: Authorization: Bearer <accessToken>
[Body]:
{
    "password": "oldPassword123",
    "newPassword": "newPassword456",
    "newPasswordAgain": "newPassword456"
}
[Response]:
- Thành công: 200
{
    "message": "Mật khẩu được cập nhật thành công"
}
- Thất bại:
 + 400:
    "Mọi trường đều phải được nhập"
    "Mật khẩu không khớp"
 + 401: "Mật khẩu cũ không đúng"
 + 404: "Không tìm thấy người dùng"
 + 500: "Đã xảy ra lỗi trong quá trình cập nhật mật khẩu"

========================== CART ==============================
1. Lấy toàn bộ sản phẩm trong giỏ hàng
[GET]: https://localhost:8888/cart
[Response]:
- Thành công: 200
{
    success: true,
    message: "Lấy sản phẩm trong giỏ hàng thành công",
    cart: cart
}
- Thất bại:
+ 500: .
    {
        "success": false,
        "message": "Đã xảy ra lỗi trong quá trình lấy sản phẩm trong giỏ hàng"
    }

2. Thêm vào giỏ hàng
[POST]: https://localhost:8888/cart/add
[Body]: 
{
    "id_book": "string",
    "quantity": "number"
}
[Response]:
- Thành công: 200
    {
        success: true,
        message: "Sản phẩm được thêm vào giỏ hàng thành công",
        cart: cart
    }
- Thất bại: 
+ 500: Lỗi khi thêm sản phẩm.
    {
        "success": false,
        "message": "Đã xảy ra lỗi trong quá trình thêm sản phẩm"
    }

3. Cập nhật số lượng sản phẩm trong giỏ hàng:
[PATCH]: https://localhost:8888/cart/update
[Body]:
{
    "id_book": "string",
    "quantity": "number"
}
[Response]:
- Thành công: 200
    {
        success: true,
        message: "Số lượng được cập nhật thành công",
        cart: cart
    }
- Thất bại: Lỗi khi cập nhật số lượng
    {
        success: false,
        message: "Đã xảy ra lỗi trong khi xóa sản phẩm",
    }

3. Xóa sản phẩm trong giỏ hàng
[DELETE]: https://localhost:8888/cart/delete
[Body]:
{
    "id_book": "string",
}
[Response]:
- Thành công: 200
    {
        success: true,
        message: "Sản phẩm được xóa thành công",
        cart: cart 
    }
- Thất bại: Lỗi khi xóa sản phẩm
    {
        success: false,
        message: "Đã xảy ra lỗi trong khi xóa sản phẩm",
    }
    





