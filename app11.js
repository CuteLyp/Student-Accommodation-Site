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
        const buildingList = document.getElementById('buildingList');
        const div = document.createElement('div');
        const b = document.createElement('b');
        b.innerHTML = (snap.key).fontsize(5);
        div.appendChild(b);
        div.setAttribute("class", "building");
        div.id = snap.key;
        buildingList.appendChild(div);
        
        const sideBar = document.getElementById('homeSubmenu');
        const sides = document.createElement('li');
        const sides_a = document.createElement('a');
        sides_a.onclick = hideFunction;
        sides.id = snap.key + '_sides';
        sides.setAttribute("name", snap.key);
        sides_a.innerHTML = snap.key;
        sides_a.style.cursor = "pointer";
        sides_a.setAttribute("name", snap.key);
        sides.appendChild(sides_a);
        sideBar.appendChild(sides);

        let index = 0;
        let queue = [];
        snap.forEach(childSnap => {
            var roomkey = childSnap.key;
            const ul = document.createElement('div');
            div.setAttribute("style", "padding-bottom: 50px");
            div.appendChild(ul);

            ul.innerHTML = (jsUcfirst(snap.key).bold() + " " + jsUcfirst(roomkey)).bold().fontsize(5);
            ul.setAttribute("building", snap.key);
            ul.setAttribute("class", "col-sm");
            ul.setAttribute("style", "text-align: left;padding-top: 50px;padding-left: 20px;padding-bottom: 50px;padding-right:20px;border: 2px solid #dadada;border-radius: 7px;outline: none;border-color: #9ecaed;box-shadow: 0 0 10px #9ecaed;");
            ul.id = roomkey;

            //div.appendChild(ul);
            if(index % 2 !== 0) {
                const row = document.createElement('div');
                row.setAttribute("class", 'row');
                queue.push(ul);
                div.appendChild(row);
                while(queue.length !== 0) {
                    row.appendChild(queue.shift());
                }
            } else {
                queue.push(ul);
            }            
            index++;

            childSnap.forEach(attributes => {
                if(attributes.key == 'aimage') {
                    const img = document.createElement('img');
                    img.setAttribute("src", attributes.val());
                    img.setAttribute("style", "float:right");
                    img.style.height = '200px';
                    img.style.width = '200px';
                    ul.appendChild(img);
                } else if(attributes.key == 'price' || attributes.key == 'availability') {
                    const span = document.createElement('span');
                    const li = document.createElement('li');
                    li.innerHTML = jsUcfirst(attributes.key).bold() + ': ';
                    li.appendChild(span);
                    li.setAttribute("name", attributes.key);
                    ul.appendChild(li);
                    span.innerHTML = attributes.val();
                } else {
                    const li = document.createElement('li');
                    ul.appendChild(li);
                    li.setAttribute("name", attributes.key);
                    li.innerHTML = jsUcfirst(attributes.key).bold() + ': ' + attributes.val();
                }
            });

            checkBoxDiv = document.createElement('div');
            const selected = document.createElement('input');
            selected.setAttribute("type", "checkbox");
            selected.setAttribute("id", roomkey);
            selected.setAttribute("name", snap.key);
            checkBoxDiv.appendChild(selected);
            checkBoxDiv.innerHTML += '  Choose this room';
            ul.appendChild(checkBoxDiv);
        });
    });
    
    //change included(replace and change)
    dbRef.on('child_changed', snap => {
        const building = document.getElementById(snap.key);
        building.innerHTML = '';
        const b = document.createElement('b');
        b.innerHTML = (snap.key).fontsize(5);
        building.appendChild(b);

        let index = 0;
        let queue = [];
        snap.forEach(childSnap => {
            var roomkey = childSnap.key;
            const ul = document.createElement('div');
            building.setAttribute("style", "padding-bottom: 50px");
            building.appendChild(ul);

            ul.innerHTML = (jsUcfirst(snap.key).bold() + " " + jsUcfirst(roomkey)).bold().fontsize(5);
            ul.setAttribute("building", snap.key);
            ul.setAttribute("class", "col-sm");
            ul.setAttribute("style", "text-align: left;padding-top: 50px;padding-left: 20px;padding-bottom: 50px;padding-right:20px;border: 2px solid #dadada;border-radius: 7px;outline: none;border-color: #9ecaed;box-shadow: 0 0 10px #9ecaed;");
            ul.id = roomkey;

            //div.appendChild(ul);
            if(index % 2 != 0) {
                const row = document.createElement('div');
                row.setAttribute("class", 'row');
                queue.push(ul);
                building.appendChild(row);
                while(queue.length != 0) {
                    row.appendChild(queue.shift());
                }
            } else {
                queue.push(ul);
            }
            index++;

            childSnap.forEach(attributes => {
                if(attributes.key == 'aimage') {
                    const img = document.createElement('img');
                    img.setAttribute("src", attributes.val());
                    img.setAttribute("style", "float:right");
                    img.style.height = '200px';
                    img.style.width = '200px';
                    ul.appendChild(img);
                } else if(attributes.key == 'price' || attributes.key == 'availability') {
                    const span = document.createElement('span');
                    const li = document.createElement('li');
                    li.innerHTML = jsUcfirst(attributes.key).bold() + ': ';
                    li.appendChild(span);
                    li.setAttribute("name", attributes.key);
                    ul.appendChild(li);
                    span.innerHTML = attributes.val();
                } else {
                    const li = document.createElement('li');
                    ul.appendChild(li);
                    li.setAttribute("name", attributes.key);
                    li.innerHTML = jsUcfirst(attributes.key).bold() + ': ' + attributes.val();
                }
            });

            checkBoxDiv = document.createElement('div');
            const selected = document.createElement('input');
            selected.setAttribute("type", "checkbox");
            selected.setAttribute("id", roomkey);
            selected.setAttribute("name", snap.key);
            checkBoxDiv.appendChild(selected);
            checkBoxDiv.innerHTML += '  Choose this room';
            ul.appendChild(checkBoxDiv);

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
        //ul.innerHTML = snap.key;
        div.appendChild(ul);
        bookedList.appendChild(div);
        //details of every student information
        snap.forEach(childsnap => {
            const li = document.createElement('li');
            li.innerHTML = childsnap.val();
            //ul.appendChild(li);
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
    let count = 0;
    let selectedNumArray = [];
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
        const selectedNum = selectedNumArray[0];
        bookRoom(selectedNum, count);
    }
}

function bookRoom (selectedNum) {
    //inspect the parameter which one is choose#
    console.log(1);
    if(rooms[selectedNum].checked && confirm("Are you sure choose this room?")) {
        const buildingName = rooms[selectedNum].name;
        const roomKey = rooms[selectedNum].id;
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser) {
                //email cannot as the key in firebase
                const email = firebaseUser.email;
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
    console.log(2);
    const testRef = firebase.database().ref("/All/StudentList");
    testRef.orderByChild("email").equalTo(email).on("value", snap => {
        snap.forEach(childSnap => {
            const studentId = childSnap.child("studentId").val();
            const name = childSnap.child("name").val();
            if(studentId != null && studentId != "") {
                //console.log(studentId);
                console.log(0);
                confirmRepeatSelect(studentId, name, buildingName, roomKey);
            } else {
                console.log("Not found");
            }
        });
    }, error => {
        if(error) {
            console.log(error);
        } else {
            console.log("successful");
        }
    });    
}

function confirmRepeatSelect (studentId, name, buildingName, roomKey) {
    console.log(3);
    console.log(studentId);
    const ref = firebase.database().ref('All/BookedList');
    ref.once("value").then(snap => {
        if(!snap.child(studentId).exists()) {
            checkAvailability(studentId, name, buildingName, roomKey);
        } else {
            alert("Sorry, you have booked room!");
        }
    });
}

function checkAvailability(studentId, name, buildingName, roomKey) {
    console.log(4);
    const ref = firebase.database().ref('All/Location'+'/'+buildingName+'/'+roomKey);
    ref.once('value').then(snap => {
        const availability = snap.val().availability;
        //var price = snap.val().price;
        if(availability > 0) {
            updateAvilability(buildingName, roomKey, availability);
            recordTheRoom(studentId, name, buildingName, roomKey);
        } else if(availability < 1) {

            $('input[type="checkbox"]:checked').prop('checked',false);

            alert("This room was full!");
        }
    });
}

function updateAvilability(buildingName, roomKey, availability) {
    console.log(5);
    const after = availability - 1;
    let updateData = {
        availability: after
    };
    let path = {};
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
    let name = this.name;
    const rooms = document.getElementsByClassName('col-sm');
    for(let i of rooms) {
        if(name == i.getAttribute('building')) {
            if(i.style.display != "none") {
                i.style.display = "none";
            } else {
                i.style.display = "block"
            }
        }
    }
}



//MergeSort
function mergeSort(array, number) {
    if(array.length < 2) {
        return array;
    }
    let mid = parseInt(array.length / 2);
    let left = array.slice(0, mid);
    let right = array.slice(mid);
    return merge(mergeSort(left, number), mergeSort(right, number), number);
}

function merge(left, right, number) {
    let result = [];
    let low = 0, high = 0;
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
    const list = document.getElementsByClassName('col-sm');
    let newList = document.getElementById('buildingList');
    const result = [...list];
    result.sort((a,b) => {
        return a.getElementsByTagName('span')[1].innerHTML - b.getElementsByTagName('span')[1].innerHTML
    })
    newList.innerHTML = "";
    let queue = [];
    for(let i = 0; i < result.length; i++) {
        if(i % 2 != 0) {
            const row = document.createElement('div');
            row.setAttribute("class", 'row');
            queue.push(result[i]);
            newList.appendChild(row);
            while(queue.length != 0) {
                row.appendChild(queue.shift());
            }
        } else {
            queue.push(result[i]);        
        }
    }
}

function listByAvailability() {
    const list = document.getElementsByClassName('col-sm');
    let newList = document.getElementById('buildingList');
    const result = [...list];
    result.sort((a,b) => {
        return b.getElementsByTagName('span')[0].innerHTML - a.getElementsByTagName('span')[0].innerHTML
    })
    newList.innerHTML = "";
    let queue = [];
    for(let i = 0; i < result.length; i++) {
        if(i % 2 != 0) {
            const row = document.createElement('div');
            row.setAttribute("class", 'row');
            queue.push(result[i]);
            newList.appendChild(row);
            while(queue.length != 0) {
                row.appendChild(queue.shift());
            }
        } else {
            queue.push(result[i]);        
        }
    }
}


function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/*
function welcome() {
    dd = document.getElementById("welcome");
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            email1 = firebaseUser.email;
            dd.innerHTML = ("Welcome ").bold().fontsize(5) + (email1).bold().fontsize(3) + "!".bold().fontsize(3);
        }
    })

}
welcome();
*/