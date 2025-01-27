const jwt = require('jsonwebtoken');
const cartModel = require('../../models/user/cart.model');
const bookModel = require('../../models/user/book.model');

class CartController {
    // XỬ LÝ NGOÀI GIỎ HÀNG
    // [POST]: cart/add
    async addProduct(req, res) {
        const { id_book, quantity } = req.body;

        const authHeader = req.headers.authorization || req.headers.Authorization;

        // Nếu không có Authorization header, lưu vào session
        if (!authHeader?.startsWith('Bearer ')) {
            if (!req.session.cart) {
                req.session.cart = [];
            }

            // Kiểm tra sản phẩm có sẵn trong giỏ hàng tạm thời chưa
            const existingProduct = req.session.cart.find(
                (item) => item.id_book === id_book
            );

            if (existingProduct) {
                existingProduct.quantity = existingProduct.quantity + quantity;
            } else {
                req.session.cart.push({ id_book, quantity: quantity });
            }
            const cart = req.session.cart;
            const detailedCart = await getDetailedCart(cart);

            return res.status(200).json({
                success: true,
                message: "Sản phẩm được thêm vào giỏ hàng thành công",
                cart: detailedCart,
            });
        }

        // Nếu có Authorization header, xác minh JWT
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const email = decoded.UserInfo.email;
            // const role = decoded.UserInfo.role;

            const foundedBook = await cartModel.getBookByIDBook(email, id_book);
            let addedBook;
            if (!foundedBook) {
                // Nếu chưa có trong giỏ hàng thì thêm sản phẩm vào cơ sở dữ liệu
                addedBook = await cartModel.addBookIntoCart(email, id_book, quantity);
            } else {
                // Nếu sản phẩm đã có trong giỏ hàng thì chỉ cập nhật số lượng
                addedBook = await cartModel.updateQuantity(email, id_book, quantity);
            }
            const cart = await cartModel.getAllProductInCart(email);
            const detailedCart = await getDetailedCart(cart);
            return res.status(200).json({
                success: true,
                message: "Sản phẩm được thêm vào giỏ hàng thành công",
                cart: detailedCart
            });

        } catch (err) {
            console.error(err);
            // Kiểm tra lỗi token không hợp lệ
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({
                    success: false,
                    message: "Sai token, từ chối thêm",
                });
            }

            // Các lỗi khác
            return res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi trong quá trình thêm sản phẩm",
            });
        }
    }

    // XỬ LÝ TRONG GIỎ HÀNG
    // [GET]: cart
    async getCart(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        // Nếu không có Authorization header, lấy giỏ hàng từ session
        if (!authHeader?.startsWith('Bearer ')) {
            if (!req.session.cart || req.session.cart.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Giỏ hàng trống",
                    cart: [],
                });
            }

            const cart = req.session.cart;
            const detailedCart = await getDetailedCart(cart);
            return res.status(200).json({
                success: true,
                message: "Lấy sản phẩm trong giỏ hàng thành công",
                cart: detailedCart,
            });
        }

        // Nếu có Authorization header, xác minh JWT và lấy giỏ hàng từ database
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const email = decoded.UserInfo.email;

            // Lấy giỏ hàng từ database
            const cart = await cartModel.getAllProductInCart(email);
            const detailedCart = await getDetailedCart(cart);
            if (!cart || cart.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Giỏ hàng trống",
                    cart: [],
                });
            }

            return res.status(200).json({
                success: true,
                message: "Lấy sản phẩm trong giỏ hàng thành công",
                cart: detailedCart,
            });
        } catch (err) {
            console.error(err);

            // Kiểm tra lỗi token không hợp lệ
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({
                    success: false,
                    message: "Sai token, từ chối truy cập giỏ hàng",
                });
            }

            // Các lỗi khác
            return res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi trong quá trình lấy sản phẩm trong giỏ hàng",
            });
        }
    }

    // [PATCH]: cart/update
    async updateQuantityOfProduct(req, res) {
        const { id_book, quantity } = req.body;

        const authHeader = req.headers.authorization || req.headers.Authorization;
        // console.log('AUTH HEADER:', authHeader);

        if (!authHeader?.startsWith('Bearer ')) {
            if (!req.session.cart) {
                return res.status(400).json({
                    success: false,
                    message: "Giỏ hàng trống, hãy thêm sản phẩm vào giỏ hàng",
                });
            }

            // Tìm sản phẩm trong giỏ hàng tạm thời
            const existingProduct = req.session.cart.find(
                (item) => item.id_book === id_book
            );

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy sản phẩm trong giỏ hàng",
                });
            }

            // Cập nhật số lượng
            existingProduct.quantity = quantity;

            const cart = req.session.cart;
            const detailedCart = await getDetailedCart(cart);

            return res.status(200).json({
                success: true,
                message: "Số lượng được cập nhật thành công",
                cart: detailedCart,
            });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const email = decoded.UserInfo.email;

            const foundedBook = await cartModel.getBookByIDBook(email, id_book);

            if (!foundedBook) {
                return res.status(404).json({
                    success: false,
                    message: "Sản phẩm không tìm thấy trong giỏ hàng",
                });
            }

            const updatedBook = await cartModel.updateNewQuantity(email, id_book, quantity);

            const cart = await cartModel.getAllProductInCart(email);
            const detailedCart = await getDetailedCart(cart);

            return res.status(200).json({
                success: true,
                message: "Số lượng được cập nhật thành công",
                cart: detailedCart,
            });

        } catch (err) {
            console.error(err);
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({
                    success: false,
                    message: "Không tìm thấy token, từ chối cập nhật",
                });
            }

            return res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi cập nhật giỏ hàng",
            });
        }
    }

    // [DELETE]: cart/delete
    async deleteProduct(req, res) {
        const { id_book } = req.body;
        const authHeader = req.headers.authorization || req.headers.Authorization;
        // console.log('AUTH HEADER:', authHeader);

        if (!authHeader?.startsWith('Bearer ')) {
            if (!req.session.cart) {
                return res.status(404).json({
                    success: false,
                    message: "Giỏ hàng trống",
                });
            }

            req.session.cart = req.session.cart.filter((item) => item.id_book !== id_book);

            const cart = req.session.cart;
            const detailedCart = await getDetailedCart(cart);

            return res.status(200).json({
                success: true,
                message: "Sản phẩm được xóa thành công",
                cart: detailedCart
            });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const email = decoded.UserInfo.email;

            const deletedProduct = await cartModel.deleteProductFromCart(email, id_book);

            const cart = await cartModel.getAllProductInCart(email);
            const detailedCart = await getDetailedCart(cart);

            if (!deletedProduct.rowCount) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy sản phẩm trong giỏ hàng",
                });
            }

            return res.json({
                success: true,
                message: "Sản phẩm được xóa thành công",
                cart: detailedCart
            });

        } catch (err) {
            console.error(err);
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({
                    success: false,
                    message: "Không tìm thấy token, từ chối xóa",
                });
            }

            return res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi trong khi xóa sản phẩm",
            });
        }
    }

    async mergeCartForGoogleAccount(req, res) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        // Nếu có Authorization header, xác minh JWT và lấy giỏ hàng từ database
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const email = decoded.UserInfo.email;
            if (req.session.cart && req.session.cart.length > 0) {
                // Merge giỏ hàng từ session vào cơ sở dữ liệu
                for (let item of req.session.cart) {
                    const existingProduct = await cartModel.getBookByIDBook(email, item.id_book);

                    if (!existingProduct) {
                        // Nếu sản phẩm chưa có trong giỏ hàng của người dùng, thêm mới vào
                        await cartModel.addBookIntoCart(email, item.id_book, item.quantity);
                    } else {
                        // Nếu sản phẩm đã có, cập nhật số lượng
                        await cartModel.updateQuantity(email, item.id_book, item.quantity);
                    }
                }
                // Xóa giỏ hàng tạm thời trong session sau khi đã merge
                req.session.cart = [];

                console.log('Dữ liệu giỏ hàng tạm được thêm vào database');
                return res.status(200).json({
                    success: true,
                    message: "Thêm thành công sản phẩm vào giỏ hàng database",
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Giỏ hàng của bạn đã được đồng bộ, không có sản phẩm mới.",
                });
            }
        } catch (err) {
            console.error(err);
            // Các lỗi khác
            return res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi trong quá trình thêm sản phẩm vào giỏ hàng",
            });
        }
    }
}

async function getDetailedCart(cart) {
    // console.log('CART IN FUNCTION: ', cart);
    const detailedCart = [];
    for (const item of cart) {
        const bookDetails = await bookModel.getBookByID(item.id_book);
        if (bookDetails) {
            detailedCart.push({
                ...item,
                ...bookDetails,
            });
        }
    }
    // console.log('DETAIL CART: ', detailedCart);
    return detailedCart;
}

module.exports = new CartController();