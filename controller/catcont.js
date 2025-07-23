import categoryModel from "../models/catsch.js"
import productModel from "../models/prodsch.js";


const addcat = async (req, res) => {
    console.log(req.body);
    try {
        const insert = await categoryModel.insertOne(req.body)
        res.json({ insert })
    } catch (err) {
        res.json({ message: err })
    }


}

const updcat = async (req, res) => {
    try {
        const { name, description } = req.body
        const old = await categoryModel.findById(req.params.id)
        const dataToSet = {
            name: old.name,
            description: old.description
        }
        if (req.body.name) { dataToSet.name = req.body.name }
        if (req.body.description) { dataToSet.description = req.body.description }

        const updated = await categoryModel.findByIdAndUpdate(req.params.id, dataToSet)
        res.json({ updated })
    } catch (err) {
        res.json({ message: err })
    }


}

const delcat = async (req, res) => {
    try {
        const categoryId = req.params.id
        await productModel.deleteMany({ productCategory: categoryId })
        await categoryModel.deleteOne({ _id: categoryId })

        res.json({ message: "Deleted all the category and the respective products" })

    } catch (err) {
        res.json({ err })
    }
}

const showcat = async (req, res) => {
    try {
        const all = await categoryModel.find()
        res.json({ all })

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

export { showcat, delcat, updcat, addcat, userShowCat }
