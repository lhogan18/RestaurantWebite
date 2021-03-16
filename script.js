///////////////////////////////////
/////// FIREBASE FUNCTIONS ////////
///////////////////////////////////

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCnEaaHf70423PEbNgbd1AxU214EMCrdWQ",
    authDomain: "restaurantapp-ed0a8.firebaseapp.com",
    databaseURL: "https://restaurantapp-ed0a8.firebaseio.com",
    projectId: "restaurantapp-ed0a8",
    storageBucket: "restaurantapp-ed0a8.appspot.com",
    messagingSenderId: "801674002161",
    appId: "1:801674002161:web:35e75e8dc049a09e65f350",
    measurementId: "G-1S1DPJE0GG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

firebase.auth.Auth.Persistence.LOCAL;   //keeps user signed in even if browser closed

let db = firebase.database();   //instance of database



function testDb(){
    var userID = firebase.auth().currentUser.uid;
    testShowData(userID);
}

function getUserOrders(){
    //get all past orders from the user signed in
}

function getOrders(){
    //employee side, can see all orders

    //retrieve and display data from database
    var ref = db.ref("Requests").on('value', function (orders){
        if(orders.exists()){
            orders.forEach(function(data){
                var dataKey = data.key;
                var dataAddr = data.child("address").val();
                var dataName = data.child("name").val();
                var dataStatus = data.child("status").val();
                var dataTotal = data.child("total").val();

                //loop to get list of food items
                //var data1stItm = data.child("food").child("0").child("productName").val();

                var foodObjsArray = [];
                var foodItms = data.child("food");
                foodItms.forEach(function(food){
                    var foodKey = food.key;
                    var foodPrice = food.child("price").val();
                    var foodProdId = food.child("productId").val();
                    var foodName = food.child("productName").val();
                    var foodQuant = food.child("quantity").val();
                    //create food obj
                    let foodObj = {
                        index: foodKey,
                        name: foodName,
                        quantity: foodQuant,
                        price: foodPrice,
                        productId: foodProdId 
                    }
                    foodObjsArray.push(foodObj);    //add obj to array
                })
                //testShowData(dataKey + dataAddr + dataName + foodObjsArray[0].price);
                displayOrders(dataName, dataAddr, dataStatus, dataTotal, foodObjsArray);
            })
        }
    });



}


function getMenu(){
    //retrieve and display data from database

    var ref = db.ref("Category").on('value', function(cats){
        if(cats.exists()){
            cats.forEach(function(data){
                var dataKey = data.key;     //id number
                var dataName = data.child("Name").val();    //'Name' is attribute in table
                var dataImgSrc = data.child("Image").val(); //'Image' attribute has link to img
                //testShowData(dataKey + " " + dataName);
                getMenuCat(dataKey, dataName, dataImgSrc);
            })
        }
    });
}

function getMenuCat(key, name, imgsrc){
    //get from Food table in db
    //for each if MenuID = key then display item
    db.ref("Food").on("value", function(items){
        if(items.exists()){
            //testShowData("Category " + key + " " + name);
            displayMenuCatTitle(name);

            items.forEach(function(data){
                var dataKey = data.key;
                var dataName = data.child("Name").val();
                var dataDescr = data.child("Description").val();
                var dataCatID = data.child("MenuID").val();
                var dataPrice = data.child("Price").val();
                var dataDiscout = data.child("Discount").val();
                var dataImgSrc = data.child("Image").val();
                if(dataCatID === key){      //if part of this category
                    //testShowData(dataName + dataCatID + " $" + dataPrice);
                    displayMenuItem(dataKey, dataName, dataDescr, dataPrice, dataDiscout, dataImgSrc);
                    //testShowImg(dataImgSrc);
                }
            })
        }
    });

}


///////////////////////////////////
//////// SIGN IN FUNCTIONS ////////
///////////////////////////////////

function signIn(){
    let email = document.getElementById("signin-username-field").value;
    let pw = document.getElementById("signin-password-field").value;

    if(email != "" && pw != ""){
        firebase.auth().signInWithEmailAndPassword(email,pw).then((userCredential) => {
            //signed in
            var user = userCredential.user.email;
            window.location.href = "menu.html";
            //window.alert(user);
            window.alert("logged in");
        }).catch((error)=>{
            var errorCode = error.code;
            var errorMessage = error.message;
            //window.alert("error: " + errorMessage);
            let thiserror = document.getElementById("signin-error-msg");
            thiserror.innerHTML = errorMessage;
            thiserror.style.display = "block";
        })
    }else{
        window.alert("Email and password required");
    }
}

function signOut(){
    firebase.auth().signOut();
    window.location.href = "signin.html";
}

function createAccount(){
    let email = document.getElementById("signup-username-field").value;
    let pw = document.getElementById("signup-password-field").value;

    if(email != "" && pw != ""){
        firebase.auth().createUserWithEmailAndPassword(email,pw).then((userCredential)=>{
            var user = userCredential.user;
            window.alert("account created");
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("error: " + errorMessage);
            /*let thiserror = document.getElementById("signup-error-msg");
            thiserror.innerHTML = errorMessage;
            errorHolder = document.getElementById("signup-error-msg-holder").style.display = "block";*/
        })
    }else{
        window.alert("Email and password required");
    }
}

function goToSignUp(){
    window.location.href = "signup.html";
}
function goToSignIn(){
    window.location.href = "signin.html";
}

///////////////////////////////////
///////// MENU FUNCTIONS //////////
///////////////////////////////////

function loadMenuPage() {
    //on page load
    //window.alert("menu page");
    getMenu();

    //load language values
    loadLangMenu();

}

function displayMenuCatTitle(name){
    let div = document.getElementById("menu");
    let title = document.createElement("p");
    title.innerHTML = name;
    title.classList.add("menuCatTitle");
    div.appendChild(title);
    //testShowData(name);
}

function displayMenuItem(key, name, descr, price, discount, imgsrc) {
    let div = document.getElementById("menu");
    let itemDiv = document.createElement("span");
    itemDiv.classList.add("menuItemContent");

    let itemTitle = document.createElement("p");
    itemTitle.innerHTML = name;
    itemTitle.classList.add("menuItemTitle");

    let itemDescr = document.createElement("p");
    itemDescr.innerHTML = descr;

    let itemPrice = document.createElement("p");
    itemPrice.innerHTML = "$" + price;

    let itemImg = document.createElement("img");
    itemImg.src = imgsrc;
    itemImg.classList.add("menuItemImg");

    let addBtn = document.createElement("button");
    addBtn.textContent = "Add to Cart";
    addBtn.id = key;
    addBtn.setAttribute("onclick", "addItemToCart(this.id)");

    let imgSpan = document.createElement("span");
    imgSpan.appendChild(itemImg);
    imgSpan.classList.add("imgSpan");
    let detailsSpan = document.createElement("span");
    detailsSpan.classList.add("detSpan");
    detailsSpan.appendChild(itemDescr);
    detailsSpan.appendChild(itemPrice);
    detailsSpan.appendChild(addBtn);

    //itemDiv.appendChild(itemImg);
    itemDiv.appendChild(itemTitle);
    itemDiv.appendChild(imgSpan);
    itemDiv.appendChild(detailsSpan);

    div.appendChild(itemDiv);

}

function addItemToCart(id){
    window.alert(id);
}

function testShowData(data){
    //adds new p to body with data
    let div = document.getElementById("content");
    let p = document.createElement("p");
    p.innerHTML = data;
    div.appendChild(p);
}

function testShowImg(src){
    let div = document.getElementById("menu");
    let i = document.createElement("img");
    i.src = src;
    div.appendChild(i);
}



///////////////////////////////////
//////// ORDERS FUNCTIONS /////////
///////////////////////////////////

function loadOrdersPage(){
    //window.alert("orders page");
    getOrders();
    loadLangOrders();
    
}

function addOrder(){
    //address, food, name, status, total
    //food: discount, price, productId, productName, quantity
}

function diplayOrder(orderObj){
/*  obj={addr, name, status, total, food:{
        disc, price, id, name, quantity}
    }
 */
}

function displayOrders(name, addr, status, total, foodObjsArray){
    let div = document.getElementById("content");

    let orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    let custName = document.createElement("p");
    custName.innerHTML = name;
    let custAddr = document.createElement("p");
    custAddr.innerHTML = addr;

    let orderStatus = document.createElement("p");
    if(status === "0"){
        var stat = "Unfinished";
    }else if(status === "1"){
        var stat = "Finished";
    }else{ var stat = "Unknown"}
    orderStatus.innerHTML = stat;

    //append elements to order div
    orderDiv.appendChild(custName);
    orderDiv.appendChild(custAddr);
    orderDiv.appendChild(orderStatus);

    //add itemized food list
    for(let i = 0; i < foodObjsArray.length; i++){
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("orderItem");

        let item = foodObjsArray[i]; //current item

        let itemName = document.createElement("p");
        itemName.innerHTML = item.name;
        let quantTitle = document.createElement("span");
        quantTitle.innerHTML = getLang().quantity + " x ";
        quantTitle.setAttribute("class", "quantTitle");
        let itemQuant = document.createElement("span");
        itemQuant.innerHTML = item.quantity;
        let priceTitle = document.createElement("span");
        priceTitle.innerHTML = getLang().price + ": $";
        priceTitle.setAttribute("class", "priceTitle");
        let itemPrice = document.createElement("span");
        itemPrice.innerHTML = item.price;
        //append elements to item div
        itemDiv.appendChild(itemName);
        itemDiv.appendChild(quantTitle);
        itemDiv.appendChild(itemQuant);
        itemDiv.appendChild(document.createElement("br"));
        itemDiv.appendChild(document.createElement("br"));
        itemDiv.appendChild(priceTitle);
        itemDiv.appendChild(itemPrice);

        orderDiv.appendChild(itemDiv); //append item div to order div
    }
    
    let totalTitle = document.createElement("span");
    totalTitle.innerHTML = getLang().total_price + ": ";
    totalTitle.setAttribute("class", "totalTitle");
    let orderTotal = document.createElement("span");
    orderTotal.innerHTML = total;

    //append to order div
    orderDiv.appendChild(document.createElement("br"));
    orderDiv.appendChild(totalTitle);
    orderDiv.appendChild(orderTotal);
    

    div.appendChild(orderDiv);
}


///////////////////////////////////
/////// LANGUAGE FUNCTIONS ////////
///////////////////////////////////

function getLang(){
    let selector = document.getElementById("langselect");
    let lang = selector.value;//options[selector.selectedIndex].text;
    if(lang === null){
        window.alert("no language selected - lang null");
        return lang;
    }else{
        //window.alert(lang);
        //get lang object
        let langObj = getLangObj(lang);
        //loadHello(langObj);
        return langObj;
    }
}


function getLangObj(lang){
    //switch with all lang objects

    /*to add a language:
        create js file with json called lang abbr (ie: fr, en, es)
        add script src=file to html head
        add dropdown select option for lang with value = lang abbr
    */

    switch(lang){
        case 'en':
            return en;
            break;
        case 'es':
            return es;
            break;
        case 'fr':
            return fr;
            break;
        case 'pt':
            return pt;
            break;
        default:
            window.alert("no lang selected - null value");
            return null;
            break;
    }
}

function loadLangSignIn(){
    //generate page with correct language
    //get list of elements with text for that page
    //load text from json langObj attributes

    //get lang from dropdown
    let lang = getLang();
    
    //get elements w/ txt and change to correct lang
    document.getElementById("signin-header").innerHTML = lang.sign_in;
    document.getElementById("signin-username-field").setAttribute("placeholder", lang.phone);
    document.getElementById("signin-password-field").setAttribute("placeholder", lang.password);
    document.getElementById("signin-btn").value = lang.sign_in;
    document.getElementById("gotosignupbtn").innerText = lang.create_account;

}

function loadHello(lang){
    let greeting = "hello!";
    //let obj = ({"hello":"hi"});
    //let langObj = lang;   //get lang
    //greeting = langObj.hello;




    //document.getElementById("main-holder").innerHTML = greeting;
    //window.alert(greeting);
}

function loadLangMenu(){
    //get lang from dropdown
    let lang = getLang();

    //get elements w/ txt and change to correct lang
    document.getElementById("header").innerHTML = lang.restaurant;
    document.getElementById("nav-menu").innerHTML = lang.menu;
    document.getElementById("nav-orders").innerHTML = lang.orders;
    document.getElementById("nav-signout").innerHTML = lang.sign_out;
    
    
    var b = document.getElementsByClassName("menuItemContent button");
    for(let i = 0; i < b.length; i++){
        b[i].innerHTML = lang.add_to_cart;
    }

}

function loadLangOrders(){
     //get lang from dropdown
     let lang = getLang();

     //get elements w/ txt and change to correct lang
     document.getElementById("header").innerHTML = lang.restaurant;
     document.getElementById("nav-menu").innerHTML = lang.menu;
     document.getElementById("nav-orders").innerHTML = lang.orders;
     document.getElementById("nav-signout").innerHTML = lang.sign_out; 
     document.getElementById("orders-title").innerHTML = lang.orders;

     var p = document.getElementsByClassName("priceTitle");
     for(let i = 0; i < p.length; i++){
         p[i].innerHTML = getLang().price + ": $";
     }
     var q = document.getElementsByClassName("quantTitle");
     for(let i = 0; i < q.length; i++){
         q[i].innerHTML = getLang().quantity + " x ";
     }
     var t = document.getElementsByClassName("totalTitle");
     for(let i = 0; i < t.length; i++){
         t[i].innerHTML = getLang().total_price + ": ";
     }
}

function loadLangSignUp(){
    //get lang from dropdown
    let lang = getLang();

    //get elements w/ txt and change to correct lang
    document.getElementById("signup-header").innerHTML = lang.create_account;
    document.getElementById("signup-username-field").setAttribute("placeholder", lang.phone);
    document.getElementById("signup-password-field").setAttribute("placeholder", lang.password);
    document.getElementById("signup-form-submit").value = lang.sign_up;
    document.getElementById("gotosigninbtn").innerText = lang.sign_in;

}