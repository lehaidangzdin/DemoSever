const express = require('express');
const router = express.Router();
const db = "mongodb+srv://danglh0603:t2L0Lj0fITK2QpJG@cluster0.qnxwn.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
router.use(cookieParser())

mongoose.connect(db).then(() => {
    console.log("connected");
}).catch(error => {
    console.log("co loi xay ra" + error);
});

const Demo = new mongoose.Schema({
    link: "string",
    author: "string",
    date: "date",
    infor: "string"
})
const content = mongoose.model("demo", Demo);

const Login = new mongoose.Schema({
    username: "string",
    password: "string",
    email: "string"
})
const login = mongoose.model("users", Login);


/* LOGIN PAGE*/
router.get('/home', function (req, res, next) {
    try {
        let token = req.cookies;
        console.log(token);
        let ketqua = jwt.verify(token.token, "mk");
        if (ketqua) {
            next();
        }
    } catch (e) {
        // res.json("ban can dang nhap");
        res.redirect('/');
    }
}, function (req, res, next) {
    content.find({}, function (err, data) {
        if (data != null) {
            // console.log(data[0].id);
            res.render('index', {title: 'Trang chủ', data: data});
            // res.send(data)
        }
    })
});
/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('login', {title: "Login", mess: ""})
});
/* GET register page. */
router.get('/register', function (req, res, next) {
    res.render('register', {title: "Register", mess: ""})
});
/* GET add page. */
router.get('/add', function (req, res, next) {
    try {
        let token = req.cookies;
        console.log(token);
        let ketqua = jwt.verify(token.token, "mk");
        if (ketqua) {
            next();
        }
    } catch (e) {
        // res.json("ban can dang nhap");
        res.redirect('/');
    }
}, function (req, res, next) {
    res.render('add', {title: 'Add'});
});
/* GET update page. */
router.get('/update/:id', function (req, res, next) {
    let id = req.params.id;
    content.find({_id: id}, function (err, data) {
        if (err) throw err;
        else {
            res.render('update', {title: 'Update', data});
        }
    })
});


/*POST add*/
router.post('/addImg', function (req, res, next) {
    try {
        let token = req.cookies;
        console.log(token);
        let ketqua = jwt.verify(token.token, "mk");
        if (ketqua) {
            next();
        }
    } catch (e) {
        // res.json("ban can dang nhap");
        res.redirect('/');
    }
}, function (req, res, next) {
    let link = req.body.linkImg;
    let author = req.body.author;
    let infor = req.body.infor;
    let date = new Date();
    let mess = "";
    const data = new content({
        link: link,
        author: author,
        date: date,
        infor: infor
    })

    data.save(function (err) {
        if (err) {
            throw err;
        }
    })
    res.redirect("/home");
})
/*POST update*/
router.post('/updateImg', function (req, res, next) {
    try {
        let token = req.cookies;
        console.log(token);
        let ketqua = jwt.verify(token.token, "mk");
        if (ketqua) {
            next();
        }
    } catch (e) {
        // res.json("ban can dang nhap");
        res.redirect('/');
    }
}, function (req, res, next) {
    let id = req.body.idImg;
    let link = req.body.linkImg;
    let author = req.body.author;
    let infor = req.body.infor;
    // console.log(id);
    content.updateOne({_id: id}, {link: link, author: author, infor: infor}, function (err) {
        if (err) throw err
        else {
            res.redirect("/home");

        }
    })
})
/* DELETE */
router.get("/deleteImg/:id", function (req, res, next) {
    let id = req.params.id;
    // console.log(id);
    content.deleteOne({_id: id}, function (err) {
        if (err) {
            throw err;
            console.log(err)
        } else {
            res.redirect("/home");
        }
    })
})

//================
/*POST login*/
router.post('/login', function (req, res, next) {
    let username = req.body.username;
    let pass = req.body.password;
    login.findOne({username: username, password: pass}, function (err, data) {
        if (err) {
            throw err;
        } else {
            if (data != null) {
                // console.log(data.id);
                // dang ki token gui ve client de xac thuc login
                var token = jwt.sign({
                    _id: data.id
                }, 'mk');
                // console.log(token);
                return res.json({
                    message: "Thanh cong",
                    token: token
                })

            } else {
                res.render('login', {title: "Login", mess: "Tên đăng nhập hoặc mật khẩu không chính xác!"})
            }
        }
    })
}, function (req, res, next) {
    res.redirect("/home");
})

/*POST add*/
router.post('/register', function (req, res, next) {
    let username = req.body.username;
    let email = req.body.email;
    let pass = req.body.password;
    let repass = req.body.repassword;
    if (pass == repass) {
        login.findOne({username: username}, function (err, data) {
            if (err) {
                throw err;
            } else {
                if (data != null) {
                    res.render('register', {title: "Register", mess: "Tên đăng nhập đã tồn tại!"})
                } else {
                    const acc = new login({
                        username: username,
                        password: pass,
                        email: email
                    })
                    acc.save(function (err) {
                        if (err) {
                            throw err;
                        } else {
                            res.redirect("/")
                        }
                    })
                }
                // console.log(data);
            }
        })
    }

})


module.exports = router;
