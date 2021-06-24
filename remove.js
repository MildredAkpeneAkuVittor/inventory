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
         console.log('No such object found')
         return 0;
        }
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
        
        
        console.log(code)
        console.log(token)
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
            if(workingSet[i].category==="men's clothing"){
                clothing_men=clothing_men + 1
            }else if(workingSet[i].category==="women's clothing"){
                clothing_women = clothing_women + 1
            }else if(workingSet[i].category==="electronics"){
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
            if(workingSet[i].category==="men's clothing"){
                clothing_men = clothing_men + (+workingSet[i].quantity * (+workingSet[i].price))
            }else if(workingSet[i].category==="women's clothing"){
                clothing_women = clothing_women + (+workingSet[i].quantity * (+workingSet[i].price))
            }else if(workingSet[i].category==="electronics"){
                electronics=electronics + (+workingSet[i].quantity * (+workingSet[i].price))
            }else{
                jewelery = jewelery + (+workingSet[i].quantity * (+workingSet[i].price))
            }
        }
       
        return {"clothing_men":clothing_men,
                "clothing_women":clothing_women,
                "jewelery":jewelery,
                "electronics": electronics,}    
    }
    if(indicator==="totalItems"){
       return workingSet.length
    }

    if(indicator==="depletedStocks"){
        var depletedStocksArray=[];
        console.log(workingSet)
        for(let i=0;i<workingSet.length;i++){
            if(+workingSet[i].quantity<1){
                
                depletedStocksArray.push(workingSet[i].title)
            }
            }
            console.log(depletedStocksArray)
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
    console.log(depletedResponse)
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
        console.log(allProductsPlus[i].quantity)
        
     }
}
tableFillHandler()


function htmlGenerator(i){  

    newRow = document.createElement("tr");
    newRow.className = ' row-'+ i;
    document.querySelector('.row-template').appendChild(newRow);

    createRowContent = `<td class="rows"><input type="checkbox" class="check item${i}"></td>
                        <td class="rows"><div class="label-code item${i}"></div></td>
                        <td class="rows"><div class="category item${i}"></div></td>
                        <td class="rows"><div class="name item${i}"></div></td>
                        <td class="rows"><div class="description item${i}"></div></td>
                        <td class="rows"><div class="label-code item${i}">price</div></td>
                        <td class="rows"><div class="quantity item${i}"></div></td>
                        <td><div class=" item${i}"><div class="label"></div></div></td> 
                        <td><div><i id="delete${i}" class="fa fa-trash delete" aria-hidden="true"></i></div></td>`
document.querySelector(`.row-${i}`).innerHTML = createRowContent;

}



function securityToken(){   //generate 5 digit code for secure local storage lear and delete operations

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

const toDelete = document.querySelectorAll(".delete");
toDelete.forEach(element => {
    element.addEventListener('click',(e)=>{
        let thisEvent=e.target.getAttribute("id").match(/\d+/g,'')
    let code=securityToken()
    let eventInfo=[thisEvent,code]
    localStorage.setItem("forDeleteFunction",JSON.stringify(eventInfo));
    
        alertHandler(true,"Confirm Delete. Warning: Irreversible!!","deleteFunction",code)
       
    })
});

function deleteFunction(eventId,response,token){
   let eventInfo = JSON.parse(localStorage.getItem("forDeleteFunction"));
   if(response==="okay"){
       let index=eventInfo[0][0];
       let allProductsPlus=JSON.parse(localStorage.getItem("allProductsPlus"))
       allProductsPlus.splice(index,1);
       localStorage.setItem("allProductsPlus",(JSON.stringify(allProductsPlus)))
       alertHandler(false, "Delete Operation Successful!")
       window.location.reload()
   }
   else {
       alertHandler(false,"Delete Operation Cancelled!")
       window.location.reload()
    }

}


