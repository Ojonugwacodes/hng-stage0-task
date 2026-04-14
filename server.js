const express =  require('express');
const cors = require('cors');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


const app = express();
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('<p>Welcome to the Gender Classification API! Check out the docs at <a href="/api-docs">/api-docs</a> to classify a name.</p>');
});
app.get('/api/classify', async(req, res) => {
    try {
        const name  = req.query.name;
        
        if (typeof name !== 'string') {
            return res.status(422).json({
                status: 'error',
                message: '"name" must be a string'
            });
        }
        if (name === undefined || name === null || name === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Missing or empty "name" query parameter'
            });
        }
        const response = await axios.get('https://api.genderize.io', {
            params: { name },
            timeout: 5000
        });
        const { gender, probability, count } = response.data;

        if (gender === null || count === 0) {
            return res.status(200).json({
                status: 'error',
                message: 'No prediction available for the provided name'
            });
        }
        // Process the response and send back the result
        const sample_size = count;
        const is_confident = probability >= 0.7 && sample_size >= 100;
        const processed_at = new Date().toISOString();

        return res.status(200).json({
            status: 'success',
            data: {
                name,
                gender,
                probability,
                sample_size,
                is_confident,
                processed_at
            }
        });

    }catch(error){
        if (error.response) {
            return res.status(502).json({
                status: 'error',
                message: 'Failed to fetch response from Genderize API'
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
