var express = require('express');
const User = require('../models/User')
const URLS = require('../models/Url')
const { URL } = require('url');
var router = express.Router();
const axios = require('axios')

const crypto = require('crypto');
const fs = require('fs');
const markdown = require('js-markdown-extra')
// const remark = require('remark');
// const parse = require('remark-parse');
// const stringify = require('remark-stringify');
// const markdownIt = require('markdown-it');
// const markdownItGFM = require('markdown-it-gfm');
const grayMatter = require('gray-matter');
const marked = require('marked')
const path = require('path');
const Url = require('../models/Url');
const ShortLinks = require('../models/ShortLinks');
router.get('/task1', (req, res) => {
    res.render('Anand/helloworld_anand', { title: "TASK1-ANAND" })
})

router.get('/task2', (req, res) => {
    var URLS = req.protocol + '://' + req.get('host') + req.originalURLS;
    res.render('Anand/task2home', { URLS: URLS, page: "HOME", title: "TASK2-ANAND-HOME" })
})

router.get('/task2/about', (req, res) => {
    var URLS = req.protocol + '://' + req.get('host') + req.originalURLS;
    res.render('Anand/task2home', { URLS: URLS, page: "ABOUT", title: "TASK2-ANAND-ABOUT" })
})

router.get('/task2/contact', (req, res) => {
    var URLS = req.protocol + '://' + req.get('host') + req.originalURLS;
    res.render('Anand/task2home', { URLS: URLS, page: "CONTACT", title: "TASK2-ANAND-CONTACT" })
})

router.get('/task2/blog', (req, res) => {
    var URLS = req.protocol + '://' + req.get('host') + req.originalURLS;
    res.render('Anand/task2home', { URLS: URLS, page: "BLOG", title: "TASK2-ANAND-BLOG" })
})

router.get('/task3', (req, res) => {
    res.render('Anand/task3', { title: "TASK3-ANAND" });
})

router.post('/calcualte', (req, res) => {
    var height = req.body.cm;
    console.log(height);
    if (req.body.format == 'ft') {
        var feet = req.body.feet;
        var inch = req.body.inch;
        height = feet * 0.3048 + inch * 0.0254
    } else {
        height = height / 100;
    }
    var bmi = req.body.weight / (height * height);
    var rbmi = Number((bmi).toFixed(1));
    res.render('Anand/task3', { bmi: rbmi })
})



router.get('/task4', (req, res) => {
    res.render('Anand/task4', { title: "TASK4-ANAND" });
})

router.post('/adddata', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body)

    user.save().then(data => {
        console.log(data);
    }).catch(error => console.log(error))
    res.render('Anand/task4');
})

function paginateData(page, pageSize, allData) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    var paginatedData = allData.filter((_, index) => index >= start && index <= end);

    return paginatedData;
}

router.get('/viewusers', async (req, res) => {
    const users = await User.find();

    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const data = paginateData(page, pageSize, users);
    var totalpages = Math.ceil(users.length / pageSize);
    console.log(data);
    res.render('Anand/task4viewusers', {
        data: data,
        currentPage: page,
        fristcondition: page > 1 ? true : false,
        secondconditon: page < totalpages ? true : false,
        totalPages: totalpages,
        c1: page + 1,
        c2: page - 1,
        title: "TASK4_ANAND-VIEW"
    });



})


router.get('/task5', (req, res) => {
    res.render('Anand/task5', { title: "TASK5-ANAND" })
})
function generateRandomString() {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyz'
    let shortLink = ''

    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length)
        shortLink += allowedChars.charAt(randomIndex)
    }

    return shortLink

}


function stringToInteger(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i);
    }
    return parseInt(result, 10);
}


// const password = 'your-password';
// const salt = crypto.randomBytes(16); // Generate a random salt
// const keyLength = 32; // 256 bits for AES-256
// const iterations = 100000; // Adjust as needed

// const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');

// const algorithm = 'aes-256-cbc';

// function hashURLSToThreeChars(URLS) {
//     const iv = crypto.randomBytes(16); // Generate a random IV
//     const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
//     let encrypted = cipher.update(URLS, 'utf8', 'base64');
//     encrypted += cipher.final('base64');
//     return { hash: encrypted.slice(0, 6), iv: iv.toString('base64') }; // Adjust to 6 characters for a length-3 result
// }

// function regenerateURLSFromHash(hash, iv) {
//     try {
//         const decipher = crypto.createDecipheriv(algorithm, derivedKey, Buffer.from(iv, 'base64'));
//         let decrypted = decipher.update(hash, 'base64', 'utf8');
//         decrypted += decipher.final('utf8');
//         return decrypted;
//     } catch (error) {
//         console.error('Decryption error:', error.message);
//         return null;
//     }
// }




router.post('/URLshortner', async (req, res) => {

    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let result = [];
    for (let i = 0; i < letters.length; i++) {
        for (let j = 0; j < letters.length; j++) {
            for (let k = 0; k < letters.length; k++) {
                result.push({ 'shortlink': letters[i] + letters[j] + letters[k] })
                // const short =new ShortLinks({shorlink:letters[i]+letters[j]+letters[k]})
                // await short.save()

                // console.log(letters[i]+letters[j]+letters[k]);
            }

        }

    }
    console.log(result);

    const response = await axios.head(req.body.url, { maxRedirects: 5, validateStatus: status => status < 400 });

    const t = response.request.res.responseUrl;
    await URLS.db.createCollection('a');
    // Normalize the URL
    const parsedUrl = new URL(t);
    const normalizedUrl = parsedUrl.href.toLowerCase().replace(/^https?/, 'https');
    console.log(normalizedUrl);
    const randomString = generateRandomString();
    // axios.get(URLS)
    //     .then(response => {
    //         console.log('Response:', response.data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error.message);
    //     });
    // var sURLS = "https://google.com";
    // const originalURLS = 'https://www.example.com';
    // const { hash, iv: usedIV } = hashURLSToThreeChars(originalURLS);
    // console.log('Hashed URLS:', hash);

    // const regeneratedURLS = regenerateURLSFromHash(hash, usedIV);
    // console.log('Regenerated URLS:', regeneratedURLS);

    const id = stringToInteger(randomString);
    const finalURLS = `${req.protocol}://${req.get('host')}/anand/${randomString}`;
    const url = new URLS({ _id: id, longURLS: req.body.URLS, shortURLS: randomString });
    await url.save();
    // console.log(req.body.URLS);
    res.render('Anand/task5', { title: "TASK5-ANAND", finalURL: finalURLS, url: req.body.url })
})

// router.get('/task6',(req,res)=>{
//     // const filePath = path.join('public', `markdown.md`)
//     // const markdown= fs.readFileSync(filePath,'utf8');
//     // const html=marked.parse(markdown);
//     res.render('Anand/task6')
// })


// const identifyMarkdownFlavor = (markdownContent) => {
//     // Check for GitHub Flavored Markdown (GFM) elements
//     const gfmPatterns = [
//         /```/,
//         /\*\*[\s\S]*?\*\*/,
//         /__[\s\S]*?__/,
//         /-\s\[ \]/,
//         /-\s\[x\]/
//         // Add more patterns as needed
//     ];

//     for (const pattern of gfmPatterns) {
//         if (markdownContent.match(pattern)) {
//             return 'gfm';
//         }
//     }

//     // If no GFM patterns match, assume it's a generic Markdown
//     return 'commonmark';
// };


router.get('/task6', (req, res) => {
    const filePath = path.join('public', `markdown.md`);
    // const markdown = req.body.markdown;
    const markdownContent = fs.readFileSync(filePath, 'utf8');
    const parsedContent = grayMatter(markdownContent);
    // Parse the Markdown content
    // const syntaxTree = remark().use(parse).parse(markdownContent);

    // // Identify the Markdown flavor (e.g., 'commonmark', 'gfm')
    // const markdownFlavor = syntaxTree.children[0].type;
    // console.log(markdownFlavor);
    // // Stringify the syntax tree back to Markdown
    // const regeneratedMarkdown = remark().use(stringify).stringify(syntaxTree);

    // const rmarkdown = identifyMarkdownFlavor(markdownContent);
    // const md = markdownIt().use('gfm');
    // const html = md.render(markdownContent);
    // console.log(rmarkdown);
    // const titleMatch = markdownContent.match(/---\ntitle: (.+?)\n---/);

    // // Default title if not found
    // const title = titleMatch ? titleMatch[1] : 'TASK6';
    // console.log(parsedContent);
    const title = parsedContent.data.title || 'Default Title';
    var html = parsedContent.content;
    html = markdown.Markdown(html);
    const isHtml = /<\s*([a-zA-Z0-9]+)([^>]*)>/.test(html)

    if (isHtml) {

        res.render('Anand/task6', { html, title: title })
    } else {
        res.render('Anand/task6', { message: "There is error in the enterd markdown" })
    }

})
router.get('/task7', (req, res) => {
    res.render('Anand/task7', { ifpost: true })
})

router.post('/task7', (req, res) => {
    // console.log(req);


    // var cval;
    // var listItems;
    // if (req.body.one) {
    //     data[0].push({"item":req.body.item})
    //     listItems = data[0].map(item => `<li>${item.item}</li>`).join('');
    // }else if(req.body.two){
    //     data[1].push({"item":req.body.item})
    //     listItems = data[1].map(item => `<li>${item.item}</li>`).join('');
    // }else if(req.body.three){
    //     data[2].push({"item":req.body.item})
    //     listItems = data[2].map(item => `<li>${item.item}</li>`).join('');
    // }else if(req.body.four){
    //     data[3].push({"item":req.body.item})
    //     listItems = data[3].map(item => `<li>${item.item}</li>`).join('');
    // }
    // console.log(val);
    // res.send(`{{#each ${data}}}
    // <li>{{${this.item}}}</li>
    // {{/each}}`)


    //   const list = req.body.list;
    //   list.push(`<li>${req.body.item}</li>`)

    var count = req.body.childCount
    var position = req.body.position
    console.log('position' + position);
    console.log('count' + count);
    //  if (position==1) {
    //     res.send(`<li >${req.body.item}</li>`)
    //  }else if(position>1){
    //    console.log('positon:'+position);
    // res.set('HX-Retarget', `#list2>li:nth-child(${position})`)
    if (count == 0) {
        res.send(`
  <li >${req.body.item}<button hx-post="/anand/edit-item" hx-vars="{text:'${req.body.item}'}" hx-target="closest li">edit</button>
  <button hx-confirm="Are you sure you want to delete this item?" hx-post='/anand/delete-item' hx-target='closest li' hx-swap='delete' >delete</button>
  </li>
  `);
    } else if (position == 1) {
        res.set('HX-Reswap', 'afterbegin')
        // res.set('HX-Retarget', `#list2>li:nth-child(${position-1})`)
        res.send(`
        <li >${req.body.item}
        <button hx-post="/anand/edit-item" hx-vars="{text:'${req.body.item}'}" hx-target="closest li">edit</button>
        <button hx-confirm="Are you sure you want to delete this item?" hx-post='/anand/delete-item' hx-target='closest li' hx-swap='delete' >delete</button>
        </li>
        `);
    }

    else {
        res.set('HX-Reswap', 'afterend')
        res.set('HX-Retarget', `#list${req.body.num}>li:nth-child(${position - 1})`)
        res.send(`
    <li >${req.body.item}
    <button hx-post="/anand/edit-item" hx-vars="{text:'${req.body.item}'}" hx-target="closest li">edit</button>
    <button hx-confirm="Are you sure you want to delete this item?" hx-post='/anand/delete-item' hx-target='closest li' hx-swap='delete' >delete</button>
    </li>
        `);
    }

    //  }

})
router.post('/edit-item', (req, res) => {
    console.log(req.body.text);
    res.send(`<form hx-post="/anand/make-edit" hx-swap="innerHtml" hx-target="closest li" ><input name="text" value="${req.body.text}" type="text"/>
    <button type="sumbit">submit</button></form>
    `)
})
router.post('/make-edit', (req, res) => {
    res.send(`${req.body.text}<button hx-post="/anand/edit-item" hx-vars="{text:'${req.body.text}'}" hx-target="closest li">edit</button>`)
})

router.post('/delete-item',(req,res)=>{
   
    res.send('');
})

router.post('/add_dropdown', (req, res) => {
    var count = parseInt(req.body.childCount) + 2

    res.send(`<option value="${count}" selected>${count}</option>`)
})

router.get('/:randomString', async (req, res) => {
    console.log('called');
    const shortlink = req.params.randomString;
    try {
        const link = await URLS.findOne({ shortURLS: shortlink })

        if (link) {
            const originalLink = link.longURLS
            res.status(301).redirect(`${originalLink}`)
        } else {
            res.send('Short Link not found')
        }
    } catch (error) {
        console.error(error)
        res.send('Internal Server Error')
    }


})





module.exports = router;