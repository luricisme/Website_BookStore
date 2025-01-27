# Genre trong api gọi để INT: 1-7, nó là id danh mục trong bảng Categories

# api detail book
http://localhost:8888/detail-book?id=1

 - Dữ liệu trả về:  return res.json({
                        success: true,
                        message: 'Lấy thông tin sách thành công',
                        data: result.data,
                        reviews: result.review,              
                        relatedBooks: relatedBooks.data      // 4 book liên quan
                    });

---------------------------------------------
# api search book
Filter sẽ bao gồm: genre, startPrice - endPrice, age, có 3 mục sort (chỉ chọn 1 trong 3 để sort): discounted_price, sold_quantity, rating_count: tăng dần thì 'asc', giảm dần thì 'desc'
# 1. Khi tìm kiếm lần đầu tiên (Không chọn các mục filter):
http://localhost:8888/search?keyword=the+f&page=1

# 2. Khi chọn filter:
Với mục filter nào không chọn thì để trống, và sort để trống hoặc chọn 1 trong 3 ( Không đồng thời nhiều cái)

ví dụ 1 api: Hủy chọn filter (cơ bản giống 1, nhưng đang ở filter)
http://localhost:8888/search/filter?keyword=&page=1

ví dụ 2 api: Chọn genre
http://localhost:8888/search/filter?keyword=&page=1&genre=1

ví dụ 3 api: Chọn sort theo giá (giảm dần), độ tuối:
http://localhost:8888/search/filter?keyword=&page=1&genre=1&discounted_price=desc&age=adult

ví dụ 4 api: Chọn sort theo số lượng bán (tăng dần), độ tuối, giá từ 100000 đến 200000:
http://localhost:8888/search/filter?keyword=&page=1&genre=1&sold_quantity=asc&age=adult&startPrice=100000&endPrice=200000

## api hoàn chỉnh: Chọn full các filter

http://localhost:8888/search/filter?keyword=&page=1&genre=1&age=adult&startPrice=100000&endPrice=200000&sold_quantity=asc

 - Dữ liệu trả về:  return res.json({
                        success: true,
                        per_page: result.per_page,
                        total_pages: result.total_pages,
                        current_page: result.current_page,
                        total_records: result.total_records,
                        genres : genres.data,                   // categories
                        message: 'Tìm kiếm thành công',
                        data: result.data,
                    });

----------------------------------------------
# api thể loại book
Filter sẽ bao gồm: startPrice - endPrice, age, có 3 mục sort (chỉ chọn 1 trong 3 để sort): discounted_price, sold_quantity, rating_count: tăng dần thì 'asc', giảm dần thì 'desc'
# 1. Khi chọn thể loại lần đầu tiên (Không chọn các mục filter):
https://localhost:8888/get-list?genre=1&page=1

# 2. Khi chọn filter:
Với mục filter nào không chọn thì để trống, và sort để trống hoặc chọn 1 trong 3 ( Không đồng thời nhiều cái)

ví dụ 1 api: Hủy chọn filter (cơ bản giống 1, nhưng đang ở filter)
http://localhost:8888/get-list/filter?genre=1&page=1

ví dụ 2 api: Chọn sort theo giá (giảm dần), độ tuối:
http://localhost:8888/get-list/filter?genre=1&page=1&discounted_price=desc&age=adult

ví dụ 3 api: Chọn sort theo số lượng bán (tăng dần), độ tuối, giá từ 100000 đến 200000:
http://localhost:8888/get-list/filter?genre=1&page=1&sold_quantity=asc&age=adult&startPrice=100000&endPrice=200000

## api hoàn chỉnh: Chọn full các filter

http://localhost:8888/get-list/filter?genre=1&page=1&age=adult&startPrice=100000&endPrice=200000&sold_quantity=asc

 - Dữ liệu trả về:  return res.json({
                        success: true,
                        message: 'Tìm kiếm thành công',
                        per_page: result.per_page,
                        total_pages: result.total_pages,
                        current_page: result.current_page,
                        total_records: result.total_records,
                        data: result.data,
                    });

----------------------------------------------
# api trang home
http://localhost:8888

 - Dữ liệu trả về:  return res.json({
                        success: true,
                        message: 'Lấy thông tin sách thành công',
                        posters: posters.data,                  // poster
                        topBooks: topBooks.data,                // Top 4 sách bán chạy
                        economyBooks: economyBooks.data,        // 4 sách thuộc Kinh tế
                        psychologyBooks: psychologyBooks.data,  // 4 sách thuộc Tâm lý
                        literaryBooks: literaryBooks.data,      // 4 sách thuộc Văn học
                        novelBooks: novelBooks.data,            // 4 sách thuộc Tiểu thuyết
                    });

# api danh mục
http://localhost:8888/genres

 - Dữ liệu trả về:  return res.json({
                    success: true,
                    message: 'Lấy thông tin danh mục thành công',
                    genres : genres.data,                   // categories
                });



---------------------------------------------------------------------------------------
# api review [POST]

https://localhost:8888/detail-book/review

    Đặt tên (name) bắt buộc cho các thẻ input khi gửi formData():
        images, id_book, email, content, date, rating, like_count(mặc định là 0)

# api thống kế

[GET] https://localhost:8888/admin?year=2024

        // Trả về dữ liệu JSON bao gồm cả danh mục và số lượng bán
            res.json({
                stats,         //  tổng số users, tổng doanh thu, tổng đã bán
                revenueLabels, // 12 tháng của năm
                revenueData, // doanh thu theo tháng tương ứng
                productsSold, // Bao gồm danh sách danh mục và số lượng bán
            });

# api categories

[GET] https://localhost:8888/admin/categories

        res.json({
                success: true,
                message: 'Thành công',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                data: result.data,
            });

[POST] https://localhost:8888/admin/categories/add

[PUT] https://localhost:8888/admin/categories/change

[DELETE] https://localhost:8888/admin/categories/delete

# api book

[GET] https://localhost:8888/admin/books

        res.json({
                success: true,
                message: 'Thành công',
                per_page: result.per_page,
                total_pages: result.total_pages,
                current_page: result.current_page,
                total_records: result.total_records,
                data: result.data,
                categories: categories
            });

[POST] https://localhost:8888/admin/books/add

[PUT] https://localhost:8888/admin/books/change?id=1

[DELETE] https://localhost:8888/admin/books/delete?id=1





