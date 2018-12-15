//initialize firebase
const config = {
    apiKey: "AIzaSyBFpk2n34wvReaeKeZ7KKIp2r9f9fCAr7c",
    authDomain: "groupproject-712e1.firebaseapp.com",
    databaseURL: "https://groupproject-712e1.firebaseio.com",
    projectId: "groupproject-712e1",
    storageBucket: "groupproject-712e1.appspot.com",
    messagingSenderId: "785543171942"
};
firebase.initializeApp(config);

(function() {
    const dbRef = firebase.database().ref('All/Location');
    dbRef.on('child_added', snap => {
        const div = document.createElement('div');
        div.innerText = snap.key + ":";
        div.id = snap.key;
        buildingList.appendChild(div);
        const sideBar = document.getElementById('side-bar');
        const sides = document.createElement('div');
        const checkboxForSide = document.createElement('input');
        checkboxForSide.onclick = hideFunction;
        sides.id = snap.key + '_sides';
        checkboxForSide.setAttribute("type", "checkbox");
        checkboxForSide.setAttribute("name", snap.key);
        sides.innerText = snap.key;
        sideBar.appendChild(sides);
        sides.appendChild(checkboxForSide);

        snap.forEach(function(childSnap) {
            var roomkey = childSnap.key;
            const ul = document.createElement('ul');
            div.appendChild(ul);
            ul.innerText = roomkey + ":";
            ul.setAttribute("building", snap.key);
            ul.id = roomkey;
            const selected = document.createElement('input');
            selected.setAttribute("type", "checkbox");
            selected.setAttribute("id", roomkey);
            selected.setAttribute("name", snap.key);
            ul.appendChild(selected);

            childSnap.forEach(function(attributes) {
                const li = document.createElement('li');
                ul.appendChild(li);
                li.innerText = attributes.key + ": " + attributes.val();
            });
        });
    });
    
    //change included(replace and change)
    dbRef.on('child_changed', snap => {
        const building = document.getElementById(snap.key);
        building.innerText = "";
        building.innerText = snap.key;

        snap.forEach(function(childSnap) {
            var roomkey = childSnap.key;
            const ul = document.createElement('ul');
            building.appendChild(ul);
            ul.innerText = roomkey + ":";
            ul.setAttribute("building", snap.key);
            ul.id = roomkey;
            const selected = document.createElement('input');
            selected.setAttribute("type", "checkbox");
            selected.setAttribute("id", roomkey);
            selected.setAttribute("name", "selectedRoom");
            ul.appendChild(selected);

            childSnap.forEach(function(attributes) {
                const li = document.createElement('li');
                ul.appendChild(li);
                li.innerText = attributes.key + ": " + attributes.val();
            });           
        });
    });

    //remove function(if building layer is not a object)
    dbRef.on('child_removed', snap => {
        const removedElement = document.getElementById(snap.key);
        removedElement.remove();
    });


    //bookedlist loading part
    const bookedList = document.getElementById('roomList');
    const bookedListRef = firebase.database().ref('All/BookedList');
    bookedListRef.on('child_added', snap => {
        const div = document.createElement('div');
        const ul = document.createElement('ul');
        ul.innerHTML = snap.key;
        div.appendChild(ul);
        bookedList.appendChild(div);
        //details of every student information
        snap.forEach(childsnap => {
            const li = document.createElement('li');
            li.innerHTML = childsnap.val();
            ul.appendChild(li);
        });
    });

    //bookedlist remove part
    bookedListRef.on('child_removed', snap => {
        const removedElement = document.getElementById(snap.key);
        removedElement.remove();
    });


    const btnLogout = document.getElementById('btnLogout');
    
    //Logout Event
    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
        window.location = 'index.html';
    });

    var submit = document.getElementById("submitbtn");
    var selectedRoom = document.getElementsByName("selectedRoom");
    
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(!firebaseUser) {
            console.log('not logged in');
            btnLogout.style.display = "none";
        } else {
            var alogin = document.getElementById("aLogin");
            alogin.style.display = "none";
            submit.disabled = false;
            //console.log(firebaseUser);
        }
    });
}());

/*
//optimize path 数组类型
const ref = firebase.database().ref('All/Location');
//ref.path.pieces[] = 'BookedList';
console.log(ref.path);
*/

const rooms = document.getElementsByTagName("input");
function checkCheckboxs () {
    //check room only one can be choose
    var count = 0;
    var selectedNumArray = new Array();
    for(let i = 0; i < rooms.length; i++) {
        if(rooms[i].checked) {
            selectedNumArray[count] = i;
            count++;
        }
    }
    if(selectedNumArray.length > 1) {
        alert("Only one room you can choose!");
        return false;
    } else if(count == 0) {
        alert("You have not choose any room yet!");
    } else {
        //console.log(selectedNum.length);
        var selectedNum = selectedNumArray[0];
        bookRoom(selectedNum, count); 
    }
}

function bookRoom (selectedNum) {
    //inspect the parameter which one is choose
    if(rooms[selectedNum].checked && confirm("Are you sure choose this room?")) {
        var buildingName = rooms[selectedNum].name;
        var roomKey = rooms[selectedNum].id;
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser) {
                //email cannot as the key in firebase
                var email = firebaseUser.email;
                queryStudentId(email, buildingName, roomKey);
            } else {
                //
                alert("You have not log in");
            }
        });
    }
}

//var email = '123@test.ie';
//console.log(queryStudentId(email));
function queryStudentId(email, buildingName, roomKey) {
    var testRef = firebase.database().ref("/All/StudentList");
    testRef.orderByChild("email").equalTo(email).on("value", snap => {
        snap.forEach(childSnap => {
            var studentId = childSnap.child("studentId").val();
            var name = childSnap.child("name").val();
            if(studentId != null && studentId != "") {
                //console.log(studentId);
                confirmRepeatSelect(studentId, name, buildingName, roomKey);
            } else {
                console.log("Not found");
            }
        });
    });    
}

function confirmRepeatSelect (studentId, name, buildingName, roomKey) {
    var ref = firebase.database().ref('All/BookedList');
    ref.once("value").then(snap => {
        if(!snap.child(studentId).exists()) {
            checkAvailability(studentId, name, buildingName, roomKey);
        } else {
            alert("Sorry, you have booked room!");
        }
    });
}

function checkAvailability(studentId, name, buildingName, roomKey) {
    const ref = firebase.database().ref('All/Location'+'/'+buildingName+'/'+roomKey);
    ref.once('value').then(snap => {
        var availability = snap.val().availability;
        //var price = snap.val().price;
        if(availability > 0) {
            updateAvilability(buildingName, roomKey, availability);
            console.log(1);
            recordTheRoom(studentId, name, buildingName, roomKey);
        } else if(availability < 1) {
            alert("This room was full!");
        }
    });
}

function updateAvilability(buildingName, roomKey, availability) {
    var after = availability - 1;
    var updateData = {
        availability: after
    };
    var path = {};
    path['All/Location'+'/'+buildingName+'/'+roomKey+'/availability'] = after;
    firebase.database().ref().update(path);
    //callback function here
    window.location = 'order.html';
}

function recordTheRoom(studentId, name, buildingName, roomKey) {
    firebase.database().ref('All/BookedList/' + studentId).set({
        name: name,
        buildingName: buildingName,
        roomKey: roomKey,
        semester: 2
    });
}

function hideFunction() {
    var name = this.name;
    var buildingName = document.getElementById(name);
    if(buildingName.style.display != "none") {
        buildingName.style.display = "none";
    } else {
        buildingName.style.display = "block"
    }
}

function relist(number) {
    var roomArray = [];
    var ref = firebase.database().ref('All/Location').orderByChild('price');
    ref.once("value").then(function (snap) {
        snap.forEach(function (child) {
            child.forEach(function (childsnap) {
                roomArray.push(childsnap);
            })
        })
        var result = mergeSort(roomArray, number);
        //
        if(number == 1) {
            //遍历
            for(let i = 0; i < result.length; i++) {
                console.log(result[i].val().price);
            }
            //return result;
        } else {
            for(let i = 0; i < result.length; i++) {
                console.log(result[i].val().availability);
            }
        }
    });
}

//MergeSort
function mergeSort(array, number) {
    if(array.length < 2) {
        return array;
    }
    var mid = parseInt(array.length / 2);
    var left = array.slice(0, mid);
    var right = array.slice(mid);
    return merge(mergeSort(left, number), mergeSort(right, number), number);
}

function merge(left, right, number) {
    var result = [];
    var low = 0, high = 0;
    while(low < left.length && high < right.length) {
        if(number == 1) {
            if(left[low].val().price > right[high].val().price) {
                result.push(right[high++]);
            } else {
                result.push(left[low++]);
            }
        } else {
            if(left[low].val().availability < right[high].val().availability) {
                result.push(right[high++]);
            } else {
                result.push(left[low++]);
            }
        }
    }
    while(low < left.length) {
        result.push(left[low++]);
    }
    while(high < right.length) {
        result.push(right[high++]);
    }
    return result;
}

function listByPrice() {
    var newList = relist(1);
    console.log(newList);
}

function listByAvailability() {
    var newList = relist(2);
    console.log(newList);
}


//Login page
var set;
function clear() {
    clearInterval(set);
}
function countTime() {
    var second = 59;
    var minute = 14;
    var secondNode = document.getElementById("secondNode");
    var minuteNode = document.getElementById("minuteNode");
    var timer = document.getElementById("timer");
    var note = document.getElementById("note");
    secondNode.innerHTML = second;
    minuteNode.innerHTML = minute + ":";
    set = setInterval(function () {
        second--;
        secondNode.innerHTML = second;
        if(second === 0 && minute === 0) {
            timer.innerHTML = "Please check your payment, if you have any problem pleas contact staff!";
            note.innerHTML = "Note: If you have not finished your payment, your appointment could be canceled.";
            clearInterval(set);
        } else if(second == 0) {
            second = 59;
            minute--;
            secondNode.innerHTML = second;
            minuteNode.innerHTML = minute + ":";
        }
    }, 1000);
}

//Order page

//Management page
//(Room Building and Student)


/*
function test(x, y) {
    return x + y;
}
function test2() {
    var i = test(3, 5);
    return i;
}
function test3() {
    return test2();
}

var z = test3();
console.log(z);

//第一个方法执行完毕之后再调用第二个方法保证同步方法;
//注册的时候添加学号 /email/studentid

                    callback function
                    function (error) {
                        console.log(1);
                        if(error) {
                            console.error(error);
                        } else {
                            //window.location = 'order.html';
                            console.log("success!");
                        }
                    }
                    

    var ref = firebase.database().ref("All/BookedList");
    ref.orderByChild("studentId").equalTo(18251993).on("value", function(snapshot) {
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot.child("studentId").val());
        })
    })




checkRecord('user1');
function checkRecord (email) {
    var ref = firebase.database().ref('All/BookedList');
    ref.once("value").then(function (snap) {
        if(!snap.child(email).exists()) {
            function recordTheRoom (email, buildingname, roomkey, semester) {
                firebase.database().ref('All/BookedList/' + email).set({
                    buildingName: buildingname,
                    roomKey: roomKey,
                    semester: semester
                });
            }
        } else {
            function error() {
               alert("You have booked room!");
            }
        }
    });
}

    jsonObject
    
    
    setTimeout(function () {
        console.log(checkRecord('user1'));
    }, 5);


    //dbRefList.on('child_added', snap => console.log(snap.val()));  有效
    
    dbRefCakeList.on('child_added', snap => {
        const ul = document.createElement('ul');
        ul.innerText = snap.key + ":" + snap.val();
        ul.id = snap.key;
        cakeRooms.appendChild(ul);
    });
    
    dbRefList.on('child_changed', snap => {
        const liChanged = document.getElementById(snap.key);
        liChanged.innerText = snap.val();
    });

    dbRefList.on('child_removed', snap => {
        const liToRemove = document.getElementById(snap.key);
        liToRemove.remove();
    });

    */