import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp();

export const getUsers = functions.https.onRequest((request, response) => {

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    admin.firestore().doc('data/users').get().then(snapshot => {
        const data = snapshot.data();
        response.send(data);
    })
        .catch(error => {
            console.log(error);
            response.status(500).send(error)
        })
});


export const addUser = functions.https.onRequest((request, response) => {

    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    // set up the data
    const data = {
        age: request.query.age,
        gender: request.query.gender,
        initial: request.query.initial,
        chosen: request.query.chosen
    }

    // // block gets
    if (request.method !== 'POST') {

        response.status(500).json({
            message: 'Not allowed'
        })
    }

    // update the array data
    admin.firestore().doc('data/users').update({
        all: admin.firestore.FieldValue.arrayUnion(data)
    }).then(() => {
        response.status(200).json({
            message: `Success`,
            age: request.query.age,
            gender: request.query.gender,
            initial: request.query.initial,
            chosen: request.query.chosen

        })
    }).catch(error => {
        console.error(error);
        response.status(500).json({
            message: error
        })
    });



})