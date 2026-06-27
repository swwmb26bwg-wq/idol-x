//localStorage.clear();
//localStorage.removeItem("notifications");


const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".bottom-nav button");

const tweetInput = document.getElementById("tweetInput");
const tweetImages = document.getElementById("tweetImages");
const postBtn = document.getElementById("postBtn");


const notifications = document.getElementById("notifications");
const followersCount = document.getElementById("followersCount");

const profileIcon = document.getElementById("profileIcon");
const headerImage = document.getElementById("headerImage");

const iconUpload = document.getElementById("iconUpload");
const headerUpload = document.getElementById("headerUpload");

const nameInput = document.getElementById("nameInput");
const idInput = document.getElementById("idInput");
const bioInput = document.getElementById("bioInput");


let followers = Number(localStorage.getItem("followers")) || 10;

let posts =
JSON.parse(localStorage.getItem("posts")) || [];


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



const fanNames = [
    "junhui_moon",
    "ho5hi_kwon",
    "everyone_woo",
    "jeonghaniyoo_n",
    "dk_is_dokyeom",
    "sound_of_coups",
    "woozi_universefactory",
    "vernon_98",
    "joshu_acoustic",
    "pledis_boos",
    "min9yu_k",
    "xuminghao_o",
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



function savePosts() {
    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );
}


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



function createPost(postData){

const {
    id,
    content,
    images,
    likes,
    rts,
    replies,
    name = nameInput.value,
    userId = idInput.value,
    icon = profileIcon.src
} = postData;

const post = document.createElement("div");
post.className = "post";

post.dataset.id = id;

    let imageHTML = "";

    images.forEach(img=>{
        imageHTML += `<img src="${img}">`;
    });

    post.innerHTML = `
<div class="post-header">
<img src="${icon}">
    
<div style="flex:1;" class="post-user">

<span class="post-name">${name}</span>
<span class="post-id">${userId}</span>

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


    
    const deleteBtn = post.querySelector(".delete-btn");

deleteBtn.addEventListener("click", () => {

    if(confirm("この投稿を削除しますか？")){

        const id = post.dataset.id;



posts = posts.filter(post => post.id != id);

savePosts();

document
    .querySelectorAll(`[data-id="${id}"]`)
    .forEach(p => p.remove());
    }

});




const profilePost = post.cloneNode(true);
profilePost.dataset.id = id;

profilePosts.prepend(profilePost);

const profileDeleteBtn =
    profilePost.querySelector(".delete-btn");

profileDeleteBtn.addEventListener("click", () => {

    if(confirm("この投稿を削除しますか？")) {

        const id = profilePost.dataset.id;

        posts = posts.filter(post => post.id != id);

        savePosts();

        document
            .querySelectorAll(`[data-id="${id}"]`)
            .forEach(p => p.remove());

    }

});



savePosts();
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


function generateStats(){

    let likes;

    const chance = Math.random();

    if(chance < 0.50){
        likes = random(0, Math.max(1, Math.floor(followers*0.1)));
    }else if(chance < 0.80){
        likes = random(
            Math.floor(followers*0.1),
            Math.floor(followers*0.5)
        );
    }else if(chance < 0.95){
        likes = random(
            Math.floor(followers*0.5),
            Math.floor(followers*2)
        );
    }else if(chance < 0.99){
        likes = random(
            Math.floor(followers*2),
            Math.floor(followers*5)
        );
    }else{
        likes = random(
            Math.floor(followers*10),
            Math.floor(followers*50)
        );
    }

    let rts;
    let replies;

    if(likes < 10){
        rts = random(0,2);
        replies = random(0,1);
    }else if(likes < 100){
        rts = random(
            Math.floor(likes*0.03),
            Math.floor(likes*0.1)
        );
        replies = random(
            Math.floor(likes*0.02),
            Math.floor(likes*0.08)
        );
    }else if(likes < 1000){
        rts = random(
            Math.floor(likes*0.05),
            Math.floor(likes*0.15)
        );
        replies = random(
            Math.floor(likes*0.03),
            Math.floor(likes*0.1)
        );
    }else{
        rts = random(
            Math.floor(likes*0.08),
            Math.floor(likes*0.2)
        );
        replies = random(
            Math.floor(likes*0.05),
            Math.floor(likes*0.15)
        );
    }

    return {
        likes,
        rts,
        replies
    };

}


function finishPost(images){

    const stats = generateStats();

const newPost = {
    id: Date.now(),
    content: tweetInput.value,
    images,
    likes: stats.likes,
    rts: stats.rts,
    replies: stats.replies,

    name: nameInput.value,
    userId: idInput.value,
    icon: profileIcon.src
};

    posts.unshift(newPost);

    savePosts();

    createPost(newPost);


let gain;
const chance = Math.random();



if (chance < 0.50) {
    // 50%
    gain = 0;
} else if (chance < 0.80) {
    // 30%
    gain = random(1, 5);
} else if (chance < 0.95) {
    // 15%
    gain = random(6, 20);
} else if (chance < 0.99) {
// 4%
    gain = random(21, 100);
} else {
    // 1%
    gain = random(500, 5000);
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

// 入力欄をリセット
    tweetInput.value = "";
    tweetImages.value = "";
    imagePreview.innerHTML = "";

    // 投稿完了メッセージ
    showToast("投稿されました！");

}
function showToast(message){
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

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
        saveProfile();
    };

    reader.readAsDataURL(file);
});

headerUpload.addEventListener("change",e=>{

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = ev=>{
        headerImage.src = ev.target.result;
        saveProfile();
    };

    reader.readAsDataURL(file);
});


function saveProfile() {
    const profile = {
        name: nameInput.value,
        id: idInput.value,
        bio: bioInput.value,
        icon: profileIcon.src,
        header: headerImage.src
    };

    localStorage.setItem(
        "profile",
        JSON.stringify(profile)
    );
    posts.forEach(post => {
    post.name = nameInput.value;
    post.userId = idInput.value;
    post.icon = profileIcon.src;
});

savePosts();

postsContainer.innerHTML = "";
profilePosts.innerHTML = "";

posts.forEach(post=>{
    createPost(post);
});

}

const postsContainer = document.getElementById("posts");

profilePosts.innerHTML = "";

posts.forEach(post => {
    createPost(post);
});nameInput.addEventListener("input", saveProfile);
idInput.addEventListener("input", saveProfile);
bioInput.addEventListener("input", saveProfile);
