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

(function () {
	//bookedlist loading part
    const bookedList = document.getElementById('roomList');
    const bookedListRef = firebase.database().ref('All/BookedList');
    bookedListRef.on('child_added', snap => {
        const div = document.createElement('div');
        const ul = document.createElement('ul');
        const button = document.createElement('button');
        ul.innerHTML = snap.key;
        button.innerHTML = 'Delete';
        button.name = snap.key;
        div.id = snap.key + 'div';
        button.onclick = deleteFunction;
        div.appendChild(ul);
        div.appendChild(button);
        bookedList.appendChild(div);
        //details of every student information
        snap.forEach(childsnap => {
            const li = document.createElement('li');
            li.innerHTML = childsnap.key + ": " + childsnap.val();
            ul.appendChild(li);
        });
    });

    bookedListRef.on('child_changed', snap => {
    	const div = document.createElement('div');
        const ul = document.createElement('ul');
        const button = document.createElement('button');
        ul.innerHTML = snap.key;
        button.innerHTML = 'Delete';
        button.name = snap.key;
        div.id = snap.key + 'div';
        button.onclick = deleteFunction;
        div.appendChild(ul);
        div.appendChild(button);
        bookedList.appendChild(div);
        //details of every student information
        snap.forEach(childsnap => {
            const li = document.createElement('li');
            li.innerHTML = childsnap.key + ": " + childsnap.val();
            ul.appendChild(li); 
        });
    })

    //bookedlist remove part
    bookedListRef.on('child_removed', snap => {
        const removedElement = document.getElementById(snap.key + 'div');
        removedElement.remove();
    });
}());

function deleteFunction() {
	name = this.name;
	if(confirm('Are you sure cancel his appointment?')) {
		const ref = firebase.database().ref('All/BookedList/' + name);
        let buildingName = '';
        let roomKey = '';
		ref.once('value').then(snap => {
            snap.forEach(childsnap => {
                if(childsnap.key == 'buildingName') {
                    buildingName = childsnap.val();
                } else if(childsnap.key == 'roomKey') {
                    roomKey = childsnap.val();
                }
            });
        }).then( () => {
            const newRef = firebase.database().ref('All/Location/' + buildingName + '/' + roomKey);
            newRef.once('value').then(snap => {
                snap.forEach(childsnap => {
                    if(childsnap.key == 'availability') {
                        let availability = childsnap.val();
                        const after = availability + 1;
                        let updateData = {
                            availability: after
                        };
                        let path = {};
                        path['All/Location' + '/' + buildingName +'/'+ roomKey +'/availability'] = after;
                        firebase.database().ref().update(path);
                        ref.remove();
                    }
                });
            });    
        });
	}
}