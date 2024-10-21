const port=4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const multer=require("multer")
const path=require("path")
const cors=require("cors")


app.use(express.json());
app.use(cors());

//Database coonection with mongodb

mongoose.connect("mongodb+srv://geethasreebujji:Geetha156@cluster0.ps375.mongodb.net/ecom1");

//API creation
app.get("/",(req,res)=>{
    res.send("Express App is running")
})

//Image store engine

const storage=multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage: storage})

//

app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
res.json({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
})
})

// schema for creating products

const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true
    },
})

//adding product
app.post('/addproduct',async(req,res)=>{
    let products= await Product.find({})
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0]
        id=last_product.id+1
    }
    else{
        id=1
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    })
    console.log(product);
    await product.save();
    console.log("saved")
    res.json({
        success:true,
        name:req.body.name,
    })
})

//deleting products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log('removed');
    res.json({
        success:true
    })
})

//for getting all products
app.get('/allproducts',async(req,res)=>{
    let products=await Product.find({});
    console.log("all products fetched");
    res.send(products)
})

//schema creating for usermodel

const Users=mongoose.model('Users',{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    cartData:{
       type:Object 
    },
    date:{
        type:Date,
        default:Date.now
    }
})
//creating end point for regersting the user

app.post('/signup', async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email id"})
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i]=0
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })
    await user.save();

    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//creating edndpint for user login

app.post('/login',async(req,res)=>{
    let user=await Users.find({email:req.body.email})
    console.log(user)

    if(user){
        console.log(req.body.password)
        console.log(user.password)
        const passCompare=req.body.password==user.password
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"wrong password"})
        }
    }
    else{
        res.json({success:false,errors:"please signup"})
    }
})

//creating end point for newcolections

app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({})
    let newcollection=products.slice(1).slice(-8)

    console.log("new collection fetched")
    res.send(newcollection);
})

//end point for popular

app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:"women"});
    let pops_in_women=products.slice(0,4)
    console.log("popular in women fetched")
    res.send(pops_in_women);

})

//creating middleware to fetch user

const fetchuser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errrors:"Please authenticate using valid token"})
    }
    else{
        try{

            const data=jwt.verify(token,'secret_ecom')
            req.user=data.user;
            next();
        }
        catch(error){
            res.status(401).send({
                errors:"please aunthenticate using a valid token"
            })
        }
    }
}

//creating the cart data

app.post('/addtocart',fetchuser,async(req,res)=>{
    console.log("removed",req.body.itemId)  

    let userdata=await Users.find({_id:req.user.id});

    userdata.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})

    res.send("cart item added")

})

//creating end point to remove product from cart data

app.post('/removefromcart',fetchuser,async(req,res)=>{

console.log("removed",req.body.itemId)    
    let userdata=await Users.find({_id:req.user.id});
    if(userdata.cartData[req.body.itemId]>0)
    userdata.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})

    res.send("cart item removed")
})

//toget cart data

app.post('/getcart',fetchuser,async(req,res)=>{
    console.log("get cart")
    let userdata=await Users.find({_id:req.user.id})
    res.json(userdata.cartData);
})

//for server creation
app.listen(port,(error)=>{
    if(!error){
        console.log("server running on prot" +port)
    }
    else{
        console.log("error: "+error)
    }
})