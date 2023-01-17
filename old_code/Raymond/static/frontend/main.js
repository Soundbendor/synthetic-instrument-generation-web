const audioBox = document.getElementById('audio-box') //get the div audio-box
const audioBox2 = document.getElementById('audio-box-2')
// set a max and min for giving out random number of audio 
let max = 7
let min = 1
// get dom obejcts 
var sumbitbutton = document.getElementById('sumbitbutton')
var ids = document.getElementById('ids')



//create a form that create a form that display selection 
function createForm(first,second){
    console.log("first,second",first,second)
    ids.innerHTML = 
        `<select id="ids" name="ids" type="submit"> 
        <option id= "first" value =${first} name="first"> ${first} </option>
        <option id = "second" value =${second} name = "second"> ${second} </option>
        
        </select>`
    sumbitbutton.innerHTML =
        `
        <input id="sumbitbutton" type="submit" value="submit" name="choosen">
        `
}


const handleGetData = (first,second) =>{
    $.ajax({
    type: 'GET',
    url: `/json/${first}/${second}`,
    success: function(response)
    {

        //getting all the data and display in the console
        const firstData = response.firstAudio 
        const secondData = response.secondAudio
        console.log(firstData)
        console.log(secondData)
        firstData.map(post=>{
            console.log(post)
            audioBox.innerHTML =
            //how to get the location right?
            `
            <div class="card p-3 mt-3 mb-3">
                <h> Audio ID: ${first}</h>
                <audio controls>
                <source src= ${post.location} type="audio/wav"> 
                </audio>
            </div>
            `
        })
        secondData.map(post=>{
            console.log(post)
            audioBox2.innerHTML =
            //how to get the location right?
            `
            <div class="card p-3 mt-3 mb-3">
                <h> Audio ID: ${second}</h>
                <audio controls>
                <source src= ${post.location} type="audio/wav"> 
                </audio>
            </div>
            `
        })
        


},//end of success
    error:function(error){
        console.log(error)


    }//end of error

})//end of ajax

}



const startButton = document.getElementById("startButton")
const mainDiv = document.getElementById("hidden")

//starting the rating progress 
startButton.addEventListener('click', ()=>{
    console.log("start button clicked")
    mainDiv.classList.remove("hidden")
    mainDiv.classList.add("show")
    first = Math.floor(Math.random() * (max-min) + min)
    second = Math.floor(Math.random() * (max-min) + min)
    while(first == second)
    {
        first = Math.floor(Math.random() * (max-min) + min)
        second = Math.floor(Math.random() * (max-min) + min)
    }
    handleGetData(first,second)
    createForm(first,second)
    startButton.classList.add("hidden")
})



$(document).on('submit', '#selectForm', function(e){
    e.preventDefault();

    $.ajax({
        type:'POST',
        url:'/submit',
        data:{
            first:$('#first').val(),
            second:$('#second').val(),
            ids:$('#ids').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),

        },
        // function that would repeat after successful submission 
        success:function(){
            console.log("====submit successfully")
            first = Math.floor(Math.random() * (max-min) + min)
            second = Math.floor(Math.random() * (max-min) + min)
            while(first == second)
            {
                first = Math.floor(Math.random() * (max-min) + min)
                second = Math.floor(Math.random() * (max-min) + min)
            }
            handleGetData(first,second)
            createForm(first,second)
            
        }
    });
    //stop at how access url



});
