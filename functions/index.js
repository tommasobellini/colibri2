const GlobalConstants = require('./utils/GlobalConstants');

// GLOBAL CONSTANTS //

// First View (from top)
const TOP_VIEW_MIN_AX = -0.2;
const TOP_VIEW_MIN_AY = -0.2;
const TOP_VIEW_MIN_AZ = 0.65;

const TOP_VIEW_MAX_AX = 0.3;
const TOP_VIEW_MAX_AY = 0.3;
const TOP_VIEW_MAX_AZ = 1.15;

// Second View (from bottom)
const BOTTOM_VIEW_MIN_AX = -1.15;
const BOTTOM_VIEW_MIN_AY = -0.2;
const BOTTOM_VIEW_MIN_AZ = -0.2;

const BOTTOM_VIEW_MAX_AX = -0.65;
const BOTTOM_VIEW_MAX_AY = 0.3;
const BOTTOM_VIEW_MAX_AZ = 0.3;

// Third View (from side)
const SIDE_VIEW_MIN_AX = -0.2;
const SIDE_VIEW_MIN_AY = -1.15;
const SIDE_VIEW_MIN_AZ = -0.2;

const SIDE_VIEW_MAX_AX = 0.3;
const SIDE_VIEW_MAX_AY = -0.65;
const SIDE_VIEW_MAX_AZ = 0.3;

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);



// Colibri functions + algoritms

// 1. Get the current hand position
exports.getHandPosition = functions.https.onCall((req) => {
    const data = req.message;
    let currentAXPosition = 'NULL';
    let currentAYPosition = 'NULL';
    let currentAZPosition = 'NULL';
    let currentPosition = 'NULL';
    // CHECK 'AX'
    if(data['AX'] >= BOTTOM_VIEW_MIN_AX && data['AX'] <= BOTTOM_VIEW_MAX_AX) {
        currentPosition = 'BOTTOM';
    } 

    // CHECK 'AY'
    if(data['AY'] >= SIDE_VIEW_MIN_AY && data['AY'] <= SIDE_VIEW_MAX_AY) {
        currentPosition = 'SIDE';
    }

    // CHECK 'AZ'
    if(data['AZ'] >= TOP_VIEW_MIN_AZ && data['AZ'] <= TOP_VIEW_MAX_AZ) {
        currentPosition = 'TOP';
    } 
    let message = ''
    console.log(currentAXPosition);
    console.log(currentAYPosition);
    console.log(currentAZPosition);
    if(currentPosition != 'NULL'){
        message = 'The current hand position is: ' + currentPosition
    } else {
        message = 'The current hand position is: ' + 'UNDEFINED'
    }
    return {
        message: message,
        position: currentPosition
    }
})
// 2.

// 3.

// 4.

exports.helloWorld = functions.https.onCall((data) => {
 var mymex = data.message
 var db = admin.firestore()
 var count = 0
 db.collection('devices').get().then(snapshot => {
    snapshot.forEach(doc => {
        var key = doc.id;
        var data = doc.data();
        console.log(data)
        count += 1;
    });

 })
 return {
     message: mymex,
     value: count
 }
});