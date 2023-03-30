count = 0;
const main = document.getElementById("main");
const pop = document.getElementById("pop");
const popup = document.getElementById("popup");
function getpro() {
    var request = new XMLHttpRequest();
    request.open("get", "./getpro");
    request.addEventListener("load", function (response) {
        arr = JSON.parse(request.responseText);
        display(arr);
    })
    request.send();
}

function removeallchild(k) {
    let c = k.lastElementChild;
    while (c) {
        k.removeChild(c);
        c = k.lastElementChild;
    }
}


function create(el) {
    let card = document.createElement("div");
    card.setAttribute("class", "col-md-2");
    card.setAttribute("id", el.id);

    let hcard = document.createElement("div");
    hcard.setAttribute("class", "card h-100 shadow-sm");

    let im = document.createElement("img");
    im.setAttribute("src", el.image);
    im.setAttribute("class", "card-img-top");
    // console.log(hcard);
    hcard.appendChild(im);

    let bcard = document.createElement("div");
    bcard.setAttribute("class", "card-body");

    let d1 = document.createElement("div");
    d1.setAttribute("class", "mb-3");

    let s1 = document.createElement("span");
    s1.setAttribute("class", "float-start badge rounded-pill bg-primary");
    s1.innerHTML = el.name;

    let s2 = document.createElement("span");
    s2.setAttribute("class", "float-end price-hp");
    s2.innerHTML = el.price + "&#8377";

    d1.appendChild(s1);
    d1.appendChild(s2);
    bcard.appendChild(d1);

    let h5 = document.createElement("h5");
    h5.setAttribute("class", "card-title");
    h5.innerText = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam quidem eaque ut eveniet aut quis rerum.Asperiores accusamus harum ducimus velit odit ut.Saepe, iste optio laudantium sed aliquam sequi."

    bcard.appendChild(h5);

    let d2 = document.createElement("div");
    d2.setAttribute("class", "text-center my-4");

    let a = document.createElement("a");
    a.setAttribute("herf", "#");
    a.setAttribute("class", "btn btn-warning pop");
    a.setAttribute("id", el.id);
    a.addEventListener("click",()=>{
        // console.log("hello");
        // console.log(a.id);
        removeallchild(popup);
        let temp;
        for(let i=0;i<arr.length;i++){
            if(arr[i].id==parseInt(a.id)){
                temp = arr[i];
                break;
            }
        }
        // console.log(temp);
        ph1 = document.createElement("h1");
        ph1.innerText = temp.name;
        pp = document.createElement("p");
        pp.innerText = temp.details;
        pb = document.createElement("button");
        pb.setAttribute("class","btn btn-warning");
        pb.addEventListener("click",()=>{
            popup.setAttribute("class","hidden");
            // popup.classList.remove("show");
            // popup.classList.add("hidden");
        })
        pb.innerText = "OK";
        popup.setAttribute("class","show");
        
        // popup.classList.add("show");
        popup.appendChild(ph1);
        popup.appendChild(pp);
        popup.appendChild(pb);
    })
    a.innerText = "Details";

    d2.appendChild(a);
    bcard.appendChild(d2);
    hcard.appendChild(bcard);

    card.appendChild(hcard);

    main.appendChild(card);


}

function display(arr) {
    if (arr.length >= count + 5) {
        for (let i = count; i < count + 5; i++) {
            create(arr[i]);
        }
    }
    else {
        while (count != arr.length) {
            create(arr[count]);
            count++;
        }
    }

}


const next = document.getElementById('next');
next.addEventListener('click', function () {
    let arr = [];
    count = parseInt(main.lastElementChild.id) + 1;
    removeallchild(main);
    getpro();

})



let arr = [];
getpro();


