(function () {
	const config = {
        apiKey: "AIzaSyBFpk2n34wvReaeKeZ7KKIp2r9f9fCAr7c",
        authDomain: "groupproject-712e1.firebaseapp.com",
        databaseURL: "https://groupproject-712e1.firebaseio.com",
        projectId: "groupproject-712e1",
        storageBucket: "groupproject-712e1.appspot.com",
        messagingSenderId: "785543171942"
    };
    firebase.initializeApp(config);

    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnSignUp = document.getElementById('btnSignUp');

    //Login event
    btnLogin.addEventListener('click', e => {
        var email = txtEmail.value;
        var pass = txtPassword.value;
        var auth = firebase.auth();

        //Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(e => console.log(e.massage));
    })

    //SignUp event

    btnSignUp.addEventListener('click', e => {
        var auth = firebase.auth();
        var emailVal = txtEmail.value;
        var passVal = txtPassword.value;
        
        var studentId = txtStudentId.value;
        var nameVal = txtName.value;
        //signUp(emailVal, studentId, nameVal);

        //Sign up - auth
        const checkRef = firebase.database().ref("/All/StudentList");
        /*
        signUpRef.once("value")
            .then(snap => {
                var result = snapa.exists();
            })

        */
        checkRef.orderByChild("studentId").equalTo(studentId).once("value", snap => {
            snap.forEach(childSnap => {
                const email = childSnap.child("email").val();
                if(emailVal == email) {
                    alert("You have signed up!");
                    return;
                } else {
                    const promise = auth.createUserWithEmailAndPassword(emailVal, passVal);
                    promise.catch(e => console.log(e.massage));
                    const dbRef = firebase.database().ref('All/StudentList');
                    const value = {
                        studentId : {
                            email : emailVal,
                            name : nameVal,
                        }
                    }
                    dbRef.push().set(value, error => {
                        if(error) {
                            console.log('Sign up failed, please try again');
                        } else {
                            console.log("Sign up successful!");
                            window.location = "index.html";
                        }
                    });
                }
            });
        });

    })

    //Logout Event
    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
        window.location = 'index.html';
    });

    const loginBtn = document.getElementById("btnLogin");
    const logoutBtn = document.getElementById("btnLogout");

    //realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            window.location = 'index.html';
        } else {
            console.log('not logged in');
            btnLogout.style.display = "none";
        }
    });
}());
    
//orderByChild("studentId").
/*
(function () {
    const dbRef = firebase.database().ref("All/StudentList");
    dbRef.orderByChild("studentId").equalTo("10000001").once("value").then(snap => {
        //const result = snap.hasChild("10000001");
        snap.forEach(child => {
            const result = child.child("studentId").val();
            console.log(result);
            if(result == 10000001) {
                console.log(1);
                return;
            }
        })
    });
}())
*/