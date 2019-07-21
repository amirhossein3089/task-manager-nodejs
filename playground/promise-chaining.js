require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("5d03daacb4a8a20fcc525302", { age: 1 })
//   .then(() => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
//   })
//   .then(result => {
//     console.log(result);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({age})
  return count;
};

updateAgeAndCount('5d03daacb4a8a20fcc525302',2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})
