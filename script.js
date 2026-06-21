//localStorage.clear();
//localStorage.removeItem("notifications");

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".bottom-nav button");

const tweetInput = document.getElementById("tweetInput");
const tweetImages = document.getElementById("tweetImages");
const postBtn = document.getElementById("postBtn");
const posts = document.getElementById("posts");

const notifications = document.getElementById("notifications");
const followersCount = document.getElementById("followersCount");

const profileIcon = document.getElementById("profileIcon");
const headerImage = document.getElementById("headerImage");

const iconUpload = document.getElementById("iconUpload");
const headerUpload = document.getElementById("headerUpload");

const nameInput = document.getElementById("nameInput");
const idInput = document.getElementById("idInput");
const bioInput = document.getElementById("bioInput");
const saveProfileBtn = document.getElementById("saveProfile");

let followers = Number(localStorage.getItem("followers")) || 100000;

const profilePosts =
document.getElementById("profilePosts");


const imagePreview =
document.getElementById("imagePreview");

tweetImages.addEventListener("change", () => {

    imagePreview.innerHTML = "";

    const files =
    [...tweetImages.files].slice(0,4);

    files.forEach(file => {

        const reader =
        new FileReader();

        reader.onload = e => {

            const img =
            document.createElement("img");

            img.src = e.target.result;

            imagePreview.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

});

const fanComments = [
    "かわいすぎる😭💜",
    "今日もビジュ最高！",
    "会いたいよ〜🥹",
    "投稿ありがとう💜",
    "大好き！！",
    "天才アイドル😭",
    "ずっと応援してる💜",
    "今日も最高です✨"
];

const fanNames = [
    "lumi_01",
    "purple_star",
    "annzu_love",
    "angel_fan",
    "kpop_girl",
    "luv_annzu",
    "moonlight",
    "violetfan"
];

function saveFollowers() {
    localStorage.setItem("followers", followers);
    followersCount.textContent = followers.toLocaleString();
}

saveFollowers();

navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        pages.forEach(page => page.classList.remove("active"));
        document.getElementById(btn.dataset.page).classList.add("active");
    });
});

function addNotification(text) {
    const div = document.createElement("div");
    div.className = "notice";
   div.innerHTML = text;

    notifications.prepend(div);

    localStorage.setItem(
        "notifications",
        notifications.innerHTML
    );
}

const savedNotifications = localStorage.getItem("notifications");
if(savedNotifications){
    notifications.innerHTML = savedNotifications;
}

function random(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function createPost(content, images){

    const likes = random(3000,20000);
    const rts = random(200,3000);
    const replies = random(50,800);

    const post = document.createElement("div");
    post.className = "post";

    let imageHTML = "";

    images.forEach(img=>{
        imageHTML += `<img src="${img}">`;
    });

    post.innerHTML = `
<div class="post-header">
    <img src="${profileIcon.src}">
    
    <div style="flex:1;">
        <div class="post-name">${nameInput.value} ☑️</div>
        <div class="post-id">${idInput.value}</div>
    </div>

    <button class="delete-btn">⋯</button>
</div>

        <div class="post-content">${content}</div>

        <div class="post-images">
            ${imageHTML}
        </div>

<div class="post-stats">

    <span class="stat">
        <img src="images/like.png" class="stat-icon">
        ${likes.toLocaleString()}
    </span>

    <span class="stat">
        <img src="images/repost.png" class="stat-icon">
        ${rts.toLocaleString()}
    </span>

    <span class="reply-btn stat">
        <img src="images/reply.png" class="stat-icon">
        ${replies.toLocaleString()}
    </span>

</div>
    `;

    const replyBtn = post.querySelector(".reply-btn");

    replyBtn.addEventListener("click",()=>{

        let comments = "";

        for(let i=0;i<8;i++){
            comments +=
            fanNames[random(0,fanNames.length-1)] +
            " : " +
            fanComments[random(0,fanComments.length-1)] +
            "\n";
        }

        alert(comments);
    });
    
    const deleteBtn = post.querySelector(".delete-btn");

deleteBtn.addEventListener("click", () => {

    if(confirm("この投稿を削除しますか？")){

        post.remove();

        localStorage.setItem(
            "posts",
            posts.innerHTML
        );

    }

});

posts.prepend(post);

const profilePost = post.cloneNode(true);

profilePosts.prepend(profilePost);

localStorage.setItem(
    "posts",
    posts.innerHTML
);

localStorage.setItem(
    "profilePosts",
    profilePosts.innerHTML
);
}


const savedPosts = localStorage.getItem("posts");
if(savedPosts){
    posts.innerHTML = savedPosts;
    attachEvents();
}

function attachEvents() {

    document.querySelectorAll(".delete-btn").forEach(btn => {

        btn.onclick = () => {

            const post = btn.closest(".post");

            if(confirm("この投稿を削除しますか？")) {

                post.remove();

                localStorage.setItem(
                    "posts",
                    posts.innerHTML
                );

            }

        };

    });

}
postBtn.addEventListener("click",()=>{

    if(
        !tweetInput.value.trim() &&
        tweetImages.files.length === 0
    ){
        return;
    }

    const files = [...tweetImages.files].slice(0,4);

    const images = [];

    if(files.length){

        let loaded = 0;

        files.forEach(file=>{

            const reader = new FileReader();

            reader.onload = e=>{

                images.push(e.target.result);

                loaded++;

                if(loaded===files.length){
                    finishPost(images);
                }
            };

            reader.readAsDataURL(file);

        });

    }else{
        finishPost([]);
    }
imagePreview.innerHTML = "";
});

function finishPost(images){

    createPost(
        tweetInput.value,
        images
    );

    let gain = random(50,500);

    if(Math.random() < 0.15){
        gain += random(1000,5000);
    }

    followers += gain;
    saveFollowers();

    addNotification(
        `<img src="images/followers.png" class="notice-icon">
        フォロワーが +${gain} 増えました`
    );

    addNotification(
        `<img src="images/likes.png" class="notice-icon">
        ${fanNames[random(0,fanNames.length-1)]}
        があなたの投稿をいいねしました`
    );

    addNotification(
        `<img src="images/replys.png" class="notice-icon">
        新しい返信があります`
    );

    tweetInput.value = "";
    tweetImages.value = "";
}

saveProfileBtn.addEventListener("click",()=>{

    const profile = {
        name:nameInput.value,
        id:idInput.value,
        bio:bioInput.value,
        icon:profileIcon.src,
        header:headerImage.src
    };

    localStorage.setItem(
        "profile",
        JSON.stringify(profile)
    );

    alert("プロフィールを保存しました！");
});

const savedProfile =
JSON.parse(
    localStorage.getItem("profile")
);

if(savedProfile){

    nameInput.value = savedProfile.name;
    idInput.value = savedProfile.id;
    bioInput.value = savedProfile.bio;

    if(savedProfile.icon){
        profileIcon.src = savedProfile.icon;
    }

    if(savedProfile.header){
        headerImage.src = savedProfile.header;
    }
}

iconUpload.addEventListener("change",e=>{

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = ev=>{
        profileIcon.src = ev.target.result;
    };

    reader.readAsDataURL(file);
});

headerUpload.addEventListener("change",e=>{

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = ev=>{
        headerImage.src = ev.target.result;
    };

    reader.readAsDataURL(file);
});
const savedProfilePosts =
localStorage.getItem("profilePosts");

if(savedProfilePosts){
    profilePosts.innerHTML =
    savedProfilePosts;
}
