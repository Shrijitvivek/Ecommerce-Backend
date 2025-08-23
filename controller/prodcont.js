import prodModel from "../models/prodsch.js";

// CREATE
const addprod = async (req, res) => {
  if (req.session.admin)
    try {
      let img = "";
      if (req.file) {
        img = req.file.filename;
      }

      const { ProductName, Category, Price, Stock, Description } = req.body;

      const proddet = await prodModel.create({
        ProductName,
        Category,
        Price,
        Stock,
        Description,
        ProductImage: img,
      });

      res.json({ message: "Product Added", product: proddet })
    } catch (error) {
      console.log(error);

      res.json({ error: "Failed to add product" })
    }
}

// READ 
const getprodadm = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3
    const skip = (page - 1) * limit
    const products = await prodModel.find().populate('Category', 'name').skip(skip).limit(limit)
    const total = await prodModel.countDocuments()
    res.json({ products, totalPages: Math.ceil(total / limit), 
      curreentPage: page, 
      totalProducts: total });
  } catch (error) {
    res.json({ error: "Failed to fetch products" });
  }
}


const getprodidadm = async (req, res) => {
  try {
    const product = await prodModel.findById(req.params.id)
      .populate('Category', 'name');
    if (!product) return res.json({ error: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.json({ error: "Error fetching product" });
  }
};

const getproduser = async (req, res) => {
  try {
    const products = await prodModel.find();
    res.json({ products });
  } catch (error) {
    res.json({ error: "Failed to fetch products" });
  }
}

const getprodiduser = async (req, res) => {
  try {
    const product = await prodModel.findById(req.params.id);
    if (!product) return res.json({ error: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.json({ error: "Error fetching product" });
  }
};


// UPDATE
const updprod = async (req, res) => {
  try {
    const { ProductName, Category, Price, Stock, Description } = req.body;


    const updatedData = {
      ProductName,
      Category,
      Price,
      Stock,
      Description,
    };

    if (req.file) {
      updatedData.ProductImage = req.file.filename;
    }

    const updatedProduct = await prodModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedProduct) return res.json({ error: "Product not found" });

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.json({ error: "Failed to update product" });
  }
};

// DELETE
const delprod = async (req, res) => {
  try {
    const product = await prodModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' })

  } catch (error) {
    res.json({ error: "Failed to delete product" })
  }
}

export {
  addprod,
  getprodadm,
  getprodidadm,
  updprod,
  delprod,
  getproduser,
  getprodiduser
}