import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  Items: [
    {
      ProductId: {
        type: mongoose.Types.ObjectId,
        required: true
      },
      Quantity: {
        type: Number,
        required: true
      }
    }
  ],
  Total: {
    type: Number,
    required: false
  }
});


const cartModel = mongoose.model('crt', cartSchema, 'Cart')
export default cartModel