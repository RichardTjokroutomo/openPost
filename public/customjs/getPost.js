
// DECLARATIONS
// ===============================================================================
//const rootUrl ="http://localhost:8080" || process.env.ROOT_URL;
//const rootUrl = "http://localhost:3000"
//const rootUrl = "https://open-post-api.herokuapp.com";
const rootUrl = "https://ill-cyan-sea-urchin-kit.cyclic.app";
const loadMoreButton = document.querySelector("#load");
const updateAlert = document.querySelector("#updateAlert");
const noUpdateAlert = document.querySelector("#noUpdateAlert");

let latestIndex = 0;  // gets the sNum of the newest post
let postsLoaded = 0;  // how many posts the page has loaded so far

// FUNCTIONS
// ===============================================================================

// this function is initially called during 1st render to initialize the latest sNum
const getLatestIndexINIT = async()=>{
    const url = `${rootUrl}/api/index`;
    const index = await fetch(url);
    const parsedIndex = await index.json();

    latestIndex = parsedIndex.latest;
}

// this function is called when user clicks the "load more" button
const loadMoreHandler = async ()=>{
    // fetching the data....
    console.log("load more handler");
    console.log(latestIndex);
    const url = `${rootUrl}/api/loadmore?latest_index=${latestIndex}&posts_loaded=${postsLoaded}`;
    const reply = await fetch(url);
    const parsedReply = await reply.json();

    const {postLists, usernameList} = parsedReply;
    postsLoaded += 3;   // we load 3 posts at a time.
    console.log(postLists);

    // NOW CREATING THE CARDS 
    // =============================================================================================
   for(let i = 0; i<3; i++){
    const rootDiv = document.querySelector("#postHolders");

    const divRow = document.createElement("div");
    divRow.classList.add("row", "justify-content-center");

    // left & right sentinels, so the content is centered
    const divLeft = document.createElement("div");
    const divRight = document.createElement("div");
    divLeft.classList.add("col-2");
    divRight.classList.add("col-2");

    // center div, this is where the post is being displayed.
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("col-8");

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "mb-3");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // content
    const titleText = document.createElement("h5");
    titleText.classList.add("card-title");
    titleText.innerText = postLists[i].title;

    const contentText = document.createElement("p");
    contentText.classList.add("card-text");
    contentText.innerText = postLists[i].content;

    // ADD AUTHOR HERE LATER ON
    const author = document.createElement("p");
    author.classList.add("card-text", "text-muted");
    const text = `by ${usernameList[i]}`;
    author.innerText = text;

    // adding content to cardbody
    cardBody.appendChild(titleText);
    cardBody.appendChild(contentText);
    cardBody.appendChild(author);

    // adding card body to cardDiv
    cardDiv.appendChild(cardBody);

    // adding cardDiv to contentDiv (col-8)
    contentDiv.appendChild(cardDiv);

    // adding col divs to row div
    divRow.appendChild(divLeft);
    divRow.appendChild(contentDiv);
    divRow.appendChild(divRight);

    // pushing divrow to the HTML's root div
    rootDiv.appendChild(divRow);
   }

/*
    <div class="row justify-content-center">
            <div class="col-2"></div>
            <div class="col-8">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title"><%=postLists[i].title%></h5>
                  <p class="card-text"><%=postLists[i].content%></p>
                  <p class="card-text"><small class="text-muted">by <%=usernameList[i]%></small></p>
                </div>
              </div>
            </div>
            <div class="col-2"></div>
          </div>
          */
}


// this function is used in the setinterval. it checks whether there is a new post or not. if there
// is, then an alert will be prompted.
const checkLatestPosts = async ()=>{
    const url = `${rootUrl}/api/index`;
    const index = await fetch(url);
    const parsedIndex = await index.json();
    console.log(`now there are ${parsedIndex.latest} posts`);

    if(parsedIndex.latest != latestIndex){
        console.log("update!");
        updateAlert.classList.remove("updateAlert");
        noUpdateAlert.classList.add("updateAlert");
    }
    else{
        console.log("nothing new....");
    }
}



// EVENTS
// ===============================================================================
loadMoreButton.addEventListener("click", function (){ loadMoreHandler()});


// CALLED DURING INIT
// ===============================================================================
const jsInit = async ()=>{
    await getLatestIndexINIT();
    await loadMoreHandler();
}

jsInit();
setInterval(checkLatestPosts, 2000);
