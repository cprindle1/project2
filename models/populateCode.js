module.exports=[{
title: "Bubble Sort",
description: "Simple sorting algorithm that steps through an unsorted list comparing adjacent items",
code: `function bubbleSort(a)
{
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {
            if (a[i] > a[i+1]) {
                var temp = a[i];
                a[i] = a[i+1];
                a[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}`,
public: true,
tags: ["sort", 'bubble', 'comparision']
},
{
  title: "Caesar Cipher",
  description: "A substitution cipher where each letter in the original message (called the plaintext) is replaced with a letter corresponding to a certain number of letters up or down in the alphabet.",
  code: "function rot13(str) {var rotCharArray = [];var regEx = /[A-Z]/ ;str = str.split('');for (var x in str) {if (regEx.test(str[x])) {rotCharArray.push((str[x].charCodeAt() - 65 + 13) % 26 + 65);} else {rotCharArray.push(str[x].charCodeAt());}}str = String.fromCharCode.apply(String, rotCharArray);return str;}",
  public: true,
  tags: ["Caesar", 'Cipher', 'encryption', 'basic'],
},
{
  title: "Sessions Post Route",
  description: "Post route to login a user.  Passes 'req.sessions.valid' to indicate if a username or password is invalid",
  code: "router.post('/', function(req, res){User.findOne({username: req.body.username},function(err, foundUser){if(foundUser !== null){if(bcrypt.compareSync(req.body.password, foundUser.password)){Code.find({},function(err, foundCode){req.session.currentuser = foundUser;req.session.valid=true;res.redirect('/');});}else{req.session.valid=false;res.redirect('/');}}else{req.session.valid=false;res.redirect('/');}});});",
  public: true,
  tags: ["Routes", 'Restful', 'encryption', 'Sessions', 'bcrypt']
},
  {
    title: "Sessions Get Route",
    description: "Get route to establish a new session",
    code: "router.get('/new', function(req, res){res.render('sessions/new.ejs');});",
    public: true,
    tags: ["Routes", 'Restful', 'encryption', 'Sessions', 'new']
},
];
