var express = require('express');
const User = require('../models/User')
const URL = require('../models/Url')
var router = express.Router();



router.get('/task1', (req, res) => {
    res.render('Anand/helloworld_anand', { title: "TASK1-ANAND" })
})

router.get('/task2', (req, res) => {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('Anand/task2home', { url: url, page: "HOME", title: "TASK2-ANAND-HOME" })
})

router.get('/task2/about', (req, res) => {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('Anand/task2home', { url: url, page: "ABOUT", title: "TASK2-ANAND-ABOUT" })
})

router.get('/task2/contact', (req, res) => {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('Anand/task2home', { url: url, page: "CONTACT", title: "TASK2-ANAND-CONTACT" })
})

router.get('/task2/blog', (req, res) => {
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('Anand/task2home', { url: url, page: "BLOG", title: "TASK2-ANAND-BLOG" })
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



router.post('/urlshortner', async (req, res) => {

    const randomString = generateRandomString();
    const finalURL = `${req.protocol}://${req.get('host')}/anand/${randomString}`;
    const url = new URL({ longURL: req.body.url, shortURL: randomString });
    await url.save();
    console.log(req.body.url);
    res.render('Anand/task5', { title: "TASK5-ANAND", finalURL: finalURL, url: req.body.url })
})

router.get('/:randomString', async (req, res) => {
    console.log('called');
    const shortlink = req.params.randomString;
    console.log(shortlink);
    try {
        const link = await URL.findOne({ shortURL:shortlink })

        if (link) {
            const originalLink = link.longURL
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