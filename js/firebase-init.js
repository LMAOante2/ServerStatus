const firebaseConfig = {
  apiKey: "AIzaSyCBHxPa93ADxMdW45sBWynIzJNYmiZf_mA",
  authDomain: "flybrick-ca2ad.firebaseapp.com",
  databaseURL: "https://flybrick-ca2ad-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flybrick-ca2ad",
  storageBucket: "flybrick-ca2ad.appspot.com",
  messagingSenderId: "924948208654",
  appId: "1:924948208654:web:ff729068a4cea16b1ff05f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();



function writeLink(linkId, name, url) {
  return db.ref('links/' + linkId).set({
    icon: icon,
    name: name,
    url: url,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });
}


function readLinks(callback) {
  db.ref('links').once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (callback) callback(data);
    })
    .catch(error => {
      console.error("Read failed:", error);
    });
}

function listenToLinks(callback) {
  db.ref('links').on('value', snapshot => {
    const data = snapshot.val();
    if (callback) callback(data);
  });
}
