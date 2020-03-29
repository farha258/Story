const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));



//GET Route for Sign Up Page
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html" );
});






//POST Route for Sign Up Page
app.post("/", function(req, res){

    //to get the information from the form of the html we have created
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data ={
        members: [
            {
                email_address:email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); // change to strings


    //then make request to post all the above data to mailchimp
    const url = "https://us16.api.mailchimp.com/3.0/lists/e350ac735d";

    const options = {
        method : "POST",
        auth: "ibucergas:5ba83210ee0f6353f1ccf322ab3a21a6-us16"
    }

    const request = https.request(url, options, function(response){

        //send the status code to client
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html" );
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData); //sending the response to mailchimp
    request.end();    
});





//POST route for failure 
// thus when failure to sign up, and then click "Try Again", the page will be redirect to Sign Up Page
app.post("/failure", function(req, res){
    res.redirect("/");
});




app.listen(process.env.PORT || 3000, function(){
    console.log("Server is up and running on port 3000");
});

