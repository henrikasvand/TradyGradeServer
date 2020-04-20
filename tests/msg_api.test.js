const supertest = require('supertest');
const app = require('../app');
const pool = require('../dao/poolConnection');
const { deleteAllmsgFromMsgTable } = require('../dao/msgDao');
const { NewChatMessage } = require('../dao/msg/dao');

const api = supertest(app);

// Creating a message before testing

let dummyUser = {
    name: 'John Doe',
    password: 'supersecretpasswordthatwouldbenormallyhashed',
    email: 'johndoe@hotmail.com'
};

describe('Testing /api/chat/messages route CRUD-requests', () => {
    let dummyChatUserId;
    test('Creating a user before msg tests should work', async () => {
        await api
            .post('api/users')
            .send(dummyUser)
            .then(res => {
                expect(res.statusCode).toBe(201);
                expect(res.body.id).toBeTruthy();
                dummyChatUserId = res.body.id;
            });
        //   await api 
        //   .post('api/chat')
        // pitääkö tehdä kans feikkinchätti? mihin postaa?
        // tarvitseeko feikki data jokaiselle riippuvuudelle? 

    });
    let dummyChatId = 1;
    let dummyId;
    let dummyData = {
        msg_user_id: dummyChatUserId,
        msg_chat_id: dummyChatId,
        msg_text: "Hei pitääkö tätäkin testaa?"
    };
    test(' messages should be returned as json', async () => {
        await api.get('/api/chat/messages')
            .expect(200)
            .expect('Content-type', /application\/json/);
    })
})