import { createServer, Request, Response, plugins } from 'restify';
import { setRoutingOnNginx } from './routing-control';

const setRouting = (req: Request, res: Response, next: any) => {
    // FIXME: Set the type of next to something sensible!
    console.log("Got request %s", JSON.stringify(req.body));
    setRoutingOnNginx(req.body);
    res.send(req.body);
    next();
}

let server = createServer();
server.use(plugins.bodyParser({
}));


server.post('/api/v1/routing', setRouting);


server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});
