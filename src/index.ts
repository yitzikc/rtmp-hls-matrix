import { createServer, Request, Next, Response, plugins } from 'restify';
import { setRoutingOnNginx } from './routing-control';
import { join } from 'path';

const setRouting = (
  routings: object, res: Response, next: Next
) => {
    // FIXME: Set the type of next to something sensible!
    console.log("Applying routings %s", JSON.stringify(routings));
    setRoutingOnNginx(routings).then( (result: any) => {
      res.send({ mappings: routings });
    },
    (error: any) => {
      res.status(500);
      res.send({ message: "Failed to execute playbook" });
    });

    return next();
}

let server = createServer();
server.use(plugins.bodyParser({
}));


const setMultipleRoutings = (
  req: Request, res: Response, next: Next
) => {
  const routings = req.body;
  return setRouting(routings, res, next);
}

server.post('/api/v1/routing', setMultipleRoutings);

const setSingleRouting = (
  req: Request, res: Response, next: Next
) => {
  const newSource = req.body.source;
  if (newSource == undefined) {
    res.status(400);
    res.send({ message: "No source specified" });
    return next();
  }

  const routing = { [req.params.stream]: newSource.toString() };
  return setRouting(routing, res, next);
}

server.put('/api/v1/routing/:stream', setSingleRouting);

server.get('/ui/*', plugins.serveStatic({
  directory: join(__dirname, ".."),
}));

server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});
