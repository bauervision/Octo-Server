import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

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
