var currentUserKey = '';
var chatKey = '';

function StartChat(friendKey, friendName, friendPhoto){

    var friendList = {friendId : friendKey,userId:currentUserKey};
    var flag = false;
    var db = firebase.database().ref('friend_List');
        db.on('value',function(friends){
            friends.forEach(function(data){
                var user = data.val();
                if((user.friendId === friendList.friendId && user.userId && friendList.userId) || (user.userId === friendList.userId && user.userId && friendList.friendId)){
                    flag = true;
                    chatKey = data.key;
                }
            });

            if(flag === false){
                chatKey = firebase.database().ref('friend_List').push(friendList,function(error){
                    if(error){
                        alert(error);
                    }else{
                        document.getElementById('ChatPanel').removeAttribute('style');
                        document.getElementById('divStart').setAttribute('style','display:none');
                        hideChatList();
                    }
                }).getKey();
            }else{
                document.getElementById('ChatPanel').removeAttribute('style');
                document.getElementById('divStart').setAttribute('style','display:none');
                hideChatList();
            }

            ////////////////////
            //chat pane user detials
            document.getElementById('divChatName').innerHTML = friendName;
            document.getElementById('imgChat').src = friendPhoto;

            document.getElementById('messages').innerHTML = '';
            /////////////////////
            /*display chat messgae from database */
            LoadChatMessages(chatKey);
        });   
}

///////////////////////////////

function LoadChatMessages(chatKey){
    var db = firebase.database().ref('chatMessages').child(chatKey);
    db.on('value',function(chats){
        var messageDisplay = '';
        chats.forEach(function(data){
            var chat = data.val();
            var dateTime = chat.dateTime.split(",");          
            if(chat.userId !== currentUserKey){
               messageDisplay  += ` <div class="row">
               <div class="col-2 col-sm-1 col-md-1">
                   <img src="img/user.png" alt="chat pic" class="chat_pic rounded-circle"/>
               </div>
               <div class="col-6 col-sm-7 col-md-7">
                  <p class="receive">
                  ${chat.msg}
                  <span class="time float-right" title="${dateTime[0]}">${dateTime[1]}</span>
                  </p>
               </div>
               </div>`;
            }else{
                messageDisplay += `<div class="row justify-content-end">
                <div class="col-6 col-sm-7 col-md-7">
                <p class="sent float-right">
                ${chat.msg}
                    <span class="time float-right" title="${dateTime[0]}">${dateTime[1]}</span>
                </p>
                </div>
                <div class="col-2 col-sm-1 col-md-1">
                    <img src="${firebase.auth().currentUser.photoURL}" alt="chat pic" class="chat_pic rounded-circle"/>
                </div>
                </div>`;
            }
        });
        document.getElementById('messages').innerHTML = messageDisplay;
        //scroll overdolw downward when chat exit from card
        document.getElementById('messages').scrollTo(0,document.getElementById('messages').clientHeight);
    });
}

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
    var chatMessage = {
        userId: currentUserKey,
        msg : document.getElementById('textMessage').value,
        dateTime : new Date().toLocaleString()
    };
    firebase.database().ref('chatMessages').child(chatKey).push(chatMessage,function(error){
        if(error){
            alert(error);
        }
        else{
        //     var message = `<div class="row justify-content-end">
        //     <div class="col-6 col-sm-7 col-md-7">
        //     <p class="sent float-right">
        //     ${document.getElementById('textMessage').value}
        //         <span class="time float-right">0:0</span>
        //     </p>
        //     </div>
        //     <div class="col-2 col-sm-1 col-md-1">
        //         <img src="${firebase.auth().currentUser.photoURL}" alt="chat pic" class="chat_pic rounded-circle"/>
        //     </div>
        //     </div>`;

        //     document.getElementById('messages').innerHTML += message;
            document.getElementById('textMessage').value = '';
            document.getElementById('textMessage').focus();
        //     //scroll overdolw downward when chat exit from card
        //     document.getElementById('messages').scrollTo(0,document.getElementById('messages').clientHeight);
        }
    });
}



///////////////////////////////////////////////////////////////////////////
/******************************************firebase starts********************************************/

function LoadChatList(){
    var db = firebase.database().ref('friend_List');    
    db.on('value',function(lists){
        document.getElementById('lstChat').innerHTML = ` <li class="list-group-item"  style="background-color: #f8f8f8;">
                                                              <input type="text" placeholder="Search for new Item" class="form-control form-rounded"/>
                                                              </li>`;
        lists.forEach(function(data){
            var lst = data.val();
            var friendKey = '';
            if(lst.friendId === currentUserKey){
                friendKey = lst.userId;
            }else if(lst.userId === currentUserKey){
                friendKey = lst.friendId;
            }

            if(friendKey !== ""){
                firebase.database().ref('users').child(friendKey).on('value',function(data){
                    var user = data.val();
                    document.getElementById('lstChat').innerHTML += ` <li class="list-group-item list-group-item-action" onclick="StartChat('${data.key}','${user.name}','${user.photoURL}')">
                   <div class="row">
                       <div class="col-md-2">
                        <img src="${user.photoURL}" alt="front pic" class="friend_pic rounded-circle"/>
                       </div>
                       <div class="col-md-10" style="cursor:pointer;">
                           <div class="name">${user.name}</div>
                           <div class="under_name pt-1">This is some Message text</div>
                        </div>
                    </div>
                    </li>`;
                });
            }
        });
    });
}

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
                if(user.email !== firebase.auth().currentUser.email){
                    lst += `<li class="list-group-item list-group-item-action" data-dismiss="modal" onclick="StartChat('${data.key}','${user.name}','${user.photoURL}')">
                        <div class="row">
                        <div class="col-md-2">
                        <img src="${user.photoURL}" alt="front pic" class="friend_pic rounded-circle"/>
                        </div>
                        <div class="col-md-10" style="cursor:pointer;">
                            <div class="name">${user.name}</div>
                        </div>
                        </div>
                        </li>`;
                }
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
                if(user.email === userProfile.email){
                    currentUserKey = data.key;
                    flag = true;
                }
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
            //new chat enabled when user sign in
            document.getElementById('LnkNewChat').classList.remove('disabled');

            LoadChatList();
        });
        
    }
    else{
        document.getElementById('image_Profile').src = 'img/user.png';
        document.getElementById('image_Profile').title = '';
        
        document.getElementById('LnkSignIn').style = '';
        document.getElementById('LnkSignOut').style = 'display:none';
        
        //new chat disabled when user is not sign in
        document.getElementById('LnkNewChat').classList.add('disabled');
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