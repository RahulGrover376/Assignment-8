const Data=require('./models/data');

const data=[

    {
        name:"Rahul",
        email:"rahul@gmail.com",
        phone:"99999-99999",
        cinh:0,
        cinm:0,
        couth:0,
        coutm:0,
        status:"Present"

    },

]

const seedDB=async()=>
{
    await Data.deleteMany({});
    await Data.insertMany(data);
    console.log("DB Seeded");
}

module.exports=seedDB;