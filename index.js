
const contentTag = document.querySelector(".main");
const infoWithOption=document.getElementById('alert-with-input');
var code;
var NameIt;



 function fetchData(){

    var allProductsPlus;
    var allCategories;

    fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(json=>saveCategory(json))
     
    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(json=>addNewField(json))

    function saveCategory(input){
      allCategories=input; 
      lstorageReadWrite(false,"allCategories",allCategories)
       
    }
   
    function addNewField(input){  
       let allProducts=input
      for(let i=0;i<allProducts.length;i++){
        let quantity = Math.floor(Math.random() * 41);   
        allProducts[i].quantity=quantity;
      }
      allProductsPlus=allProducts;
      lstorageReadWrite(false,"allProductsPlus",allProductsPlus)
   }
 }


 if(!lstorageReadWrite(true,"allProductsPlus")){  
     fetchData();
 }



function lstorageReadWrite(readOrWrite,name,content,token){    
    
    if(readOrWrite===true){ 
        if(localStorage.getItem(name)){
         let jsonString=localStorage.getItem(name);      
         return JSON.parse(jsonString);
        }
        else{

        }
         return 0;
    }
    else if(readOrWrite===false){  
        localStorage.setItem(name,JSON.stringify(content))
    }
    else if(readOrWrite==="delete"){
             
            if(alertHandler(true, "confirm delete")==="okay"){
                localStorage.removeItem(content) 
            }        
    }
    else if(readOrWrite==="clear"){     
        
        
        
        if (token===undefined){
            code = securityToken();
            console.log(code)
            alertHandler(true, "Wipe localstorage?  Warning: Irreversible! ","lstorageReadWrite",code)   
        }else if(token=== code&&content==="okay")
        {   console.log("called")
            localStorage.clear();
            alertHandler(false,"wipe successful")
        }
        else{console.log('not excuted')}
                 
    }
    else if(typeof readOrWrite !== "boolean" && readOrWrite !=="clear" && readOrWrite !=="delete"){
        console.log('self debug,read/write instruction not clear, program terminated');
        return;
    }
   
}


function statisticsHandler(indicator,dataSet){ 
    var workingSet;                     
    if (dataSet==="allProducts"){
        workingSet=lstorageReadWrite(true,'allProductsPlus');
    }else {workingSet=dataSet; }

    if (indicator==="totalStockValue"){
        var totalStockValue=0;
        for(let i=0;i<workingSet.length;i++){
        totalStockValue=totalStockValue+(+workingSet[i].quantity * (+workingSet[i].price))
        }
        return Math.floor(totalStockValue)
    }
    if(indicator==="quantityByCategory"){
        var clothing_men=0;  var jewelery=0; var electronics=0; var clothing_women=0;
        for(let i=0;i<workingSet.length;i++){
            if(workingSet.category==="men's clothing"){
                clothing_men=clothing_men + 1
            }else if(workingSet.category==="women's clothing"){
                clothing_women = clothing_women + 1
            }else if(workingSet.category==="electronics"){
                electronics=electronics + 1
            }else{
                jewelery = jewelery + 1
            }
        }
       
        return {"clothing_men":clothing_men,
                "clothing_women":clothing_women,
                "jewelery":jewelery,
                "electronics": electronics,}
        
    }

    if(indicator==='stockValueByCategory'){
        var clothing_men=0;  var jewelery=0; var electronics=0; var clothing_women=0;
        for(let i=0;i<workingSet.length;i++){
            if(workingSet.category==="men's clothing"){
                clothing_men = clothing_men + (+workingSet.quantity * (+workingSet.price))
            }else if(workingSet.category==="women's clothing"){
                clothing_women = clothing_women + (+workingSet.quantity * (+workingSet.price))
            }else if(workingSet.category==="electronics"){
                electronics=electronics + (+workingSet.quantity * (+workingSet.price))
            }else{
                jewelery = jewelery + (+workingSet.quantity * (+workingSet.price))
            }
        }
       
        return {"clothing_men":clothing_men,
                "clothing_women":clothing_women,
                "jewelery":jewelery,
                "electronics": electronics,}    
    }

    if(indicator==="depletedStocks"){
        var depletedStocksArray=[];
       
        for(let i=0;i<workingSet.length;i++){
            if(+workingSet[i].quantity<1){
                
                depletedStocksArray.push(workingSet[i].title)
            }
            }
       
        if(depletedStocksArray.length>0){
            return depletedStocksArray;
        }else{
            depletedStocksArray=[];
            depletedStocksArray.push("All stocks High")
            return depletedStocksArray;
        }
        

    }
}

function sideBarSummary(){
    sideBarTotal=document.querySelector('.total-value');
    sideBarDepleted=document.querySelector('.depleted')
    sideBarCategories=document.querySelector('.sum-categories')
    sideBarTotal.innerHTML=`Total Stock Value: $ ${statisticsHandler("totalStockValue","allProducts")}`
    depletedResponse=statisticsHandler("depletedStocks","allProducts")
    
    depletedResponse.forEach((item,index)=>{
        let div=document.createElement('li');
        div.innerHTML=item.substring(0,18);
        sideBarDepleted.appendChild(div)

    })
}
sideBarSummary();

function colorLabel(qty,i){

    if(+qty===0){
        return `.item${i}`+" label-red"
    }
    else if(+qty>=1 && +qty<21){
        return `.item${i}`+" label-gold"
    }
    else{
        return `.item${i}`+" label-green"
    }

}



function tableFillHandler(){     
     let allProductsPlus = lstorageReadWrite(true,"allProductsPlus");
     
     for(let i=0;i<allProductsPlus.length;i++){
        htmlGenerator(i);
        let rowList=document.querySelectorAll(`.item${i}`)
        rowList[1].innerHTML=i+1;
        rowList[2].innerHTML=allProductsPlus[i].category.substring(0,25);
        rowList[3].innerHTML=allProductsPlus[i].title.substring(0,30);
        rowList[4].innerHTML=allProductsPlus[i].description.substring(0,60);
        rowList[5].innerHTML=allProductsPlus[i].price;
        rowList[6].innerHTML=allProductsPlus[i].quantity;
        rowList[7].className= colorLabel(allProductsPlus[i].quantity,i)
        
        
     }
}
tableFillHandler()


function htmlGenerator(i){  

    newRow = document.createElement("tr");
    newRow.className = 'rows row-'+ i;
    document.querySelector('.row-template').appendChild(newRow);

    createRowContent = `<td><input type="checkbox" class="check item${i}"></td>
                        <td><div class="label-code item${i}"></div></td>
                        <td><div class="category item${i}"></div></td>
                        <td><div class="name item${i}"></div></td>
                        <td><div class="description item${i}"></div></td>
                        <td><div class="label-code item${i}">price</div></td>
                        <td><div class="quantity item${i}"></div></td>
                        <td><div class=" item${i}"><div class="label"></div></div></td> 
                        <td><div class="edit item${i}"><a href="./details.html"><button class="edit">Edit</button></a></div></td>`
    document.querySelector(`.row-${i}`).innerHTML = createRowContent;

}



function securityToken(){  

    let CodeSaverArray = [];
    let hexRef = [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','0'];
    for(let i = 0; i < 5; i++){
        let thisIndex = Math.floor((Math.random() * 15) + 1);
        CodeSaverArray.push(hexRef[thisIndex]);
    }
    return CodeSaverArray.join("");
}

function buildSearchArray(){

    let allProducts = lstorageReadWrite(true,"allProductsPlus")
    var namesArray=[];
    var categoriesArray=[];
    for(let i=0; i< allProducts.length; i++){
        namesArray[i]=allProducts[i].title;
        categoriesArray[i] = allProducts[i].category;
    }
}
function search(){
    
}

const quickEditButtons=document.querySelectorAll(".edit")
quickEditButtons.forEach(element => {
    element.addEventListener('click',(e)=>{
        thisEvent=e.target.getAttribute("id").match(/\d+/g,'')
        quickEditHandler(thisEvent)
        console.log(thisEvent)
    })
});

function quickEditHandler(eventString){
    localStorage.setItem("forEditPage",JSON.stringify(eventString))
    location.assign("./edit.html")
}



const rows = document.querySelectorAll(".rows");  
rows.forEach(element => {
    element.addEventListener('click',(e)=>{
        let thisEvent=e.target.getAttribute("class").match(/\d+/g,'')
        itemEventsHandler(thisEvent)
        console.log(e)
    })
});
function itemEventsHandler(eventString){
  localStorage.setItem("forDetailsPage",JSON.stringify(eventString))
  location.assign("./details.html")
}





google.charts.load('current', {'packages':['corechart']});


google.charts.setOnLoadCallback(drawChart);




  
 



