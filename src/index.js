import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';
import Routes from './client/Routes';
import proxy from 'express-http-proxy';

const app = express();
app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts) {
        opts.headers['x-forwarded-host'] = 'localhost:3000';
        return opts;
    }
}));


app.use( express.static('public'));
app.get('*', (req, res) => {
        const store = createStore(req);
        const promises = matchRoutes(Routes, req.path).map(({ route }) => {
            var loadStore =  route.loadData ? route.loadData(store) : null;
            return loadStore;
        });
        
        Promise.all(promises).then(() => {
            var result =renderer(req, store);
            res.send(result);
        });
        
    }
);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
    }
);