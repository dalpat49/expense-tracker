
const express = require('express');
// const { exec } = require('child_process');
// const multer = require('multer');
// const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongo = require("mongo");

const app = express();
require('dotenv').config();
// const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//conect db
const db = "mongodb+srv://singhdalpat8182:ravindra@cluster0.xbqceub.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => {

  console.log("connection succesfull")

}).catch((err) => console.log(err));

//moongoose contact form schema
const expesnseData = new mongoose.Schema({
    amount: Number,
    description: String,
    savedDate:String,
    username:String,
  });

//expense model data
const expense = mongoose.model("expense",expesnseData);

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/expense', async(req, res) => {
    const allData = await expense.find({});
    const sumOfPrice = await expense.aaggregate({
        $group: {
            _id: '',
            totalAmount: { $sum: '$total' }
        }
     }, {
        $project: {
            _id: 0
        }
    })
 
    return res.status(200).json({status: 'success', data: allData , sum:sumOfPrice});
});

app.post('/getExpenses',async (req, res) =>{
    try{
        const { description1 , amount1 ,savedate , userName} = req.body;
        console.log(amount1)
        console.log(description1);


        const additemcategory = new expense({
            description:description1,
            amount:Number(amount1),
            savedDate:savedate,
            username:userName
        }).save().then(
            res.status(200).json({status: 'Success', msg: 'Data saved successfully'})
        )

    }
    catch(err){
        console.log(err);
    }
})

app.get(`/deleteExpense/:id`,async(req,res)=>{
    try {
        let dltId = req.params.id;
          const dltItem = await expense.findByIdAndDelete({ _id: dltId }).then(() => {
            res.status(200).json({status: 'success', msg: ' Data deleted successfully'});
        })
        
    } catch (error) {
        console.log(error);
    }

})

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('Server running on port' +  " " + PORT);
});
