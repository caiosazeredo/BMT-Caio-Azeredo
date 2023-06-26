const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const officegen = require('officegen');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generateQuestions', async function(req, res) {
    const { examTopic, subtopics, numQuestions } = req.body;

    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/completions';
    const model = 'text-davinci-001';

    let doc = officegen('docx');
    let pObj;

    for (let i = 0; i < numQuestions; i++) {
        const prompt = `crie uma questão de prova sobre ${examTopic}, ${subtopics[i % subtopics.length]}`;

        const response = await axios.post(apiUrl, {
            model: model,
            prompt,
            temperature: 0.5,
            max_tokens: 150,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        pObj = doc.createP();
        pObj.addText(response.data.choices[0].text.trim());
    }

    let out = fs.createWriteStream('questions.docx');
    doc.generate(out);

    out.on('close', function () {
        console.log('Document created successfully');
    });

    res.send('Document created successfully');
});

const port = 3000;

app.listen(port, function() {
    console.log(`Servidor rodando na porta ${port}.`);
});
