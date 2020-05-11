function(){

}

new Promise(resolve => resolve()).then(() => console.log("1"))

setTimeout(function(){
    console.log("2")
    //new Promise(resolve => resolve() .then(console.log("1")))

},0)

console.log("3")
// console.log("3"),function(){return this.a}