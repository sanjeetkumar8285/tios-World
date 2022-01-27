const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const sellerPayoutSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order'
    },
    returnOrderId:{
        type:String
    },
    payoutDate:{
        type:Date
    },
    no:{
        type:String
    },
    lastPayoutCycleCommission:{
        type:String
    },
    lastPayoutDate:{
        type:Date
    },
    lastPayoutCycleSales:{
        type:String
    },
    lastPayoutAmount:{
        type:Number
    },
    payoutDeliveryFees:{
        type:Number
    },
    status:{
    type:Boolean,
    required:true
}
},{timestamps:true})
const sellerPayoutModel=mongoose.model('sellerPayout',sellerPayoutSchema);
module.exports=sellerPayoutModel