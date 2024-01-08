const { PrismaClient, status } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const { name, company, city, address, email, password, userType } =
      req.body;

    let userData;
    if (userType === "seller") {
      userData = await prisma.users.create({
        data: {
          name,
          company,
          city,
          email,
          password,
          userType,
        },
      });
    } else {
      userData = await prisma.users.create({
        data: {
          name,
          city,
          address,
          email,
          password,
          userType,
        },
      });
    }

    res
      .status(201)
      .json({ message: "User created successfully", user: userData });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const userId = req.user.id;
    const userType = req.user.userType;

    if (userType !== "seller") {
      return res
        .status(403)
        .json({ error: "Only sellers can create products." });
    }

    const product = await prisma.products.create({
      data: {
        name,
        description,
        price,
        userId,
      },
    });
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = await prisma.products.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name,
        description,
        price,
      },
    });
    res.status(200).send("Product is updated!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.products.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!deleteProduct) {
      return res.status(404).send("Product not found");
    }
    res.send("Product is deleted!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const getProductListByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const productList = await prisma.products.findMany({
      where: {
        userId: userId,
      },
    });

    res.json(productList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const getProductList = async (req, res) => {
  try {
    const productList = await prisma.products.findMany();

    res.json(productList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const addToShoppingCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id;

    const product = await prisma.products.findUnique({
      select: {
        id: true,
        price: true,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    const addItem = await prisma.shoppingCart.create({
      data: {
        userId,
        productId: product.id,
        quantity,
        price: product.price,
        totalAmount: product.price * quantity,
      },
    });
    res.json(addItem);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const deleteFromShoppingCart = async (req, res) => {
  try {
    const { shoppingCartId } = req.body;
    const userId = req.user.id;

    const deleteItem = await prisma.shoppingCart.delete({
      where: {
        id: shoppingCartId,
        userId,
      },
    });
    res.json(deleteItem);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const initiateOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    // Merrni të dhënat e shportës nga tabela shoppingCart
    const shoppingCartItems = await prisma.shoppingCart.findMany({
      where: {
        userId,
        id: orderId,
      },
      include: {
        product: true,
      },
    });

    // Merrni informacione shtesë nga tabela Users
    const userInfo = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        address: true,
        city: true,
      },
    });

    // Llogarit totalAmount nga shporta
    const totalAmount = shoppingCartItems.reduce(
      (accumulator, item) => accumulator + item.totalAmount,
      0
    );

    // Gjej numrin maksimal të porosive dhe rritni atë për porosinë e re
    const maxOrderId =
      (
        await prisma.order.aggregate({
          _max: {
            id: true,
          },
        })
      )._max.id || 0;

    const newOrderId = maxOrderId + 1;
    console.log(shoppingCartItems);

    // Krijo porosinë në tabelën Order duke përdorur të dhënat e shportës dhe të dhënat e marrura nga tabela Users
    const order = await prisma.order.create({
      data: {
        id: newOrderId,
        userId,
        totalAmount,
        city: userInfo.city, // Merrni qytetin nga tabela Users
        address: userInfo.address, // Merrni adresën nga tabela Users
        status: status.pending,
        products: {
          create: shoppingCartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity, // Përdorni item.quantity në vend të quantity
            price: item.price,
          })),
        },
      },
    });
    // Fshi produktet nga shporta pasi është krijuar porosia
    await prisma.shoppingCart.deleteMany({
      where: {
        userId,
      },
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findFirst({
      where: {
        email,
        password,
      },
    });
    if (user) {
      const token = await jwt.sign(user, process.env.SECRET_TOKEN, {
        expiresIn: "24h",
      });
      res.json(token);
    } else {
      res.status(404).send("Please check your credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};
module.exports = {
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
};
