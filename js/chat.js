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

function PopulateFriendList(){
    document.getElementById('lstFriend').innerHTML =`<div class="text-center">
                                                     <span class="spinner-border text-primary mt-5" style="width:7rem;height:7rem;"></span>
                                                     </div>`;
     
    var db = firebase.database().ref('users');
        var lst = '';
        db.on('value',function(users){
            if(users.hasChildren()){
                lst = `<li class="list-group-item"  style="background-color: #f8f8f8;">
                       <input type="text" placeholder="Search for new Item" class="form-control form-rounded"/>
                       </li>`;
            }
            users.forEach(function(data){
                var user = data.val();
                lst += `<li class="list-group-item list-group-item-action">
                        <div class="row">
                        <div class="col-md-2">
                        <img src="${user.photoURL}" alt="front pic" class="friend_pic rounded-circle"/>
                        </div>
                        <div class="col-md-10" style="cursor:pointer;">
                            <div class="name">${user.name}</div>
                        </div>
                        </div>
                        </li>`;
            });

            document.getElementById('lstFriend').innerHTML = lst;
        });                                                  
}

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
        var userProfile = {email:'',name:'',photoURL:''};

        userProfile.email = firebase.auth().currentUser.email;
        userProfile.name = firebase.auth().currentUser.displayName;
        userProfile.photoURL = firebase.auth().currentUser.photoURL;


        var db = firebase.database().ref('users');
        var flag = false;
        db.on('value',function(users){
            users.forEach(function(data){
                var user = data.val();
                if(user.email === userProfile.email)
                    flag = true;
            });

            if(flag === false){
                //data
                firebase.database().ref('users').push(userProfile,callback);
            }else{
                document.getElementById('image_Profile').src = firebase.auth().currentUser.photoURL;
                document.getElementById('image_Profile').title = firebase.auth().currentUser.displayName;
        
                document.getElementById('LnkSignIn').style = 'display:none';
                document.getElementById('LnkSignOut').style = '';      
            }
        });
        
    }
    else{
        document.getElementById('image_Profile').src = 'img/user.png';
        document.getElementById('image_Profile').title = '';

        document.getElementById('LnkSignIn').style = '';
        document.getElementById('LnkSignOut').style = 'display:none';
    }
}

/////////////////////////////////
/*info function*/

function callback(error){
    if(error){
        alert(error)

    }else{
        document.getElementById('image_Profile').src = firebase.auth().currentUser.photoURL;
        document.getElementById('image_Profile').title = firebase.auth().currentUser.displayName;
        
        document.getElementById('LnkSignIn').style = 'display:none';
        document.getElementById('LnkSignOut').style = '';
    }
}

/////////////////////////
/*Call auth state change */

onFireBaseStateChanged();