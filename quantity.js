const contentTag = document.querySelector(".main");
 const infoWithOption=document.getElementById('alert-with-input');
 let infoArray=[];
 let forEditPage = JSON.parse(localStorage.getItem("forEditPage"))
let allProductsPlus = JSON.parse(localStorage.getItem("allProductsPlus"))
function logger(msg){
   
   newEvent={}
    var timeStamp = Number(new Date());
   newEvent['timeStamp']= timeStamp;
   newEvent["msg"]=msg;
    
    if(!localStorage.getItem("events")){
        infoArray.push(anEvent);
        localStorage.setItem("events",(JSON.stringify(infoArray)));
    }
    else{
    let events=JSON.parse(localStorage.getItem("events"));
    events.push(anEvent);
    localStorage.setItem("events",(JSON.stringify(events)));
    }
    displayAlert(1);
     
}
function loadDetails(forEditPage){
    const details = document.querySelectorAll('.des-content')
    document.querySelector('.de-image').src=allProductsPlus[+forEditPage].image
    details[0].value=allProductsPlus[+forEditPage]['title']
    details[1].value=allProductsPlus[+forEditPage]['category']
    details[2].value=allProductsPlus[+forEditPage]['quantity']
    details[3].value=allProductsPlus[+forEditPage]['price']
    details[4].value=allProductsPlus[+forEditPage]['description']

}
loadDetails(forEditPage)

function editHandler(response,token){
    if(response===undefined || token===undefined){
        let status="1";
        addNew = document.querySelectorAll(".des-content");
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
        console.log(status)
        if (status==="1"){
        var code = securityToken();
        console.log(code)
        alertHandler(true,"Save Changes?","editHandler",code)
        console.log("alert handler called")

        }
    } else{
        if (response==="okay"){
            saveValues()
            
        }
        else {
            alertHandler(false,"Changes not saved")
            logger("Failed edit attempt ")
            return
        }
        }

    function saveValues(){
     allProductsPlus=JSON.parse(localStorage.getItem("allProductsPlus"));
     console.log(allProductsPlus)
     let changeIndex= +forEditPage
     console.log(changeIndex)
     newObj={
         "id":changeIndex,
          "title":addNew[0].value,
          "image":allProductsPlus[+forEditPage].image,
          'quantity':addNew[2].valueAsNumber,
          price:addNew[3].valueAsNumber,
        category:allProductsPlus[+forEditPage].category,
        "description":document.getElementById('description').value,
         }
         allProductsPlus[changeIndex]=newObj;
         localStorage.setItem("allProductsPlus",JSON.stringify(allProductsPlus))
         logger(" Item edit successful")
         location.reload()
         alertHandler(false,"New Changes Saved Successfully")
    }
}


function alertHandler(reqres,message,from,token){
    

    if (typeof(reqres) !== "boolean" || message===""){ 
             console.log('alerthandler error! request-response not clear, or message is empty!')
         }
    else{
        if(reqres===true){      
           return callAlert(1,message,token);
        }
        else{
            callAlert(0,message);
        }
    }

    function callAlert(type,message,token){  
     
        let justAlert = `<div id="show-info">
                            <p id="info-p">${message}</p>
                            <button id="okay-and-nothing">Okay</button>
                        </div>`
        let notJustAlert=`<div id="alert-with-input">
                            <p id="info-input-p">${message}</p>
                            <button id="cancel" name="cancel" class="do-this">Cancel</button>
                            <button id="okay" name = "okay"class="do-this">Okay</button>
                          </div>`        
        if (type === 0 ){                                          
            document.querySelector('.back-drop').style.display="block";
            console.log(document.querySelector('.back-drop').className)
            contentTag.insertAdjacentHTML('afterbegin',justAlert)
            document.getElementById("okay-and-nothing").addEventListener('click',(e)=>{
                document.getElementById('show-info').remove();
                document.querySelector('.back-drop').style.display="none"
            });
        } 
        else{
            var code = token;
            var sender = from;
            document.querySelector('.back-drop').className = ('back-drop visibility');
           
            contentTag.insertAdjacentHTML('afterbegin',notJustAlert);
            document.querySelectorAll('.do-this').forEach(element => { 
                element.addEventListener('click', (e)=>{
                    var result = e.target.getAttribute('name');
                    console.log(code)
                    window[sender](result,token);
                    console.log(sender)
                   document.getElementById('alert-with-input').remove();
                   document.querySelector('.back-drop').className = ('back-drop')
                   
                })
                
            })
                    
        }  
    }     

}


function displayAlert(count){
    let counter;
    if (count !==1){counter=0;}
 
 if(!JSON.parse(localStorage.getItem('alertCounter'))){
 
  document.querySelector('.bell-back').innerHTML=counter;
  localStorage.setItem('alertCounter',JSON.stringify(counter))
 }else{
     alertCount= +JSON.parse(localStorage.getItem('alertCounter'))+counter;
     document.querySelector('.bell-back').innerHTML=alertCount;
     localStorage.setItem('alertCounter',JSON.stringify(alertCount))
 }

}
displayAlert()