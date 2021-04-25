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

function getFoodObjFromId(id){      //use for adding to db
    
    return new Promise(function(resolve, reject){
    db.ref("Food").on("value", function(items){
        if(items.exists()){
            items.forEach(function(data){
                let dataKey = data.key;
                let dataName = data.child("Name").val();
                let dataPrice = data.child("Price").val();
                let dataImgSrc = data.child("Image").val();
                if(dataKey === id){
                    console.log("returning " +dataName+dataPrice)
                    let foodObj = {
                        name: dataName,
                        price: dataPrice,
                        id: dataKey
                    }
                    resolve( foodObj)
                }
            })
        }
    })
    })
}

function getOrderItemFromId(id, div_id){
    
    db.ref("Food").on("value", function(items){
        if(items.exists()){
            items.forEach(function(data){
                let dataKey = data.key;
                let dataName = data.child("Name").val();
                let dataPrice = data.child("Price").val();
                let dataImgSrc = data.child("Image").val();
                if(dataKey === id){
                    //window.alert(dataName);
                    displayOrderItem(dataKey, dataName, dataPrice, dataImgSrc, div_id);
                }
            })
        }
    })
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
                var dataDate = data.child("date").val()
                var foodItems = data.child("items").val();   //this is an array of id values

                displayOrderInfo(dataKey, dataName, dataAddr, dataStatus, dataTotal, dataDate, foodItems);

                

                
                //window.alert(foodObjsArray[0].name);

                /*foodItms.forEach(function(food){
                    var foodKey = food.key;
                    window.alert("key"+food.key);
                    var foodPrice = food.child("Price").val();
                    var foodName = food.child("Name").val();
                    var foodImg = food.child("Image").val();
                    //create food obj
                    let foodObj = {
                        index: foodKey,
                        name: foodName,
                        price: foodPrice,
                        img: foodImg
                    }
                    //window.alert("food: " + foodName);
                    foodObjsArray.push(foodObj);    //add obj to array
                })*/
                //testShowData(dataKey + dataAddr + dataName + foodObjsArray[0]);
                //displayOrders(dataName, dataAddr, dataStatus, dataTotal, foodObjsArray);
                //console.log(foodObjsArray[0].name);
            })
        }
    });



}


function getMenu(){
    //retrieve and display data from database

    var ref = db.ref("Category/en").on('value', function(cats){
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

function getMenuItemFromId(id){
    db.ref("Food").on("value", function(items){
        if(items.exists()){
            items.forEach(function(data){
                let dataKey = data.key;
                let dataName = data.child("Name").val();
                let dataPrice = data.child("Price").val();
                let dataImgSrc = data.child("Image").val();
                if(dataKey === id){
                    //testShowData(dataKey + dataName + dataPrice + dataImgSrc);
                    //window.alert(dataName);
                    displayCartItem(dataName, dataPrice, dataKey, dataImgSrc);
                    //return dataName;
                    //let itemObj = {"key": dataKey, "name":dataName, "price":dataPrice, "img":dataImgSrc};//return obj
                    //return itemObj;
                }
            })
        }
    });
}



///////////////////////////////////
//////// SIGN IN FUNCTIONS ////////
///////////////////////////////////

function guestLogin(){
    let pn = "0"
    let pw = "guest"

    let userfound = false
    db.ref("User").on("value", function(users){
        if(users.exists()){    
            
            users.forEach(function(data){
                let datakey = data.key
                let phonenum = data.child("phone").val()
                let username = data.child("name").val()
                let password = data.child("password").val()
                if(phonenum === pn && password === pw){     //check if pn/pw match
                    userfound = true
                    //sign in user
                    console.log("valid user, signing in "+username)
                    //save to loc stor
                    localStorage.setItem("curruser", username)
                    localStorage.setItem("currphone", phonenum)
                    //setup empty user cart
                    createUserCart()
                    window.location.href = "menu.html"
                }
            })
        }
        if(!userfound){
            console.log("guest login not working")
        }
    })
}

function signIn(){
    //get user input
    let pn = document.getElementById("signin-phone-field").value;
    let pw = document.getElementById("signin-password-field").value;

    let userfound = false
    //check if pn/pw in db
    db.ref("User").on("value", function(users){
        if(users.exists()){    
            users.forEach(function(data){
                let datakey = data.key
                let phonenum = data.child("phone").val()
                let username = data.child("name").val()
                let password = data.child("password").val()
                if(phonenum === pn && password === pw){     //check if pn/pw match
                    userfound = true
                    //sign in user
                    console.log("valid user, signing in")
                    //save to loc stor
                    localStorage.setItem("curruser", username)
                    localStorage.setItem("currphone", phonenum)
                    //setup empty user cart
                    createUserCart()
                    window.location.href = "menu.html"
                }
            })
        }
        if(!userfound){
            console.log("invalid username or password")
        }
    })
    


    /* if(email != "" && pw != ""){
        firebase.auth().signInWithEmailAndPassword(email,pw).then((userCredential) => {
            //signed in
            var user = userCredential.user.email;
            window.location.href = "menu.html";
            createUserCart();
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
    } */
}

function isSignedIn(){
    //check loc stor to see if user signed in
    if(localStorage.getItem("curruser") != undefined){
        console.log("welcome " + localStorage.getItem("curruser"))
    }
    else {
        console.log("user is not signed in")
    }
}

function signOut(){
    //clear loc stor pn,un,cart
    console.log("clearing loc stor...")
    localStorage.clear()
    console.log("loc stor cart now: " + localStorage.getItem("mycart"))

    window.location.href = "signin.html";
}

function isValidPhoneNumber(data){
    if(data.length < 10){
        console.log("number too small")
        return false
    }
    else if(data.length > 15){
        console.log("number too big")
        return false
    }
    else{
        let acceptedValues = /^[0-9]+$/
        if(data.match(acceptedValues)){
            console.log("contains only digits")
            return true
        }
        else{
            console.log("contains invalid chars for phone number")
            return false
        }
    }
}

function getUserDataFromPhoneNum(phone){
    console.log("searching for user...")
    db.ref("User").on("value", function(users){
        if(users.exists()){    
            users.forEach(function(data){
                let datakey = data.key
                let phonenum = data.child("phone").val()
                let username = data.child("username").val()
                console.log("looking at "+datakey, phonenum, username)
                if(phonenum === phone){
                    console.log("user found: " + username+phonenum+key)
                    return {
                        key: datakey,
                        un: username,
                        pn: phonenum
                    }
                }
            })
        }
    })
}

async function createAccount(){
    //create account in User table w/ phone # and password

    //get user input
    let un = document.getElementById("signup-username-field").value
    let pn = document.getElementById("signup-phone-field").value
    let pw = document.getElementById("signup-password-field").value

    //validate input
    if(isValidPhoneNumber(pn)){
        //make sure phone num not already in db

        //add account to db
        await db.ref("User").push({
            phone: pn,
            name: un,
            password: pw
            
        });
        //sign in - save un and pn in loc stor
        localStorage.setItem("curruser", un)
        localStorage.setItem("currphone", pn)
        //setup empty user cart
        createUserCart()
        //switch page to menu
        window.location.href = "menu.html"
    }
    else{
        //invalid phone number
        //set alert message (globalize)
    }


    /* if(email != "" && pw != ""){
        firebase.auth().createUserWithEmailAndPassword(email,pw).then((userCredential)=>{
            var user = userCredential.user;
            window.alert("account created");
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("error: " + errorMessage);
            //let thiserror = document.getElementById("signup-error-msg");
            //thiserror.innerHTML = errorMessage;
            //errorHolder = document.getElementById("signup-error-msg-holder").style.display = "block";
        })
    }else{
        window.alert("Email and password required");
    } */
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

async function displayMenuItem(key, name, descr, price, discount, imgsrc) {
    let div = document.getElementById("menu");
    let itemDiv = document.createElement("span");
    itemDiv.classList.add("menuItemContent");

    let itemTitle = document.createElement("p");
    itemTitle.innerHTML = name;
    itemTitle.classList.add("menuItemTitle");

    let itemDescr = document.createElement("p");
    itemDescr.innerHTML = descr;

    let itemPrice = document.createElement("p");
    itemPrice.value = price
    itemPrice.className = "menu-price"
    itemPrice.innerHTML = getLang().currency_symbol + price;    //cant use await convertPrice() here bc then load all items after all category titles
                                                                //need to load converted price from lang switch


    let itemImg = document.createElement("img");
    itemImg.src = imgsrc;
    itemImg.classList.add("menuItemImg");

    let addBtn = document.createElement("button");
    addBtn.textContent = "Add to Cart";
    addBtn.id = key;
    addBtn.setAttribute("onclick", "addItemToCart(this.id)");
    addBtn.setAttribute("class", "addBtn");

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

function displayOrderItem(key, name, price, img, div_id){
    let div = document.getElementById(div_id);
    let itemDiv = document.createElement("div");
    itemDiv.classList.add("orderItem");

    let itemName = document.createElement("span");
    itemName.innerHTML = name;
    let priceTitle = document.createElement("span");
    priceTitle.innerHTML = getLang().price + ":" + " ";
    priceTitle.setAttribute("class", "priceTitle");
    let itemPrice = document.createElement("span");
    itemPrice.setAttribute("class", "price")// orderPrice");
    //itemPrice.setAttribute("class", "orderPrice")
    itemPrice.innerHTML = getLang().currency_symbol + price;
    itemPrice.value = price
    //append elements to item div
    itemDiv.appendChild(itemName);
    itemDiv.appendChild(itemPrice);
    itemDiv.appendChild(priceTitle);

    div.appendChild(itemDiv); //append item div to order div

}

function displayOrderInfo(key, name, addr, status, total, date, foodItems){
    //window.alert(status);
    let div = document.getElementById("content");

    let orderDiv = document.createElement("div");
    orderDiv.classList.add("order");
    orderDiv.setAttribute("id", "order"+key);       //set id to orderID  ie order1 order2

    let orderNumTitle = document.createElement("span");
    orderNumTitle.innerHTML = getLang().order + " #";
    orderNumTitle.setAttribute("class", "orderNumTItle")
    let orderNum = document.createElement("span");
    orderNum.innerHTML = key;

    let custNameTitle = document.createElement("span");
    custNameTitle.innerHTML = getLang().name + ": "
    custNameTitle.setAttribute("class", "custNameTitle")
    let custName = document.createElement("span");
    custName.innerHTML = name;

    let addrTitle = document.createElement("span");
    addrTitle.innerHTML = getLang().address + ": ";
    addrTitle.setAttribute("class", "addrTitle");
    let custAddr = document.createElement("span");
    custAddr.innerHTML = addr;

    let orderDate = document.createElement("span")
    //console.log(date)
    let newdate = new Date(date)//.toUTCString()
    orderDate.value = newdate
    orderDate.setAttribute("class", "dates")
    //console.log(newdate)
    let formattedDate = getFormattedDate(newdate)//newdate.toLocaleDateString("fr")
    //console.log(formattedDate)
    orderDate.innerHTML = "Date: "+ formattedDate
    //console.log("value: " + orderDate.value)
    

    let statusTitle = document.createElement("span");
    statusTitle.innerHTML = getLang().status + ": "
    statusTitle.setAttribute("class", "statusTitle");
    let orderStatus = document.createElement("span");
    orderStatus.innerHTML = status;
    orderStatus.setAttribute("class", "orderStatus")

    let totalTitle = document.createElement("span")
    totalTitle.innerHTML = getLang().total + ": "
    totalTitle.setAttribute("class", "totalTitle")
    let orderTotal = document.createElement("span")
    orderTotal.innerHTML = getLang().currency_symbol + total
    orderTotal.setAttribute("class", "orderPrice")
    orderTotal.value = total

    //append elements to order div
    orderDiv.appendChild(orderNumTitle);
    orderDiv.appendChild(orderNum);
    
    orderDiv.appendChild(document.createElement("br"));

    orderDiv.appendChild(custNameTitle);
    orderDiv.appendChild(custName);
    
    orderDiv.appendChild(document.createElement("br"));

    orderDiv.appendChild(addrTitle);
    orderDiv.appendChild(custAddr);
    
    orderDiv.appendChild(document.createElement("br"));

    orderDiv.appendChild(orderDate);
    
    orderDiv.appendChild(document.createElement("br"));

    orderDiv.appendChild(totalTitle);
    orderDiv.appendChild(orderTotal);

    orderDiv.appendChild(document.createElement("br"));

    orderDiv.appendChild(statusTitle);
    orderDiv.appendChild(orderStatus);

    div.appendChild(orderDiv);


    //food is now array so use for loop instead of foreach w/ firebase
    if(foodItems != null){
        for(let i = 0; i < foodItems.length; i++){
            getOrderItemFromId(foodItems[i], "order"+key);
        }
    }
    else{console.log("foodItems list is null")
    }
}

function displayOrders(name, addr, status, total, foodObjsArray, orderId){
    let div = document.getElementById("content");

    let orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    let custNameTitle = document.createElement("span");
    custNameTitle.innerHTML = getLang().name + ": "
    custNameTitle.setAttribute("class", "custNameTitle")
    let custName = document.createElement("span");
    custName.innerHTML = name;

    /*let addrTitle = document.createElement("span");
    addrTitle.innerHTML = getLang().address;
    addrTitle.setAttribute("class", "addrTitle");
    let custAddr = document.createElement("span");
    custAddr.innerHTML = addr;*/

    let statusTitle = document.createElement("span");
    statusTitle.innerHTML = getLang().status + ": "
    statusTitle.setAttribute("class", "statusTitle");
    let orderStatus = document.createElement("span");
    orderStatus.setAttribute("class", "orderStatus")
    orderStatus.innerHTML = status;
    console.log("status - " + status)

    //append elements to order div
    orderDiv.appendChild(custNameTitle);
    orderDiv.appendChild(custName);
    
    orderDiv.appendChild(document.createElement("br"));

    //orderDiv.appendChild(addrTitle);
    //orderDiv.appendChild(custAddr);

    orderDiv.appendChild(document.createElement("br"));

    orderDiv.appendChild(statusTitle);
    orderDiv.appendChild(orderStatus);

    //add itemized food list
    //window.alert(foodObjsArray.length);
    for(let i = 0; i < foodObjsArray.length; i++){
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("orderItem");

        let item = foodObjsArray[i]; //current item

        let itemName = document.createElement("p");
        itemName.innerHTML = item.name;
        /*let quantTitle = document.createElement("span");
        quantTitle.innerHTML = getLang().quantity + " x ";
        quantTitle.setAttribute("class", "quantTitle");
        let itemQuant = document.createElement("span");
        itemQuant.innerHTML = item.quantity;*/
        let priceTitle = document.createElement("span");
        priceTitle.innerHTML = getLang().price + ": $";
        priceTitle.setAttribute("class", "priceTitle");
        let itemPrice = document.createElement("span");
        itemPrice.innerHTML = item.price;
        //append elements to item div
        itemDiv.appendChild(itemName);
        //itemDiv.appendChild(quantTitle);
        //itemDiv.appendChild(itemQuant);
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
    //console.log("saved lang is " + localStorage.getItem("lang"))
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

function setLang(lang){
    localStorage.setItem("lang", lang)
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
    document.getElementById("signin-phone-field").setAttribute("placeholder", lang.phone);
    document.getElementById("signin-password-field").setAttribute("placeholder", lang.password);
    document.getElementById("signin-btn").value = lang.sign_in;
    document.getElementById("gotosignupbtn").innerText = lang.create_account;
    document.getElementById("guestlogin").innerText = lang.guest

}

function loadHello(lang){
    let greeting = "hello!";
    //let obj = ({"hello":"hi"});
    //let langObj = lang;   //get lang
    //greeting = langObj.hello;




    //document.getElementById("main-holder").innerHTML = greeting;
    //window.alert(greeting);
}

async function loadLangMenu(){
    //get lang from dropdown
    let lang = getLang();

    //get elements w/ txt and change to correct lang
    //document.getElementById("header").innerHTML = lang.restaurant;
    document.getElementById("nav-menu").innerHTML = lang.menu;
    document.getElementById("nav-orders").innerHTML = lang.orders;
    document.getElementById("nav-cart").innerHTML = lang.cart;
    document.getElementById("nav-signout").innerHTML = lang.sign_out;
    
    //add add buttons
    var b = document.getElementsByClassName( "addBtn");
    for(let i = 0; i < b.length; i++){
        b[i].innerHTML = lang.add_to_cart;
    }

    //convert prices
    var m = document.getElementsByClassName("menu-price")
    for(let i = 0; i < m.length; i++){
        let base = m[i].value
        let newprice = await convertPrice(base)
        console.log("new price = " + newprice)
        m[i].innerHTML = getLang().currency_symbol + newprice
    }

}

async function loadLangOrders(){
     //get lang from dropdown
     let lang = getLang();

     //get elements w/ txt and change to correct lang
     //document.getElementById("header").innerHTML = lang.restaurant;
     document.getElementById("nav-menu").innerHTML = lang.menu;
     document.getElementById("nav-orders").innerHTML = lang.orders;
     document.getElementById("nav-cart").innerHTML = lang.cart;
     document.getElementById("nav-signout").innerHTML = lang.sign_out;

     document.getElementById("orders-title").innerHTML = lang.orders;

     var p = document.getElementsByClassName("priceTitle");
     for(let i = 0; i < p.length; i++){
         p[i].innerHTML = getLang().price + ": " //+ getLang().currency_symbol;
     }
     var q = document.getElementsByClassName("quantTitle");
     for(let i = 0; i < q.length; i++){
         q[i].innerHTML = getLang().quantity + " x ";
     }
     var t = document.getElementsByClassName("totalTitle");
     for(let i = 0; i < t.length; i++){
         t[i].innerHTML = getLang().total_price + ": ";
     }
     var n = document.getElementsByClassName("custNameTitle");
     for(let i = 0; i < n.length; i++){
         n[i].innerHTML = getLang().name + ": ";
     }
     var a = document.getElementsByClassName("addrTitle");
     for(let i = 0; i < a.length; i++){
         a[i].innerHTML = getLang().address + ": ";
     }
     var s = document.getElementsByClassName("statusTitle");
     for(let i = 0; i < s.length; i++){
         s[i].innerHTML = getLang().status + ": ";
     }
     var prices = document.getElementsByClassName("orderPrice")
     for(let i = 0; i < prices.length; i++){
        let base = prices[i].value
        let newprice = await convertPrice(base)
        console.log("new price = " + newprice)
        prices[i].innerHTML = getLang().currency_symbol + newprice
     }
     var itPrices = document.getElementsByClassName("price")
     for(let i = 0; i < itPrices.length; i++){
        let base = itPrices[i].value
        let newprice = await convertPrice(base)
        console.log("new price = " + newprice)
        itPrices[i].innerHTML = getLang().currency_symbol + newprice
     }
     var dates = document.getElementsByClassName("dates")
     for(let i = 0; i < dates.length; i++){
         let date = dates[i].value
         let fDate = getFormattedDate(date)
         dates[i].innerHTML = fDate
     }
}

function loadLangSignUp(){
    //get lang from dropdown
    let lang = getLang();

    //get elements w/ txt and change to correct lang
    document.getElementById("signup-header").innerHTML = lang.create_account;
    document.getElementById("signup-phone-field").setAttribute("placeholder", lang.phone);
    document.getElementById("signup-username-field").setAttribute("placeholder", lang.name)
    document.getElementById("signup-password-field").setAttribute("placeholder", lang.password);
    document.getElementById("signup-form-submit").value = lang.sign_up;
    document.getElementById("gotosigninbtn").innerText = lang.sign_in;

}

async function loadLangCart() {
    let lang = getLang();

    //get elements w/ txt and change to correct lang
    //nav elements
    document.getElementById("nav-menu").innerHTML = lang.menu;
    document.getElementById("nav-orders").innerHTML = lang.orders;
    document.getElementById("nav-cart").innerHTML = lang.cart;
    document.getElementById("nav-signout").innerHTML = lang.sign_out;

    document.getElementById("cart-title").innerHTML = lang.cart;
    document.getElementById("submit-cart-btn").innerText = lang.place_order;
    //document.getElementById("calc-cart-total").innerText = lang.total;

    document.getElementById("cart-price-label").innerHTML = getLang().total_price + " " +getLang().currency_symbol

    //adjust price conversion
    let p = document.getElementById("cart-price-total")
    let base = p.value
    p.innerHTML = await convertPrice(base)

    
    document.getElementById("cart-name-label").innerHTML = lang.name
    document.getElementById("cart-phone-label").innerHTML = lang.phone
    document.getElementById("cart-address-label").innerHTML = lang.address
    document.getElementById("cart-comments-label").innerHTML = lang.comment
    
    
    var r = document.getElementsByClassName("rmBtn");
    for(let i = 0; i < r.length; i++){
        r[i].innerHTML = getLang().remove;
    }

    var itemPrices = document.getElementsByClassName("item-price")
    for(let i = 0; i < itemPrices.length; i++){
        let base = itemPrices[i].value
        let newprice = await convertPrice(base)
        console.log("new price = " + newprice)
        itemPrices[i].innerHTML = getLang().currency_symbol + newprice
    }
}


///////////////////////////////////
///////// CART FUNCTIONS //////////
///////////////////////////////////

function loadCartPage(){
    displayCart()
    displayCartForm()
}

let itemIds = ["01", "08", "01", "03"];


/*localStorage.setItem('mycart', '["05", "06"]');
localStorage.setItem('mycart', localStorage.getItem('mycart') + '05');
window.alert(localStorage.getItem('mycart'));*/

function createUserCart(){  //only do once when logging in
    //create cart for local storage
    console.log("setting up user cart")
    localStorage.setItem('mycart', '[]');
}

function addItemToCart(id){
    //window.alert(id);
    //itemIds.push(id);
    //window.alert(itemIds);


    //get string from loc storage
    var retrievedData = localStorage.getItem('mycart');
    //parse into an array
    var cartList = JSON.parse(retrievedData);
    //push new item into array
    cartList.push(id);
    //sort array
    cartList.sort();
    //stringify array
    var convertedData = JSON.stringify(cartList);
    //save to local storage
    localStorage.setItem('mycart', convertedData);

    //window.alert(localStorage.getItem('mycart'));

}


async function displayCartItem(name, price, key, img){
    //window.alert(name + price + key + img);
    let itemDiv = document.createElement("div");
    itemDiv.classList.add("cartItem");

    let itemImgSpan = document.createElement("span");
    let itemImg = document.createElement("img");
    itemImg.src = img;
    itemImgSpan.appendChild(itemImg);

    //let itemContent = document.createElement("span");
    let itemName = document.createElement("span");
    itemName.classList.add("item-name");
    itemName.innerHTML = name;
    let currencySymbol = document.createElement("span");
    currencySymbol.classList.add("currency-symb");
    currencySymbol.innerHTML = getLang().currency_symbol;
    let itemPrice = document.createElement("span");
    itemPrice.classList.add("item-price");
    itemPrice.value = price
    itemPrice.innerHTML = getLang().currency_symbol + await convertPrice(price);
    //itemContent.appendChild(itemName);
    //itemContent.appendChild(itemPrice);


    //remove item from cart btn
    let rmBtn = document.createElement("button");
    rmBtn.classList.add("rmBtn");
    rmBtn.setAttribute("onclick", "removeItemFromCart(this.id)")
    rmBtn.id = key;
    rmBtn.innerHTML = getLang().remove;


    itemDiv.appendChild(itemImgSpan);
    //itemDiv.appendChild(itemContent);
    itemDiv.appendChild(itemName);
    itemDiv.appendChild(itemPrice);
    //itemDiv.appendChild(currencySymbol);
    itemDiv.appendChild(document.createElement("br"));
    itemDiv.appendChild(rmBtn);

    document.getElementById("cart-div").appendChild(itemDiv);
}

function convertPrice(price){
    return new Promise(function(resolve, reject){
        let accessKey = "14f7539e0f3a91f973820e951d60ad8c";
        curr = "USD"
        new_curr = getLang().currency

        console.log("converting " + price + curr + " to " + new_curr)

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://data.fixer.io/api/convert?access_key=" + accessKey + "&from=" + curr + "&to=" + new_curr + "&amount=" + price)
        xhr.onload = function () {
            let result = JSON.parse(this.responseText).result
            result = parseFloat(result).toFixed(2)
            console.log("New ammount " + result);
            resolve(result);
        };
        xhr.send();


        /* let newCurrency = getLang().currency
        console.log(price + "USD to ? " + newCurrency)
        return "new" + newCurrency */
    })
}

async function displayCart(){
    //get string from loc storage
    var retrievedData = localStorage.getItem('mycart');

    //check if cart is empty
    if(retrievedData === null){
        console.log("cart is empty " + retrievedData)
        return
    }

    //parse into an array
    var cartList = JSON.parse(retrievedData);
    cartList.sort();




    let cart = cartList;
    //let cart = itemIds;
    
    //clear previously loaded cart
    document.getElementById("cart-div").innerHTML = "";

    //get total cost
    let totalCost = 0;
    
    for (let i = 0; i < cartList.length; i++) {
        let obj = await getFoodObjFromId(cartList[i]);        //returns(name, price, id)
        totalCost += +obj.price
    }
    console.log("total price " + totalCost)

    //display total price
    let pl = document.createElement("span")
    pl.id = "cart-price-label"
    pl.innerHTML = getLang().total_price + " " +getLang().currency_symbol
    let p = document.createElement('span')
    p.id="cart-price-total"
    p.value =  await convertPrice(totalCost)
    p.innerHTML = totalCost
    document.getElementById("cart-div").appendChild(pl)
    document.getElementById("cart-div").appendChild(p)

    //display all food items in cart
    for(let i = 0; i < cart.length; i++){
        getMenuItemFromId(cart[i]);
    }

}

function displayCartForm(){
    //globalize
    //get lang
    let lang = getLang()
    console.log("user values are " + localStorage.getItem("curruser") + localStorage.getItem("currphone"))

    //labels - globalize
    let lname = document.getElementById("cart-name-label")
    lname.innerHTML = lang.name
    let lphone = document.getElementById("cart-phone-label")
    lphone.innerHTML = lang.phone
    let laddr = document.getElementById("cart-address-label")
    laddr.innerHTML = lang.address
    let lcomments = document.getElementById("cart-comments-label")
    lcomments.innerHTML = lang.comment

    //autofill name and phone
    let user = localStorage.getItem("curruser")
    let phone = localStorage.getItem("currphone")
    if(phone != 0){
        document.getElementById("cart-name-field").value = user
        document.getElementById("cart-phone-field").value = phone
    }

}

function calcCartTotal(){
    //get total price
    let total = 0;
    let cartItems = document.getElementsByClassName('item-price');
    for(let i = 0; i < cartItems.length; i++){
        let itemPrice = cartItems[i].innerHTML;
        itemPrice = parseInt(itemPrice);
        total += itemPrice;
        
    }
    window.alert("Total = " + total);
}

async function submitCartOrder(){
    //get logged in user info
    //let user = getUserDataFromPhoneNum(localStorage.getItem("currphone"))       //pn, un, key

    //wait for user to be found
    //while(user === null){console.log("waiting for user")}
    
    //get user id
    //let id = user.key

    //get values from form fields
    let name = document.getElementById("cart-name-field").value
    let phone = document.getElementById("cart-phone-field").value
    let addr = document.getElementById("cart-address-field").value
    let comm = document.getElementById("cart-comments-field").value

    //validate all fields filled
    if(name===""||phone===""||addr===""){
        console.log("please fill in all fields")
    }
    else{

        //get items in cart
        //get string from loc storage
        var retrievedData = localStorage.getItem('mycart');
        //parse into an array
        var cartList = JSON.parse(retrievedData);

        //get total price
        let totalCost = 0;

        //get array of food objects
        let foodObjList = [];
        for(let i = 0; i < cartList.length; i++){
            let obj = await getFoodObjFromId(cartList[i]);        //returns(name, price, id)
            totalCost += +obj.price
            console.log(obj.price + obj.name)
            foodObjList.push(obj);
        }
        console.log("total price " + totalCost)

        //get current datetime
        let today = new Date()
        let JSONtoday = today.toJSON()
        let stringToday = JSON.stringify(today)
        let parsedToday = JSON.parse(stringToday)
        console.log("today is " + today + " json: " + JSONtoday)// + stringToday + parsedToday)
        getFormattedDate(today)

        /* db.ref("Requests").push({
            name: name,
            phone: phone,
            address: addr,
            status: "incomplete",
            total: totalCost,
            items: cartList,
            comments: comm,
            date: JSONtoday
        });  */ 

        clearCart()
        clearCartForm()
    }
}

function getFormattedDate(dateObj){
    /* console.log(dateObj.toLocaleDateString('en'))
    console.log(dateObj.toLocaleDateString('fr'))
    console.log(dateObj.toLocaleDateString('es'))
    console.log(dateObj.toLocaleDateString('pt')) */
    console.log("date is " + dateObj.toLocaleDateString(getLang().lang))
    return dateObj.toLocaleDateString(getLang().lang)
    
}

function clearCartForm(){
    //console.log("in clearing cart form function")
    let fields = document.getElementsByClassName("cart-field")
    for(let i = 0; i < fields.length; i++){
        fields[i].value = ""
    }
    document.getElementById("cart-comments-field").value = ""
}

function clearCart(){
    localStorage.setItem('mycart', '[]');
    //window.alert(localStorage.getItem('mycart'));
    //reload cart
    displayCart();
}

function removeItemFromCart(id){
    //remove from cart list in local storage
    
    //get string from loc storage
    var retrievedData = localStorage.getItem('mycart');
    //parse into an array
    var cartList = JSON.parse(retrievedData);
    //find item in array
    var index = cartList.indexOf(id);
    //remove item from array
    cartList.splice(index,1);   //remove 1 item at location index
    //stringify array
    var convertedData = JSON.stringify(cartList);
    //save to local storage
    localStorage.setItem('mycart', convertedData);

    //reload cart on page
    displayCart();
}