/* 
author name: Daniel Khong mun Loong
File: script.js
Description: Main javascript file containing PWA functionalities for index.html
*/

let mProducts = [];
let mLastUpdate = "";
const MAX_LIMIT_PRODUCTS = 30;

let map;
let mapMarkers = new Object();
let mapLatLong = new Object();

const publicVapidKey = "BCWKpaIdQr6Z4mZdsKr2MshsNUY-yukqeMnaxsY-4fwkgtCeDBE2qTCWDW6u1Zx2oGLUNdvFoUS9Jo01q5Gmzh4";
let isSubscribed = false;

function displayPage(divID)
{
    var pages = document.getElementsByClassName("page");

    for(var i=0; i<pages.length; i++){
        if (pages[i].id == divID){
            pages[i].style = "display:block;";
        } else {
            pages[i].style = "display:none;";
        }
    };
}

function retriveAjax()
{
    const serverUrl = 'http://inec.sg/assignment/retrieve_records.php';

    fetch(serverUrl, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(function (data) {

        mProducts = [];
        mLastUpdate = "";

        console.log("Retrieved raw data from server url:");
        console.log(data);
        // 1. retreive live data - last update from server and save to variable
        const lastUpdateRaw = data.last_update;
        const dateStr = (lastUpdateRaw.split(" "))[0];

        const dateLastUpdate = new Date(lastUpdateRaw);
        const timeStr = dateLastUpdate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        mLastUpdate = `${dateStr} ${timeStr}`;

        console.log(`Raw live update: ${lastUpdateRaw}, Extracted: ${mLastUpdate}`);

        // 2. retreive live data - products from server and save to item object and push to item object array
        for(const each_product of data.products)
        {
            //console.log(each_item);
            let product_details = {
                name: "",
                product_type: "",
                size: "",
                warranty: 0,
                price: 0,
                image: "",
                coordinates: []
            }

            for (const each_property in each_product)
            {
                product_details[each_property] = each_product[each_property];
            }    
            mProducts.push(product_details);
        }

        console.log("Extracted raw data and saved to final item object array:");
        console.log(mProducts);

    }).then(function () {

        //console.log("mlastUpdate:", mLastUpdate);
        loadPageHome();

    }) .catch(function (error) {
        console.log(error);
    });

}

function buildPageHome()
{
    console.log("------ buildPageHome starts ------");
    let elemSpanHeaderDate = document.getElementById("span_header_date");
    elemSpanHeaderDate.textContent = mLastUpdate;

    let maxLengthLimit = mProducts.length;
    // limit to display up to first 30 for app stability considerations
    if (maxLengthLimit > MAX_LIMIT_PRODUCTS)
    {
        console.log(`Max limit of ${MAX_LIMIT_PRODUCTS} for in-app display has been reached. Above max limit items will not be displayed.`);
        maxLengthLimit = MAX_LIMIT_PRODUCTS;
    }    

    for(let i=0; i < maxLengthLimit; i++)
    {
        const idValueBase = "product_item_" + i.toString();
        const idValueLi = idValueBase + "_li";
        const idValueDiv1 = idValueBase + "_div_1";
        const idValueDiv2 = idValueBase + "_div_2";
        //console.log(`Checking id values: ${idValueLi}, ${idValueDiv1}, ${idValueDiv2}`)
        //console.log(`Checking mProducts[${i}]: ${mProducts[i].name}, ${mProducts[i].price}`);

        // add event listener click for home page each product entry html element
        let newElemLi = document.createElement("li");
        newElemLi.setAttribute("class", "li_product_item");
        newElemLi.setAttribute("id", idValueLi);
        newElemLi.addEventListener("click", function () {
            const id_name = this.id;
            const id_name_arr = id_name.split("_");
            const id_num_select = parseInt(id_name_arr[2]);
            console.log("id clicked:", id_num_select);
            loadPageDetails(id_num_select);
        });

        let newElemDiv1 = document.createElement("div");
        newElemDiv1.setAttribute("class", "li_product_image");
        newElemDiv1.setAttribute("id", idValueDiv1);
        const div1InnerHtml = `<img src="${mProducts[i].image}">`;
        newElemDiv1.innerHTML = div1InnerHtml;        

        let newElemDiv2 = document.createElement("div");
        newElemDiv2.setAttribute("class", "li_product_name");
        newElemDiv2.setAttribute("id", idValueDiv2);
        const div2InnerHtml = `${mProducts[i].name}<br><span class="li_product_price">${mProducts[i].price}</span>`;
        newElemDiv2.innerHTML = div2InnerHtml;

        //Li appends 2 child div: div 1 - image, div 2 - product name & price
        newElemLi.appendChild(newElemDiv1);
        newElemLi.appendChild(newElemDiv2);

        // existing ul element appends the new element li 
        let elemUlProductList = document.getElementById("ul_products_list");
        elemUlProductList.appendChild(newElemLi);
    }

    console.log("------ buildPageHome done------");
}

function loadPageHome()
{
    console.log("------ loadPageHome starts ------");
    buildPageHome();
    displayPage("page_home");

    console.log("------ loadPageHome done------");
}

function buildPageDetails(loadIdNum)
{
    console.log("------ buildPageDetails starts ------");
    // console.log("LoadIdNum:",loadIdNum);
    // console.log("Data:", mProducts[loadIdNum]);

    const id_num_name = mProducts[loadIdNum].name;
    const id_num_image = mProducts[loadIdNum].image;
    const id_num_warranty = (mProducts[loadIdNum].warranty).toString();
    const id_num_product_type = mProducts[loadIdNum].product_type;
    const id_num_size = mProducts[loadIdNum].size;
    const id_num_price = (mProducts[loadIdNum].price).toString();
    
    // 1. Load product name to top of details page span header
    let newElemSpanName= document.createElement("span");
    newElemSpanName.setAttribute("id", "span_product_details_name");
    newElemSpanName.textContent = id_num_name;
    $("#page_details div.div_header #span_header").append(newElemSpanName);
    
    // 2. Under div_product_details_data, create the main divs for a) div_product_details_img, b) div_product_details_data
    let elemDivDetails = document.getElementById("div_product_details");

    let newElemDivDetailsImg = document.createElement("div");
    newElemDivDetailsImg.setAttribute("id", "div_product_details_img");
    let newElemDivDetailsData= document.createElement("div");
    newElemDivDetailsData.setAttribute("id", "div_product_details_data");
    let newElemDivDetailsFooter = document.createElement("div");
    newElemDivDetailsFooter.setAttribute("id", "div_product_details_footer");

    // 2a. Load product image to 1st div id: div_product_details_img
    let newElemImg = document.createElement("img");
    newElemImg.setAttribute("src", id_num_image);
    newElemDivDetailsImg.appendChild(newElemImg);

    // 2b. Load product data to 2nd div id: div_product_details_data

    let headingValues = [{heading: "Warranty", value: id_num_warranty}, 
                           {heading: "Product Type", value: id_num_product_type}, 
                           {heading: "Size", value: id_num_size}, 
                           {heading: "Price", value: id_num_price}];
    
    for(let i = 0; i < headingValues.length; i++)
    {
        console.log(`Heading: ${headingValues[i].heading}, Value: ${headingValues[i].value}`);

        let newElemDiv = document.createElement("div");
        newElemDiv.setAttribute("class", "div_product_details_data_cell");
        const innerHtmlSpan = `<span class="product_details_data_name">${headingValues[i].heading}</span><br>${headingValues[i].value}`;
        newElemDiv.innerHTML = innerHtmlSpan;

        newElemDivDetailsData.appendChild(newElemDiv);
    }

    // 2C. Load footer text to 3rd div id: div_product_details_footer
    newElemDivDetailsFooter.textContent = "WHERE TO FIND >";

    // 3. Append final div_product_details_img, div_product_details_data, div_product_details_footer to div_product_details
    elemDivDetails.appendChild(newElemDivDetailsImg);
    elemDivDetails.appendChild(newElemDivDetailsData);
    elemDivDetails.appendChild(newElemDivDetailsFooter);

    console.log("------ buildPageDetails done------");
}

function clearPageDetails()
{
    console.log("------ clearPageDetails starts ------");
    $( "#span_product_details_name" ).remove();
    $( "#div_product_details_img" ).remove();
    $( "#div_product_details_data" ).remove();
    $( "#div_product_details_footer" ).remove();

    console.log("------ clearPageDetails done ------");
}

function loadPageDetails(loadIdNum)
{
    console.log("------ loadPageDetails starts ------");
    buildPageDetails(loadIdNum);
    displayPage("page_details");

    const handlerBackArrow = () => {
        console.log("details page back arrow pressed");
        clearPageDetails();      
        displayPage("page_home");
    };

    const handlerWhereToFind = () => {
        console.log("details where to find pressed");
        clearPageDetails();
        displayPage("page_map");
        loadPageMap(loadIdNum);
    }
    
    let elemBtnDetailsBack= document.getElementById("btn_product_details_back");
    elemBtnDetailsBack.removeEventListener("click", handlerBackArrow);
    elemBtnDetailsBack.addEventListener("click", handlerBackArrow);

    let elemDivWhereToFind= document.getElementById("div_product_details_footer");
    elemDivWhereToFind.removeEventListener("click", handlerWhereToFind);
    elemDivWhereToFind.addEventListener("click", handlerWhereToFind);

    console.log("------ loadPageDetails done------");
}

function addMarker(latLng)
{
    let markerNew = new google.maps.Marker({
        position: latLng,
        map: map
    });
       
    let marker_id = markerNew.position.lat() + "_" + markerNew.position.lng();
    markerNew.addListener('click', removeMarker);

    mapMarkers[marker_id] = markerNew;
    mapLatLong[marker_id] = latLng;
    
    console.log("new marker id added:", marker_id);
    console.log("Updated map Markers:");
    console.log(mapMarkers);
    console.log("Updated Map Lat Long:");
    console.log(mapLatLong);
}

function removeMarker(event)
{
    let marker_id = event.latLng.lat() + "_" + event.latLng.lng();
    mapMarkers[marker_id].setMap(null);
    delete mapMarkers[marker_id];
    delete mapLatLong[marker_id];

    console.log("existing marker id deleted:", marker_id);
    console.log("Updated Map Markers:");
    console.log(mapMarkers);
    console.log("Updated Map Lat Long:");
    console.log(mapLatLong);
}

function loadMap(loadIdNum)
{
    let myLatLng = new Object();
    mapMarkers = {};
    mapLatLong = {};

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Retrieved from browser, current position:");
        console.log(position);
        myLatLng.lat = position.coords.latitude;
        myLatLng.lng = position.coords.longitude;

        map = new google.maps.Map(document.getElementById('div_product_map'), {
            center: myLatLng,
            zoom: 12
        });
        
        const id_key_name = (mProducts[loadIdNum].name).toLowerCase();

        // Check browser local storage if already created for id key of product
        if(localStorage.getItem(id_key_name) !== null)
        {   
            mapLatLong = JSON.parse(localStorage[id_key_name]);
            console.log(`Retriving local storage key: ${id_key_name}`)
            
            // retrieve and create new marker objects based on parsed latlong object each property name
            for (let each_marker_id in mapLatLong)
            {
                var latLngObj = mapLatLong[each_marker_id];
                var markerObj = new google.maps.Marker({
                    position: latLngObj,
                    map: map
                });
                
                markerObj.addListener("click", removeMarker);
                mapMarkers[each_marker_id] = markerObj;
            }
        }
        else
        {
            console.log(`Key:${id_key_name} does not exist in local storage`);
        }
        
        console.log("Initialized mapLatLong:");
        console.log(mapLatLong);
        console.log("Initialized mapMarkers:");
        console.log(mapMarkers);        
        
        // this adds event listeners for new marker created by user for this session
        map.addListener('click', function (event) {
            addMarker(event.latLng);
        });        

    });
    
}

function closePageMap(loadIdNum)
{
    $("#btn_map_back").remove();
    $("#span_map_title").remove();
    $("#div_product_map").remove();

    const id_key_name = (mProducts[loadIdNum].name).toLowerCase();
    console.log("closePageMap for:", id_key_name);
    console.log("Final map lat long saved to local storage:")
    console.log(mapLatLong);
    localStorage[id_key_name] = JSON.stringify(mapLatLong);
}

function loadPageMap(loadIdNum)
{
    console.log("------ loadPageMap starts ------");

    const id_num_name = mProducts[loadIdNum].name;
    console.log("Product map to load: ", id_num_name);

    let newElemImgBack= document.createElement("img");
    newElemImgBack.setAttribute("id", "btn_map_back");
    newElemImgBack.setAttribute("src", "img/back_white.png");

    let newElemSpanWhere= document.createElement("span");
    newElemSpanWhere.setAttribute("id", "span_map_title");
    newElemSpanWhere.textContent = "Where";

    $("#page_map div.div_header #span_header").append(newElemImgBack);
    $("#page_map div.div_header #span_header").append(newElemSpanWhere);

    let elemBody = (document.getElementsByTagName("body"))[0];
    //console.log(elemBody);

    let newElemDivMap= document.createElement("div");
    newElemDivMap.setAttribute("id", "div_product_map");
    elemBody.appendChild(newElemDivMap);

    loadMap(loadIdNum);

    // map = new google.maps.Map(document.getElementById('div_product_map'), {
    //     center: { lat: 1.2863627089204615, lng: 103.85931656138366 },
    //     zoom: 18
    // });

    const handlerBackArrowMap = () => {
        console.log("Map page back arrow pressed");
        closePageMap(loadIdNum);

        loadPageDetails(loadIdNum);
    };    

    let elemBtnMapBack= document.getElementById("btn_map_back");
    //elemBtnMapBack.removeEventListener("click", handlerBackArrowMap);
    elemBtnMapBack.addEventListener("click", handlerBackArrowMap);

    console.log("------ loadPageMap done------");
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


function startPWASubscription()
{
    console.log("------ startPWASubscription starts ------");

    navigator.serviceWorker.ready
    .then(function (registration) {
        return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                });
    })
    .then(function (subscription) {
        isSubscribed = true; 
        console.log("Success in CA 2 Fashion PWA start subscription:");
        console.log(JSON.stringify(subscription));
    })
    .catch(function (error) {
        isSubscribed = false;
        console.log("Failure in CA 2 Fashion PWA start subscription:");
        console.log(error);
    });

    console.log("------ startPWASubscription done ------");
}

function loadPWASubscription()
{
    console.log("------ loadPWASubscription starts ------");

    navigator.serviceWorker.ready
    .then(function (registration) {
        return registration.pushManager.getSubscription();
    })
    .then(function (subscription) {
        isSubscribed = (subscription !== null);

        if(isSubscribed){
            console.log('User is already subscribled. No need to start subscription.');
        } else {
            console.log('User is NOT subscribled. Proceed to start subscription.');
            startPWASubscription();
        }

    })
    .catch(function (error) {
        console.log("Failure in CA 2 Fashion PWA load subscription:");
        console.log(error);
    });

    console.log("------ loadPWASubscription done------");
}

function swInit()
{
    console.log("------ swInit starts ------");

    if (!('serviceWorker' in navigator)) {
        // if service worker is NOT supported for this browser, do not register and install service worker script
        console.log("Service Worker not supported for this browser.");
    }
    else
    {
        // if service worker is supported for this browser, proceed to register service worker
        navigator.serviceWorker.register("./service_worker.js")
        .then(function () {
            console.log("CA 2 Fashion PWA service Worker registered. Proceed to load Subscription.");
            loadPWASubscription();
        })
        .catch(function (error) {
            console.log("Failure in registering CA 2 Fashion PWA ServiceWorker:");
            console.log(error);
        });          
    }     

    console.log("------ swInit done------");
}

function pwaInit()
{
    console.log("------ pwaInit starts ------");

    // 1. init pwa service worker
    swInit();

    // 2. init Ajax for retrival of server data to build home page interface
    retriveAjax();
    
    console.log("------ pwaInit done------");
}


window.onload = function () {
	
    pwaInit();

}