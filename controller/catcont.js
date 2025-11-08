import categoryModel from "../models/catsch.js"
import productModel from "../models/prodsch.js";

const getCategoryById = async (req, res) => { // get each category
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ category });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProductsByCategory = async (req, res) => { // get cgry prod
  try {
    const products = await productModel.find({ Category: req.params.id });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const addcat = async (req, res) => { // cgry add
    console.log(req.body);
    try {
        const insert = await categoryModel.insertOne(req.body)
        res.json({ insert })
    } catch (err) {
        res.json({ message: err })
    }


}

const updcat = async (req, res) => { //cgry upd
    try {
        const { name, description } = req.body;

        const old = await categoryModel.findById(req.params.id);
        if (!old) {
            return res.status(404).json({ message: "Category not found" });
        }

        const dataToSet = {
            name: old.name,
            description: old.description
        };

        if (name) dataToSet.name = name;
        if (description) dataToSet.description = description;

        const updated = await categoryModel.findByIdAndUpdate( req.params.id,dataToSet, { new: true } );

        res.json({ updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const delcat = async (req, res) => { // cgry delete
    try {
        const categoryId = req.params.id
        await categoryModel.deleteOne({ _id: categoryId })

        res.json({ message: "Deleted the category" })

    } catch (err) {
        res.json({ err })
    }
}

const showcat = async (req, res) => {
    try {
        const all = await categoryModel.find()
        res.json({ categories:all })

    } catch (err) {
        res.json({ err })

    }


}
const userShowCat = async (req, res) => {
    try {
        const categories = await categoryModel.find()
        res.json({ categories })

    } catch (err) {
        res.json({ message: err })
    }


}

export { showcat, delcat, updcat, addcat, userShowCat , getCategoryById, getProductsByCategory}
