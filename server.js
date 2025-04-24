const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return;
    }

    const hash = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO users (name, email, password) VALUES(?, ?, ?)', [name, email, hash], (err) => {
        if (err) {
            return;
        }
        res.redirect('/index.html');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) return;
        
        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password);

        if(isValid){
            res.redirect(`/tarefas.html?user_id=${user.id}&name=${encodeURIComponent(user.name)}`);
        } else {
            return;
        }
    });
});

app.post('/adicionar', (req, res) => {
    const { user_id, name  } = req.query;
    const { nametarefa } = req.body;

    if (!nametarefa) {
        console.log(123);
    }

    db.query('INSERT INTO tarefas (nametarefa) VALUES(?)', [nametarefa], (err) => {
        if (err) {
            console.log(12);
        }
    });
});

app.get('/requireTarefas', (req, res) => {
    db.query('SELECT * FROM tarefas', (err, results) => {
        if(err) return;
        res.json(results);
    });
});

app.get('/verificar-user', (req, res) => {
    const { user_id, name  } = req.query;
    db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, results) => {
        if(err || results.length === 0) return res.json({ valid: false });
        const user = results[0];
        if(user.name !== name){
            return res.json({ valid: false });
        }
        return res.json({ valid: true });
    });
});

app.listen(3000)