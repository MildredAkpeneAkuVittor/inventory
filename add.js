
 const contentTag = document.querySelector(".main");
 const infoWithOption=document.getElementById('alert-with-input');
 const btn = document.querySelector("#add-button");
 const categoryInfo=document.querySelector(".category-info")

 function newEntryHandler(response,token){

        if(response===undefined || token===undefined){
        let status="1";
        addNew = document.querySelectorAll(".add-new");
        console.log(addNew.length); 
        checkValues()
        function checkValues(){
            for(let i=0; i<addNew.length;i++){
                if (addNew[i].value===""){
                addNew[i].style.border="solid 1px red";
                addNew[i].placeholder="Enter Valid Values"
                status="not okay"
                console.log(status)
                return
                console.log(status)
                }else{status="1";}
                if( addNew[i].value==="--Please choose an option--"){
                categoryInfo.innerText='Please choose a category';
                status='not okay'
                console.log(status)
                return
                }else {status="1";}
            }
             if(document.getElementById('description').value===""||
             document.getElementById('description').value==="Please enter a Description!!!"){
                 console.log(document.getElementById('description').innerText)
                document.getElementById('description').value="Please enter a Description!!!" 
                document.getElementById('description').style.border="solid 1px red"
                status="not okay"
                console.log(status)
                return
            }else {status="1"}
        }
      
        if (status==="1"){
        var code = securityToken();
        
        alertHandler(true,"Confirm New Changes?","newEntryHandler",code)
        

        }
    }else{
        if (response==="okay"){
            saveValues()
            
        }
        else {
            alertHandler(false,"Changes not saved")
            return
        }
        }

    function saveValues(){
     allProductsPlus=JSON.parse(localStorage.getItem("allProductsPlus"));
     console.log(allProductsPlus)
     let newIndex= +allProductsPlus.length + 1
     newObj={
         "id":newIndex,
          "title":addNew[0].value,
          quantity:addNew[1].valueAsNumber,
          price:addNew[2].valueAsNumber,
        category:addNew[3].value,
        "description":document.getElementById('description').value,
         }
         allProductsPlus.push(newObj);
         localStorage.setItem("allProductsPlus",JSON.stringify(allProductsPlus))
         location.reload()
         alertHandler(false,"New Changes Saved Successfully")
    }
}
btn.addEventListener('click',newEntryHandler)



function securityToken(){   
    let CodeSaverArray = [];
    let hexRef = [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','0'];
    for(let i = 0; i < 5; i++){
        let thisIndex = Math.floor((Math.random() * 15) + 1);
        CodeSaverArray.push(hexRef[thisIndex]);
    }
    return CodeSaverArray.join("");
}