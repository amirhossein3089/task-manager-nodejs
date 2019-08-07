const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId,userOne,setupDatabase,taskThree} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create task for user',async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description:'From my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should give us Tasks for UserOne',async ()=>{
    const tasks = await request(app)
    .get('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(tasks.body.length).toEqual(2)
})

test('should not be able to delete task,because of differenet owner',async ()=>{
    const tasks = await request(app)
    .delete(`/task/${taskThree._id}`)
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskThree._id)
    expect(task).not.toBeNull()
})
