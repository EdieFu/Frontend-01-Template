
// https://www.w3.org/TR/?tag=css

var lis = document.getElementById("container").children;

var result = []; //结果存在一个JSON文件里

for(let li of lis) {
    if(li.getAttribute('data-tag').match(/css/))
        //console.log(li.children[1].innerText)  //取到所有CSS标准的标题
        result.push({
            name:li.children[1].innerText,
            url:li.children[1].children[0].href,
        }) 
}
console.log(result);

console.log(JSON.stringify(result, null, "    "))


