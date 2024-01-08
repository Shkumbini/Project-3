const router = require("express").Router();
const {
  createUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  getProductListByUser,
  addToShoppingCart,
  deleteFromShoppingCart,
  initiateOrder,
  login,
} = require("../controllers/users");

const verifyToken = require("../middlewares/verifyToken");

router.post("/create_user", createUser);
router.post("/create_product", verifyToken, createProduct);
router.put("/update_product/:id", verifyToken, updateProduct);
router.delete("/delete_product/:id", verifyToken, deleteProduct);
router.get("/product_list", verifyToken, getProductList);
router.get("/product_list_by_user", verifyToken, getProductListByUser);
router.post("/add_to_shopping_cart/:id", verifyToken, addToShoppingCart);
router.delete(
  "/delete_from_shopping_cart",
  verifyToken,
  deleteFromShoppingCart
);
router.post("/order", verifyToken, initiateOrder);
router.post("/login", login);

module.exports = router;
