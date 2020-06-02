import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

// cors.CorsOptions = {
//     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
//     credentials: true,
//     methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
//     origin: true,

// };

admin.initializeApp();


// setup a function which will push out a message notifying the DB has updated
// export const onAdminChange = functions.firestore.document('data/users').onUpdate(change => {
//     const after = change.after.data();
//     // handle the message to be sent
//     const payload = {
//         data: {
//             admin: String(after?.admin),
//             name: after?.name
//         }
//     }
//     return admin.messaging().sendToTopic('data_users', payload);

// })

// setup endpoint to GET

export const getUsers = functions.https.onRequest((request, response) => {
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

    // set up the data
    const data = {
        age: request.query.age,
        gender: request.query.gender,
        initial: request.query.initial,
        chosen: request.query.chosen
    }

    // // block gets
    if (request.method !== 'POST') {
        return response.status(500).json({
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
    }).catch(error => console.error(error));



})