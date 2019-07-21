require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndRemove('5d039bf9790f011c0c168c23')
// .then(result=>{
//     return Task.countDocuments({completed:false})
// })
// .then((result)=>{
//     console.log(result)
// })
// .catch(e=>{
//     console.log(e)
// })

const updateAndCount = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

updateAndCount('5d039bf9790f011c0c168c23').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})