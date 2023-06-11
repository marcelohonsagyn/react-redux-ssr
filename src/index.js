import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';
import Routes from './client/Routes';
import proxy from 'express-http-proxy';
const { StatusCodes } = require('http-status-codes');

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
        }).map(promise => {
            if (promise) {
                return new Promise((resolve, reject) => {
                    promise.then(resolve).catch(resolve);
                });
            }   
        });

        Promise.all(promises).then(() => {
            const context = {};
            var result = renderer(req, store, context);

            if (context.url) {
                return res.redirect(StatusCodes.MOVED_PERMANENTLY, context.url);
            }

            if (context.notFound) { 
                return res.status(StatusCodes.NOT_FOUND).send(result)
            }   

            return res.status(StatusCodes.OK).send(result);
        });
    }
);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
    }
);