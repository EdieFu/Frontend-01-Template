let mod = require('../src/parser');
let assert = require('assert');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');


it('parse a single element', () => {   
    let doc = mod.parseHTML("<div></div>");
    //console.log(doc);
    let div = doc.children[0];
    assert.equal(div.tagName, "div");
    assert.equal(div.children.length, 0);
    assert.equal(div.type, "element");
    assert.equal(div.attributes.length, 0);
});


it('parse a single element with text content', () => {   
    let doc = mod.parseHTML("<div>hello</div>");
    let text = doc.children[0].children[0];
    //console.log(text);
    assert.equal(text.content, "hello");
    assert.equal(text.type, "text");
});


// line39
it('tag mismatch', () => {   
    try {
        let doc = mod.parseHTML("<div></vid>");
    } catch(e)
    {
        console.log(e);
        assert.equal(e.message, "Tag start end doesn't match!");
    }    
});


//line85-89
it('text with <', () => {   
    let doc = mod.parseHTML("<div>a < b</div>");
    let text = doc.children[0].children[0];
    assert.equal(text.content, "a < b");
    assert.equal(text.type, "text");
});


//line99
it('with property', () => {   
    let doc = mod.parseHTML("<div id=a class='cls' data=\"abc\" ></div>");
    let div = doc.children[0];

    let count = 0;

    for(let attr of div.attributes) {
        if(attr.name === "id") {
            count++;
            assert.equal(attr.value, "a");
        }
        if(attr.name === "class") {
            count++;
            assert.equal(attr.value, "cls");
        }
        if(attr.name === "data") {
            count++;
            assert.equal(attr.value, "abc");
        }
    }
    assert.ok(count === 3);
});


//line101
it('with property /', () => {   
    let doc = mod.parseHTML("<br/>");
});


//line103~104
it('with property(captal)', () => {   
    let doc = mod.parseHTML("<DIV id=a class='cls' data=\"abc\" ></DIV>");
    let div = doc.children[0];

    let count = 0;

    for(let attr of div.attributes) {
        if(attr.name === "id") {
            count++;
            assert.equal(attr.value, "a");
        }
        if(attr.name === "class") {
            count++;
            assert.equal(attr.value, "cls");
        }
        if(attr.name === "data") {
            count++;
            assert.equal(attr.value, "abc");
        }
    }
    assert.ok(count === 3);
});


//line215
it('with property 2', () => {   
    let doc = mod.parseHTML("<div id=a class='cls' data=\"abc\"></div>");
    let div = doc.children[0];

    let count = 0;

    for(let attr of div.attributes) {
        if(attr.name === "id") {
            count++;
            assert.equal(attr.value, "a");
        }
        if(attr.name === "class") {
            count++;
            assert.equal(attr.value, "cls");
        }
        if(attr.name === "data") {
            count++;
            assert.equal(attr.value, "abc");
        }
    }
    assert.ok(count === 3); 
});


//line217
it('with property 3', () => {   
    let doc = mod.parseHTML("<div id=a class='cls' data=\"abc\"/>");
    let div = doc.children[0];

    let count = 0;

    for(let attr of div.attributes) {
        if(attr.name === "id") {
            count++;
            assert.equal(attr.value, "a");
        }
        if(attr.name === "class") {
            count++;
            assert.equal(attr.value, "cls");
        }
        if(attr.name === "data") {
            count++;
            assert.equal(attr.value, "abc");
        }
    }
    assert.ok(count === 3);
});


//line258,272-274
it('attribute with no value', () => {   
    let doc = mod.parseHTML("<div class />");
    
});

it('attribute with no value', () => {   
    let doc = mod.parseHTML("<div class id/>");
    
});


/*script*/
it('script', () => {  
    let content = `
    <div>abcd</div>
<span>x</span>
/script>
<script
<
</
</s
</sc
</scr
</scri
</scrip
</script 
`
    let doc = mod.parseHTML(`<script>${content}</script>`);
    let text = doc.children[0].children[0];

    assert.equal(text.content, content);
    assert.equal(text.type, "text");
});
