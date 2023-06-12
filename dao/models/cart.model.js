import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartCollection = "carts";

// Referencias del producto y cantidad
const productSchema = new mongoose.Schema({
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            require: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    { _id: false },
);

const cartSchema = new mongoose.Schema({
    products: {
        type: [productSchema],
        default: [],
    },
});

cartSchema.plugin(mongoosePaginate);

cartSchema.pre("findById", function () {
    this.populate("products.product");
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
