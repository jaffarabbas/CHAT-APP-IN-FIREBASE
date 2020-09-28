function StartChat(id){
    document.getElementById('ChatPanel').removeAttribute('style');
    document.getElementById('divStart').setAttribute('style','display:none');
    hideChatList();
}

///////////////////////////////

function showChatList(){
    document.getElementById('side-1').classList.remove('d-none','d-md-block');
    document.getElementById('side-2').classList.add('d-none');
}

function hideChatList(){
    document.getElementById('side-1').classList.add('d-none','d-md-block');
    document.getElementById('side-2').classList.remove('d-none');
}

function OnKeyDown(){
    document.addEventListener('keydown',function (key) {
        if(key.which === 13){
            SendMessage();
        }
    });
}

function SendMessage(){
    var message = `<div class="row justify-content-end">
    <div class="col-6 col-sm-7 col-md-7">
       <p class="sent float-right">
       ${document.getElementById('textMessage').value}
           <span class="time float-right">1:28 PM</span>
       </p>
    </div>
    <div class="col-2 col-sm-1 col-md-1">
           <img src="img/user.png" alt="chat pic" class="chat_pic rounded-circle"/>
    </div>
    </div>`;

    document.getElementById('messages').innerHTML += message;
    document.getElementById('textMessage').value = '';
    document.getElementById('textMessage').focus();
    //scroll overdolw downward when chat exit from card
    document.getElementById('messages').scrollTo(0,document.getElementById('messages').clientHeight);
}



///////////////////////////////////////////////////////////////////////////
/******************************************firebase starts********************************************/

function signIn(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function signOut(){
    firebase.auth().signOut();
}

function onFireBaseStateChanged(){
    firebase.auth().onAuthStateChanged(onStateChanged);
}

function onStateChanged(user){
    if(user){
        document.getElementById('image_Profile').src = firebase.auth().currentUser.photoURL;
        document.getElementById('image_Profile').title = firebase.auth().currentUser.displayName;
    }
}


/////////////////////////
/*Call auth state change */

onFireBaseStateChanged();