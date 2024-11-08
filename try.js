const friends=["true","Chirag","dhamo","hetyo","himu","dhruvi"]

function isFriend(arr,value){
  // console.log(arr);
  
    console.log(arr.some((name)=>name===value))
}
isFriend(friends,"true")
let name;
console.log(typeof name);
console.log(name?.trim()==="");

const info= {
  fullname: "John Doe",
  email: "john@example.com",
  username: "johndoe",
 
  // password is missing
};
const {fullname,email,username,password}=info
console.log([fullname,email,username,password].some((field) => (field?.trim() ?? "") === ""));